import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const ALLOWED_PREFIXES = ['preview-images/', 'icons/'];

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');

  if (!key || !ALLOWED_PREFIXES.some((p) => key.startsWith(p))) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return NextResponse.redirect(signedUrl, {
    status: 307,
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
