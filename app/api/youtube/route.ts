// app/api/youtube/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCge2BVDGytK1o_OLwZadUEA";
  const MAX_RESULTS = 4;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Cheia YouTube API nu este configurată pe server.' }, { status: 500 });
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}&type=video`;

  try {
    // În producție, fetch-ul va fi cache-uit automat. Pentru revalidare la cerere:
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Revalidează la fiecare oră

    if (!response.ok) {
        const errorData = await response.json();
        console.error("YouTube API Error:", errorData);
        throw new Error(errorData.error?.message || 'Eroare la comunicarea cu YouTube API');
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 502 }); // Bad Gateway
  }
}