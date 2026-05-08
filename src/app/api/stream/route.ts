import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { tripFormSchema } from '@/utils/validation';
import { buildSystemPrompt, buildUserPrompt } from '@/utils/ai';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});

/**
 * API Route Handler for streaming travel plan generation.
 * @param {NextRequest} req - The incoming request object
 * @returns {Response} - A streaming response containing AI-generated text
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    
    // 1. Validate input with Zod
    const validatedData = tripFormSchema.parse(body);

    // 2. Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(validatedData);

    // 3. Create stream with Anthropic
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });

    // 4. Return as ReadableStream for the client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('Streaming error:', error);
    
    if (error.name === 'ZodError') {
      return new Response(JSON.stringify({ error: 'Validation failed', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Failed to generate plan' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
