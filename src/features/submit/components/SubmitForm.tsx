import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/atoms/Input';
import { SubmitApplicationForm } from '../types/submit.types';
import { FiUpload, FiX, FiCheck } from 'react-icons/fi';

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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-white/60 mb-1.5">{children}</p>;
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-white/30">{children}</p>;
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugEdited) setSlug(toSlug(title));
  }, [title, slugEdited]);

  useEffect(() => {
    const urls = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)); };
  }, [selectedFiles]);

  const addFiles = (incoming: File[]) => {
    setSelectedFiles((prev) => [...prev, ...incoming].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')));
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
      <div className="flex flex-col items-center text-center py-8 gap-4">
        <div className="w-14 h-14 bg-green-500/15 border border-green-500/30 rounded-full flex items-center justify-center">
          <FiCheck className="w-7 h-7 text-green-400" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Submitted for review!</h2>
          <p className="text-white/50 text-sm">Your app is pending admin approval. We&apos;ll get to it soon.</p>
        </div>
        <button
          onClick={onReset}
          className="mt-2 px-5 py-2 rounded-full text-sm font-semibold bg-white/8 text-white/70 hover:bg-white/12 hover:text-white transition-colors cursor-pointer"
        >
          Submit another app
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome App"
        required
      />

      <div className="w-full">
        <FieldLabel>Slug *</FieldLabel>
        <input
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
          placeholder="my-awesome-app"
          required
          className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors"
        />
        <FieldHint>Auto-generated from title. Lowercase letters, numbers, and hyphens only.</FieldHint>
      </div>

      <div className="w-full">
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="What does your app do?"
          className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors resize-none"
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
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="productivity, social, tools"
      />
      <FieldHint>Comma-separated list of tags.</FieldHint>

      {/* Image upload */}
      <div className="w-full -mt-3">
        <FieldLabel>Preview Images</FieldLabel>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl px-4 py-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-white/30 bg-white/5'
              : 'border-white/10 hover:border-white/20 hover:bg-white/3'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <FiUpload className="w-5 h-5 text-white/30 mx-auto mb-2" />
          <p className="text-sm text-white/40">
            Drop images here or <span className="text-white/60 font-semibold">click to browse</span>
          </p>
          <p className="text-xs text-white/25 mt-1">Up to 5 images, max 5 MB each</p>
        </div>

        {previewUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previewUrls.map((previewUrl, i) => (
              <div key={i} className="relative group w-20 h-20 shrink-0">
                <img
                  src={previewUrl}
                  alt={selectedFiles[i]?.name}
                  className="w-20 h-20 object-cover rounded-lg border border-white/10"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Remove image"
                >
                  <FiX className="w-3 h-3" strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !slug.trim() || !githubLink.trim()}
        className="w-full py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-white/80 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-1"
      >
        {submitLabel}
      </button>
    </form>
  );
}
