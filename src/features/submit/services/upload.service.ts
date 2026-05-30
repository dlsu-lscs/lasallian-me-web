export interface UploadResult {
  key: string;
}

export async function uploadImages(files: File[]): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const params = new URLSearchParams({
      contentType: file.type,
      type: 'preview',
    });
    const presignResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/images/uploads/presigned?${params}`,
      { credentials: 'include' },
    );

    if (!presignResponse.ok) {
      const err = await presignResponse.json().catch(() => ({}));
      throw new Error(
        err?.error ?? 'Failed to get upload URL. Please try again.',
      );
    }

    const { presignedUrl, key } = await presignResponse.json();

    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
      credentials: 'omit',
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload "${file.name}". Please try again.`);
    }

    results.push({ key });
  }

  return results;
}

export async function uploadIcon(file: File): Promise<UploadResult> {
  const params = new URLSearchParams({
    contentType: file.type,
    type: 'icon',
  });
  const presignResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/images/uploads/presigned?${params}`,
    { credentials: 'include' },
  );

  if (!presignResponse.ok) {
    const err = await presignResponse.json().catch(() => ({}));
    throw new Error(
      err?.error ?? 'Failed to get upload URL. Please try again.',
    );
  }

  const { presignedUrl, key } = await presignResponse.json();

  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
    credentials: 'omit',
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload icon. Please try again.');
  }

  return { key };
}
