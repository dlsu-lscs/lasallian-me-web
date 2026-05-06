import { NextRequest, NextResponse } from 'next/server';
import { getSignedImageUrl } from '@/lib/s3';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  const signedUrl = await getSignedImageUrl(key);
  return NextResponse.redirect(signedUrl);
}
