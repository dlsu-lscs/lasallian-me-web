export interface UploadResult {
  key: string;
  signedUrl: string;
}

export async function uploadImages(files: File[]): Promise<UploadResult[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error ?? 'Image upload failed. Please try again.');
  }

  const data = await response.json();
  return data.files as UploadResult[];
}
