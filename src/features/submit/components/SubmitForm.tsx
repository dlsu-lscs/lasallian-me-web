import { useState, useEffect } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { SubmitApplicationForm } from '../types/submit.types';

interface SubmitFormProps {
  defaultAuthorName: string;
  defaultAuthorEmail: string;
  onSubmit: (data: SubmitApplicationForm) => void;
  isSubmitting: boolean;
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

export function SubmitForm({
  defaultAuthorName,
  defaultAuthorEmail,
  onSubmit,
  isSubmitting,
  error,
  isSuccess,
  onReset,
}: SubmitFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [previewImages, setPreviewImages] = useState('');
  const [authorName, setAuthorName] = useState(defaultAuthorName);
  const [authorDescription, setAuthorDescription] = useState('');
  const [authorWebsite, setAuthorWebsite] = useState('');

  useEffect(() => {
    if (!slugEdited) {
      setSlug(toSlug(title));
    }
  }, [title, slugEdited]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      url: url.trim() || undefined,
      tags: tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      previewImages: previewImages
        ? previewImages.split('\n').map((u) => u.trim()).filter(Boolean)
        : undefined,
      authorName: authorName.trim(),
      authorEmail: defaultAuthorEmail,
      authorDescription: authorDescription.trim() || undefined,
      authorWebsite: authorWebsite.trim() || undefined,
    });
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
      {/* App Details Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          App Details
        </h2>
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
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="productivity, social, tools"
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview Image URLs
            </label>
            <textarea
              value={previewImages}
              onChange={(e) => setPreviewImages(e.target.value)}
              rows={3}
              placeholder="https://example.com/screenshot1.png&#10;https://example.com/screenshot2.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">One URL per line.</p>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Author Info
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Author Name *"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
          <Input
            label="Author Email"
            value={defaultAuthorEmail}
            readOnly
            className="bg-gray-50 cursor-not-allowed"
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Bio
            </label>
            <textarea
              value={authorDescription}
              onChange={(e) => setAuthorDescription(e.target.value)}
              rows={2}
              placeholder="A short bio about the author…"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
          </div>
          <Input
            label="Author Website"
            type="url"
            value={authorWebsite}
            onChange={(e) => setAuthorWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting || !title.trim() || !slug.trim()}
        className="disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit App for Review'}
      </Button>
    </form>
  );
}
