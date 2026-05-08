import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Proxies Google Places Autocomplete requests to keep API key secure.
 * @param {NextRequest} req - The incoming request
 * @returns {Promise<NextResponse>} - Autocomplete suggestions
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json({ error: 'Input is required' }, { status: 400 });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=(regions)&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
