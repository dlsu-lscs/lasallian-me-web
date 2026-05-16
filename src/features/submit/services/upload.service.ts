export interface UploadResult {
  key: string;
}

export async function uploadImages(files: File[]): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const params = new URLSearchParams({ fileName: file.name, contentType: file.type });
    const presignResponse = await fetch(`/api/upload?${params}`);

    if (!presignResponse.ok) {
      const err = await presignResponse.json().catch(() => ({}));
      throw new Error(err?.error ?? 'Failed to get upload URL. Please try again.');
    }

    const { presignedUrl, key } = await presignResponse.json();

    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload "${file.name}". Please try again.`);
    }

    results.push({ key });
  }

  return results;
}
