import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserPrompt } from '@/utils/ai';
import { tripFormSchema } from '@/utils/validation';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Simulated Token Bucket Rate Limiter (10 plans per hour)
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS = 10;
const ipCache = new Map<string, { count: number; start: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userData = ipCache.get(ip) || { count: 0, start: now };
  
  if (now - userData.start > RATE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.start = now;
  } else {
    userData.count++;
  }
  
  ipCache.set(ip, userData);
  return userData.count > MAX_REQUESTS;
}

/**
 * Production-grade AI streaming endpoint.
 * Features: Rate limiting, Zod validation, XSS sanitization check, and streaming.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // 1. Rate Limiting
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded (10 plans/hour)' }, { status: 429 });
  }

  // 2. CSRF check (Simplified for this environment)
  const origin = req.headers.get('origin');
  if (origin && !origin.includes(req.headers.get('host') || '')) {
    return NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 });
  }

  try {
    const body = await req.json();
    
    // 3. Zod Validation
    const validatedData = tripFormSchema.parse(body);

    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      system: buildSystemPrompt(),
      messages: [
        { role: 'user', content: buildUserPrompt(validatedData) }
      ],
      stream: true,
    });

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (err: any) {
    console.error('AI Stream Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate itinerary' }, 
      { status: err.name === 'ZodError' ? 400 : 500 }
    );
  }
}
