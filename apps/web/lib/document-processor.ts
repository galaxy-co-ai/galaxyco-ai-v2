const pdf = require("pdf-parse");
import * as cheerio from "cheerio";

/**
 * Document Processing Helper
 * Extracts text content from various document types
 */

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<{
  text: string;
  numPages: number;
  metadata?: any;
}> {
  try {
    const data = await pdf(buffer);

    return {
      text: data.text,
      numPages: data.numpages,
      metadata: {
        info: data.info,
        metadata: data.metadata,
      },
    };
  } catch (error: any) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract PDF text: ${error.message}`);
  }
}

/**
 * Extract text from plain text file
 */
export async function extractTextFromPlainText(
  buffer: Buffer,
): Promise<string> {
  try {
    return buffer.toString("utf-8");
  } catch (error: any) {
    console.error("Text extraction error:", error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

/**
 * Scrape and extract text from URL
 */
export async function scrapeURL(url: string): Promise<{
  title: string;
  text: string;
  description?: string;
  author?: string;
  publishDate?: string;
}> {
  try {
    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GalaxyCo-KnowledgeBase/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style tags
    $("script, style, nav, footer, header, aside").remove();

    // Extract title
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      "Untitled";

    // Extract description
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content");

    // Extract main content
    // Try to find main content area
    let text = "";
    const mainContent = $(
      'main, article, [role="main"], .content, .post-content',
    );

    if (mainContent.length > 0) {
      text = mainContent.text();
    } else {
      // Fallback to body
      text = $("body").text();
    }

    // Clean up text (remove extra whitespace)
    text = text.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();

    // Extract author
    const author =
      $('meta[name="author"]').attr("content") ||
      $('meta[property="article:author"]').attr("content") ||
      $('.author, [rel="author"]').first().text().trim();

    // Extract publish date
    const publishDate =
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="publish_date"]').attr("content") ||
      $("time[datetime]").attr("datetime");

    return {
      title: title.trim(),
      text: text.substring(0, 50000), // Limit to 50k chars
      description,
      author: author || undefined,
      publishDate: publishDate || undefined,
    };
  } catch (error: any) {
    console.error("URL scraping error:", error);
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
}

/**
 * Generate a summary of text content (simple version)
 * TODO: Replace with AI-generated summary later
 */
export function generateSimpleSummary(
  text: string,
  maxLength: number = 500,
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Take first few sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  let summary = "";

  for (const sentence of sentences) {
    if ((summary + sentence).length > maxLength) {
      break;
    }
    summary += sentence;
  }

  return summary.trim() || text.substring(0, maxLength) + "...";
}
