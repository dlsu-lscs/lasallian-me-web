import { useEffect, useRef, useState } from 'react';
import {
  FiUpload, FiX,
  FiLayers, FiLink, FiUsers, FiImage,
  FiGlobe, FiGithub, FiUser, FiTag, FiHash,
} from 'react-icons/fi';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Application } from '../types/app.types';

interface EditApplicationFormProps {
  application: Application;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (
    updates: {
      title: string;
      slug: string;
      description: string;
      url: string;
      author: string;
      githubLink: string;
      tags: string;
      previewImages: string[];
      iconUrl: string;
      removeIcon: boolean;
    },
    newPreviewFiles: File[],
    iconFile: File | null,
    removeIcon: boolean,
  ) => void;
  onCancel: () => void;
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

export function EditApplicationForm({
  application,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: EditApplicationFormProps) {
  const [title, setTitle] = useState(application.title ?? '');
  const [slug, setSlug] = useState(application.slug ?? '');
  const [description, setDescription] = useState(application.description ?? '');
  const [url, setUrl] = useState(application.url ?? '');
  const [author, setAuthor] = useState(application.author ?? '');
  const [githubLink, setGithubLink] = useState(application.githubLink ?? '');
  const [tags, setTags] = useState(application.tags?.join(', ') ?? '');

  const [existingPreviewImages, setExistingPreviewImages] = useState<string[]>(application.previewImages ?? []);
  const [newPreviewFiles, setNewPreviewFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);

  const [iconUrl, setIconUrl] = useState(application.icon ?? '');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);
  const [removeIcon, setRemoveIcon] = useState(false);

  const iconInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = newPreviewFiles.map((file) => URL.createObjectURL(file));
    setNewPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [newPreviewFiles]);

  useEffect(() => {
    if (!iconFile) {
      setIconPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(iconFile);
    setIconPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [iconFile]);

  const addFiles = (incoming: File[]) => {
    const images = incoming.filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) return;
    setNewPreviewFiles((prev) => [...prev, ...images].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    addFiles(Array.from(event.dataTransfer.files));
  };

  const removeExistingPreviewImage = (index: number) => {
    setExistingPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewPreviewFile = (index: number) => {
    setNewPreviewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIconSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setIconFile(file);
    setRemoveIcon(false);
    if (iconInputRef.current) iconInputRef.current.value = '';
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconUrl('');
    setRemoveIcon(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(
      {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        url: url.trim(),
        author: author.trim(),
        githubLink: githubLink.trim(),
        tags: tags.trim(),
        previewImages: existingPreviewImages,
        iconUrl,
        removeIcon,
      },
      newPreviewFiles,
      iconFile,
      removeIcon,
    );
  };

  const currentIconPreview = iconPreviewUrl ?? iconUrl;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Edit application</h1>
        <p className="mt-1 text-sm text-white/50">
          Update your app details, images, and icon.
        </p>
      </div>

      {/* App Info */}
      <FormSection icon={FiLayers} label="App Info">
        <div className="grid gap-4 sm:grid-cols-2">
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
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-awesome-app"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-white/30">Lowercase, numbers, hyphens only.</p>
          </div>
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
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
          {/* Preview Images */}
          <div>
            <p className="text-sm font-medium text-white/60 mb-2">Preview images</p>
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <FiUpload className="w-5 h-5 text-white/40 mx-auto mb-2" />
              <p className="text-sm text-white/50">Drop up to 5 images or click to browse.</p>
              <p className="mt-1 text-xs text-white/30">JPEG, PNG, GIF, WebP</p>
            </div>

            {(existingPreviewImages.length > 0 || newPreviewUrls.length > 0) && (
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {existingPreviewImages.map((preview, index) => (
                  <div key={`existing-${preview}-${index}`} className="relative overflow-hidden rounded-xl border border-white/10">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingPreviewImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
                      aria-label="Remove preview image"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {newPreviewUrls.map((preview, index) => (
                  <div key={`new-${index}`} className="relative overflow-hidden rounded-xl border border-white/10">
                    <img src={preview} alt={`New preview ${index + 1}`} className="w-full h-20 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewPreviewFile(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
                      aria-label="Remove preview image"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* App Icon */}
          <div>
            <p className="text-sm font-medium text-white/60 mb-2">App icon</p>
            <div
              onClick={() => iconInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <input
                ref={iconInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleIconSelection}
              />
              {currentIconPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-20 h-20">
                    <img
                      src={currentIconPreview}
                      alt="Icon preview"
                      className="w-20 h-20 object-cover rounded-2xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveIcon();
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
                      aria-label="Remove icon"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-white/40">Click to replace</p>
                </div>
              ) : (
                <>
                  <FiUpload className="w-5 h-5 text-white/40 mx-auto mb-2" />
                  <p className="text-sm text-white/50">Click to choose an icon.</p>
                </>
              )}
            </div>
            <p className="mt-1.5 text-xs text-white/30">Square icon shown across the site.</p>
          </div>
        </div>
      </FormSection>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting || !title.trim() || !slug.trim() || !url.trim()}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
