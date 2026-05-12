import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { SubmitApplicationForm } from '../types/submit.types';

interface SubmitFormProps {
  onSubmit: (data: SubmitApplicationForm, files: File[]) => void;
  isSubmitting: boolean;
  submitLabel: string;
  error: string | null;
  isSuccess: boolean;
  onReset: () => void;
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function SubmitForm({ onSubmit, isSubmitting, submitLabel, error, isSuccess, onReset }: SubmitFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(toSlug(title));
    }
  }, [title, slugEdited]);

  // Create and revoke object URLs as selectedFiles changes
  useEffect(() => {
    const urls = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [selectedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    setSelectedFiles((prev) => {
      const combined = [...prev, ...incoming];
      return combined.slice(0, 5);
    });
    // Reset input so the same file can be re-added after removal
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        title: title.trim(),
        slug: slug.trim(),
        githubLink: githubLink.trim(),
        description: description.trim() || undefined,
        url: url.trim() || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      },
      selectedFiles,
    );
  };

  if (isSuccess) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Submitted for review!</h2>
        <p className="text-gray-600 mb-6">
          Your app has been submitted and is pending admin approval.
        </p>
        <Button variant="outline" onClick={onReset}>
          Submit another app
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Input
          label="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome App"
          required
        />
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            placeholder="my-awesome-app"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL-friendly identifier. Auto-generated from title; lowercase letters, numbers, hyphens only.
          </p>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What does your app do?"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />
        </div>
        <Input
          label="App URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://myapp.example.com"
        />
        <Input
          label="GitHub Link *"
          type="url"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          placeholder="https://github.com/user/repo"
          required
        />
        <Input
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="productivity, social, tools"
        />
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preview Images
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-md px-4 py-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-sm text-gray-500">
              Click to select images{' '}
              <span className="text-gray-400 text-xs">(up to 5, max 5 MB each)</span>
            </p>
          </div>

          {previewUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative group w-24 h-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={selectedFiles[i]?.name}
                    className="w-24 h-24 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting || !title.trim() || !slug.trim() || !githubLink.trim()}
        className="disabled:opacity-60"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
