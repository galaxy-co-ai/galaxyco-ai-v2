/**
 * Document Processing Service
 * 
 * Handles file upload, text extraction, AI summarization, auto-tagging,
 * and embedding generation for RAG.
 */

import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import sharp from "sharp";
import { put } from "@vercel/blob";

export interface ProcessDocumentParams {
  file: File;
  userId: string;
  workspaceId: string;
  collectionId?: string;
}

export interface ProcessedDocument {
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageUrl: string;
  content: string;
  summary: string;
  tags: string[];
  embeddings: number[][];
  metadata: {
    wordCount: number;
    language: string;
    extractedAt: string;
    chunks: number;
  };
}

export class DocumentProcessor {
  private embeddings: OpenAIEmbeddings;
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small", // Cheaper, faster
    });

    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  /**
   * Main processing pipeline
   */
  async processDocument(params: ProcessDocumentParams): Promise<ProcessedDocument> {
    const { file, userId, workspaceId } = params;

    // 1. Upload to Vercel Blob storage
    const storageUrl = await this.uploadFile(file, workspaceId, userId);

    // 2. Extract text content based on file type
    const content = await this.extractText(file);

    // 3. Generate summary using OpenAI
    const summary = await this.generateSummary(content);

    // 4. Auto-generate tags
    const tags = await this.generateTags(content);

    // 5. Split into chunks and generate embeddings
    const chunks = await this.textSplitter.splitText(content);
    const embeddings = await this.generateEmbeddings(chunks);

    return {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storageUrl,
      content,
      summary,
      tags,
      embeddings,
      metadata: {
        wordCount: content.split(/\s+/).length,
        language: "en", // TODO: Detect language
        extractedAt: new Date().toISOString(),
        chunks: chunks.length,
      },
    };
  }

  /**
   * Upload file to Vercel Blob storage
   */
  private async uploadFile(file: File, workspaceId: string, userId: string): Promise<string> {
    const fileName = `${workspaceId}/${userId}/${Date.now()}-${file.name}`;
    
    const buffer = await file.arrayBuffer();
    const blob = await put(fileName, buffer, {
      access: "public",
      addRandomSuffix: true,
    });

    return blob.url;
  }

  /**
   * Extract text from different file types
   */
  private async extractText(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const mimeType = file.type;

    // PDF
    if (mimeType === "application/pdf") {
      // Dynamic import for pdf-parse (CommonJS module)
      const PDFParse = (await import("pdf-parse")).default;
      const data = await PDFParse(Buffer.from(buffer));
      return data.text;
    }

    // DOCX
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      return result.value;
    }

    // Excel/CSV
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "text/csv"
    ) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheets = workbook.SheetNames.map((name) => {
        const sheet = workbook.Sheets[name];
        return XLSX.utils.sheet_to_txt(sheet);
      });
      return sheets.join("\n\n");
    }

    // Images (OCR with sharp metadata)
    if (mimeType.startsWith("image/")) {
      const image = sharp(Buffer.from(buffer));
      const metadata = await image.metadata();
      // TODO: Add OCR with Tesseract or Google Vision API
      return `Image: ${file.name}, ${metadata.width}x${metadata.height}, ${metadata.format}`;
    }

    // Plain text
    if (mimeType.startsWith("text/")) {
      return new TextDecoder().decode(buffer);
    }

    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  /**
   * Generate AI summary of document
   */
  private async generateSummary(content: string): Promise<string> {
    // Use OpenAI API directly for summarization
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Cheaper model for summaries
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates concise summaries of documents. Summarize in 2-3 sentences, focusing on key points.",
          },
          {
            role: "user",
            content: `Summarize this document:\n\n${content.slice(0, 4000)}`, // Limit to ~4k chars
          },
        ],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || "Summary unavailable";
  }

  /**
   * Auto-generate tags using AI
   */
  private async generateTags(content: string): Promise<string[]> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates relevant tags for documents. Return only a JSON array of 3-5 tags.",
          },
          {
            role: "user",
            content: `Generate tags for this document:\n\n${content.slice(0, 2000)}`,
          },
        ],
        max_tokens: 50,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const tagsString = data.choices[0]?.message?.content || "[]";
    
    try {
      return JSON.parse(tagsString);
    } catch {
      // Fallback: extract words from response
      return tagsString
        .replace(/[\[\]"]/g, "")
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0)
        .slice(0, 5);
    }
  }

  /**
   * Generate vector embeddings for text chunks
   */
  private async generateEmbeddings(chunks: string[]): Promise<number[][]> {
    const embeddings = await this.embeddings.embedDocuments(chunks);
    return embeddings;
  }

  /**
   * Calculate word count
   */
  getWordCount(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  /**
   * Detect language (simple heuristic)
   */
  detectLanguage(text: string): string {
    // Simple English detection (can be improved with a proper library)
    const englishWords = ["the", "and", "is", "to", "a", "of", "in", "for"];
    const words = text.toLowerCase().split(/\s+/).slice(0, 100);
    const englishCount = words.filter((w) => englishWords.includes(w)).length;
    
    return englishCount > 5 ? "en" : "unknown";
  }
}

// Export singleton instance
export const documentProcessor = new DocumentProcessor();
