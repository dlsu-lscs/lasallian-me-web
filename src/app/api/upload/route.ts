import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, S3_BUCKET, getSignedImageUrl } from '@/lib/s3';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILES = 5;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File "${file.name}" exceeds 5 MB limit` }, { status: 400 });
    }
  }

  const results: { key: string; signedUrl: string }[] = [];

  for (const file of files) {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const key = `preview-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const signedUrl = await getSignedImageUrl(key);
    results.push({ key, signedUrl });
  }

  return NextResponse.json({ files: results });
}
