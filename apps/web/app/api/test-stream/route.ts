/**
 * Simple test endpoint to verify streaming works
 */

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Create a simple text stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const message = 'Hello! This is a test streaming response.';

        // Send word by word
        const words = message.split(' ');
        for (const word of words) {
          controller.enqueue(encoder.encode(word + ' '));
          await new Promise((resolve) => setTimeout(resolve, 100)); // Delay for visibility
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
