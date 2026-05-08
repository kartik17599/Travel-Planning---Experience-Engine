import { NextRequest } from 'next/server';

/**
 * SSE endpoint for real-time trip updates (Weather, Advisories, Events).
 * Implements exponential backoff on client and clean cleanup on server.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination');

  if (!destination) {
    return new Response('Destination is required', { status: 400 });
  }

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendUpdate = async (type: string, payload: any) => {
    const data = JSON.stringify({ type, payload });
    await writer.write(encoder.encode(`data: ${data}\n\n`));
  };

  // Keep-alive interval
  const keepAlive = setInterval(() => {
    writer.write(encoder.encode(': keep-alive\n\n'));
  }, 15000);

  // Initial updates (Simulated real-time fetch)
  (async () => {
    try {
      await sendUpdate('weather', {
        temp: '22°C',
        condition: 'Partly Cloudy',
        forecast: '7-day forecast layer active'
      });

      await new Promise(r => setTimeout(r, 2000));
      await sendUpdate('advisory', {
        level: 1,
        text: 'Exercise normal precautions in ' + destination
      });

      await new Promise(r => setTimeout(r, 3000));
      await sendUpdate('crowd', {
        status: 'Optimal',
        note: 'Off-peak visit recommended for top attractions'
      });

    } catch (err) {
      console.error('SSE Stream error:', err);
    }
  })();

  req.signal.onabort = () => {
    clearInterval(keepAlive);
    writer.close();
  };

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
