import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  FiUpload, FiX, FiCheck,
  FiLayers, FiLink, FiUsers, FiImage,
  FiGlobe, FiGithub, FiUser, FiTag, FiHash,
} from 'react-icons/fi';
import { Input } from '@/components/atoms/Input';
import { SubmitApplicationForm } from '../types/submit.types';

interface SubmitFormProps {
  onSubmit: (data: SubmitApplicationForm, files: File[], iconFile?: File) => void;
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

function FormSection({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-white/40" />
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 sm:p-5 grid gap-4">
        {children}
      </div>
    </div>
  );
}

export function SubmitForm({ onSubmit, isSubmitting, submitLabel, error, isSuccess, onReset }: SubmitFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugEdited) setSlug(toSlug(title));
  }, [title, slugEdited]);

  useEffect(() => {
    const urls = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)); };
  }, [selectedFiles]);

  useEffect(() => {
    if (!iconFile) { setIconPreviewUrl(null); return; }
    const url = URL.createObjectURL(iconFile);
    setIconPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [iconFile]);

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
        url: url.trim(),
        description: description.trim() || undefined,
        author: author.trim() || undefined,
        githubLink: githubLink.trim() || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      },
      selectedFiles,
      iconFile ?? undefined,
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
      {/* App Info */}
      <FormSection icon={FiLayers} label="App Info">
        <Input
          label="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome App"
          required
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-white/60 mb-1.5">Slug *</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <FiHash className="w-4 h-4 text-white/30" />
            </div>
            <input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
              placeholder="my-awesome-app"
              required
              className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors"
            />
          </div>
          <p className="mt-1.5 text-xs text-white/30">
            Auto-generated from title. Lowercase, numbers, and hyphens.
          </p>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-white/60 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What does your app do?"
            className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors resize-none"
          />
        </div>
      </FormSection>

      {/* Links */}
      <FormSection icon={FiLink} label="Links">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="App URL *"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://myapp.example.com"
            required
            startIcon={FiGlobe}
          />
          <Input
            label="GitHub"
            type="url"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            placeholder="https://github.com/user/repo"
            startIcon={FiGithub}
          />
        </div>
      </FormSection>

      {/* Team */}
      <FormSection icon={FiUsers} label="Team">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Jane Doe or LSCS Dev Team"
            startIcon={FiUser}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-white/60 mb-1.5">Tags</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <FiTag className="w-4 h-4 text-white/30" />
              </div>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="productivity, social, tools"
                className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-white/30">Comma-separated list</p>
          </div>
        </div>
      </FormSection>

      {/* Media */}
      <FormSection icon={FiImage} label="Media">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* App Icon */}
          <div>
            <p className="text-sm font-medium text-white/60 mb-1.5">App Icon</p>
            <div
              onClick={() => iconInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl px-4 py-5 text-center cursor-pointer transition-colors border-white/10 hover:border-white/20 hover:bg-white/5 min-h-[96px] flex items-center justify-center"
            >
              <input
                ref={iconInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setIconFile(file);
                  if (iconInputRef.current) iconInputRef.current.value = '';
                }}
              />
              {iconPreviewUrl ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-white/10">
                    <Image
                      fill
                      unoptimized
                      src={iconPreviewUrl}
                      alt="Icon preview"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIconFile(null); }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                      aria-label="Remove icon"
                    >
                      <FiX className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                  <span className="text-xs text-white/40 truncate max-w-[80px]">{iconFile?.name}</span>
                </div>
              ) : (
                <div>
                  <FiUpload className="w-5 h-5 text-white/30 mx-auto mb-2" />
                  <p className="text-sm text-white/40">Click to browse</p>
                </div>
              )}
            </div>
            <p className="mt-1.5 text-xs text-white/30">Square image, max 5 MB</p>
          </div>

          {/* Preview Images */}
          <div>
            <p className="text-sm font-medium text-white/60 mb-1.5">Preview Images</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl px-4 py-5 text-center cursor-pointer transition-colors min-h-[96px] flex flex-col items-center justify-center ${
                isDragging ? 'border-white/30 bg-white/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
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
              <FiUpload className="w-5 h-5 text-white/30 mb-2" />
              <p className="text-sm text-white/40">
                Drop or <span className="text-white/60 font-semibold">browse</span>
              </p>
              <p className="text-xs text-white/25 mt-1">Up to 5 images</p>
            </div>

            {previewUrls.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {previewUrls.map((previewUrl, i) => (
                  <div key={i} className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <Image
                      fill
                      unoptimized
                      src={previewUrl}
                      alt={selectedFiles[i]?.name ?? `Preview ${i + 1}`}
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                      aria-label="Remove image"
                    >
                      <FiX className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !slug.trim() || !url.trim()}
        className="w-full py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitLabel}
      </button>
    </form>
  );
}
