import OpenAI from 'openai';
import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as cheerio from 'cheerio';

export type ProcessOptions = {
  generateSummary?: boolean;
  generateEmbeddings?: boolean;
  extractKeywords?: boolean;
};

export type ProcessedDocument = {
  content: string;
  summary?: string;
  embeddings?: number[];
  keywords?: string[];
  wordCount: number;
  language?: string;
  processingTime: number;
  model?: string;
};

export class DocumentProcessor {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  private embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
  private summaryModel = process.env.OPENAI_SUMMARY_MODEL || 'gpt-4o-mini';

  async processDocument(file: File, opts: ProcessOptions = {}): Promise<ProcessedDocument> {
    const started = Date.now();
    const content = await this.extractText(file);

    let summary: string | undefined;
    let embeddings: number[] | undefined;
    let keywords: string[] | undefined;

    if (opts.generateSummary) {
      summary = await this.summarize(content);
    }

    if (opts.generateEmbeddings) {
      embeddings = await this.generateEmbeddings(content);
    }

    if (opts.extractKeywords) {
      keywords = await this.extractKeywords(content);
    }

    return {
      content,
      summary,
      embeddings,
      keywords,
      wordCount: this.countWords(content),
      language: undefined,
      processingTime: Date.now() - started,
      model: this.summaryModel,
    };
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const truncated = text.length > 8000 ? text.slice(0, 8000) : text;
    const res = await this.openai.embeddings.create({
      input: truncated,
      model: this.embeddingModel,
    });
    return res.data[0]?.embedding || [];
  }

  async suggestCategories(
    content: string,
    params: { existingCollections: string[]; documentTitle: string; documentType: string }
  ): Promise<{ suggestedCategories: string[]; suggestedTags: string[]; confidence: number }> {
    const system = `You are an assistant that classifies documents into knowledge base collections and proposes tags. Return strict JSON {categories: string[], tags: string[], confidence: number(0-1)}.`;
    const user = `Title: ${params.documentTitle}\nType: ${params.documentType}\nExisting Collections: ${params.existingCollections.join(
      ', '
    )}\n---\nContent:\n${content.slice(0, 3000)}`;

    const chat = await this.openai.chat.completions.create({
      model: this.summaryModel,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' } as any,
    });

    const raw = chat.choices[0]?.message?.content || '{}';
    let parsed: any = {};
    try {
      parsed = JSON.parse(raw);
    } catch {}

    return {
      suggestedCategories: Array.isArray(parsed.categories) ? parsed.categories : [],
      suggestedTags: Array.isArray(parsed.tags) ? parsed.tags : [],
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.6,
    };
  }

  private async summarize(text: string): Promise<string> {
    const prompt = `Summarize the following content in 5-7 concise bullet points for a knowledge base. Focus on facts, entities, and key takeaways.\n\n${
      text.length > 6000 ? text.slice(0, 6000) : text
    }`;
    const chat = await this.openai.chat.completions.create({
      model: this.summaryModel,
      messages: [
        { role: 'system', content: 'You are a concise technical summarizer.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    });
    return chat.choices[0]?.message?.content?.trim() || '';
  }

  private async extractKeywords(text: string): Promise<string[]> {
    const chat = await this.openai.chat.completions.create({
      model: this.summaryModel,
      messages: [
        { role: 'system', content: 'Extract 5-12 relevant keywords. Return JSON array of strings only.' },
        { role: 'user', content: text.length > 4000 ? text.slice(0, 4000) : text },
      ],
      temperature: 0.2,
    });

    const raw = chat.choices[0]?.message?.content || '[]';
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.map((x) => String(x)) : [];
    } catch {
      return [];
    }
  }

  private countWords(text: string): number {
    return (text.match(/\b\w+\b/g) || []).length;
  }

  private async extractText(file: File): Promise<string> {
    const name = file.name.toLowerCase();
    const type = file.type;
    const buf = Buffer.from(await file.arrayBuffer());

    if (type.includes('pdf') || name.endsWith('.pdf')) {
      const data = await (pdfParse as any)(buf);
      return data.text || '';
    }

    if (name.endsWith('.docx')) {
      const data = await mammoth.extractRawText({ buffer: buf });
      return data.value || '';
    }

    if (type.includes('html') || name.endsWith('.html') || name.endsWith('.htm')) {
      const $ = cheerio.load(buf.toString('utf8'));
      return $('body').text();
    }

    if (name.endsWith('.txt') || type.startsWith('text/')) {
      return buf.toString('utf8');
    }

    // Fallback: try to decode as UTF-8
    return buf.toString('utf8');
  }
}
