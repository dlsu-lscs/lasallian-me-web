import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/lib/s3';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function GET(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get('fileName');
  const contentType = req.nextUrl.searchParams.get('contentType');
  const type = req.nextUrl.searchParams.get('type');

  if (!fileName || !contentType) {
    return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: `Unsupported file type: ${contentType}` }, { status: 400 });
  }

  const ext = fileName.split('.').pop() ?? 'jpg';
  const prefix = type === 'icon' ? 'icons' : 'preview-images';
  const key = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const presignedUrl = await getPresignedUploadUrl(key, contentType);
  return NextResponse.json({ presignedUrl, key });
}
