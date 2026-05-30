import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import {
  FiUpload, FiX,
  FiLayers, FiUsers, FiImage,
  FiGlobe, FiUser, FiTag, FiHash,
} from 'react-icons/fi';
import { Application } from '@/features/apps/types/app.types';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { uploadImages, uploadIcon } from '@/features/submit/services/upload.service';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onSave: (id: number, updates: Partial<Application>) => void;
  isSubmitting: boolean;
}

function ModalSection({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 pt-1">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-white/30" />
        <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          {label}
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      <div className="grid gap-3">
        {children}
      </div>
    </div>
  );
}

export function EditModal({ isOpen, onClose, application, onSave, isSubmitting }: EditModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [existingPreviewImages, setExistingPreviewImages] = useState<string[]>([]);
  const [newPreviewFiles, setNewPreviewFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const [iconUrl, setIconUrl] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (application) {
      setTitle(application.title ?? '');
      setSlug(application.slug ?? '');
      setDescription(application.description ?? '');
      setUrl(application.url ?? '');
      setAuthor(application.author ?? '');
      setTags(application.tags?.join(', ') ?? '');
      setExistingPreviewImages(application.previewImages ?? []);
      setNewPreviewFiles([]);
      setNewPreviewUrls([]);
      setIconUrl(application.icon ?? '');
      setIconFile(null);
      setIconPreviewUrl(null);
      setError(null);
    }
  }, [application]);

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
    setNewPreviewFiles((prev) => [...prev, ...images].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const removeExistingPreviewImage = (index: number) => {
    setExistingPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewPreviewFile = (index: number) => {
    setNewPreviewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIconFile(file);
      setIconUrl('');
    }
    if (iconInputRef.current) iconInputRef.current.value = '';
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconUrl('');
    setIconPreviewUrl(null);
  };

  const handleSave = async () => {
    if (!application) return;

    setError(null);
    setIsUploading(true);

    try {
      let previewImages = [...existingPreviewImages];

      if (newPreviewFiles.length > 0) {
        const uploaded = await uploadImages(newPreviewFiles);
        previewImages = previewImages.concat(uploaded.map((result) => result.key));
      }

      let icon: string | null | undefined = undefined;
      if (iconFile) {
        const uploaded = await uploadIcon(iconFile);
        icon = uploaded.key;
      } else if (iconUrl === '') {
        icon = null;
      }

      onSave(application.id, {
        title: title.trim() || undefined,
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        url: url.trim() || undefined,
        author: author.trim() || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        previewImages,
        icon,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const currentIconPreview = iconPreviewUrl ?? iconUrl;
  const isBusy = isSubmitting || isUploading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Application">
      <div className="flex flex-col gap-5">
        {/* App Info */}
        <ModalSection icon={FiLayers} label="App Info">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-white/60 mb-1.5">Slug</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <FiHash className="w-4 h-4 text-white/30" />
              </div>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white/60 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors resize-none"
            />
          </div>

          <Input
            label="App URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            startIcon={FiGlobe}
          />
        </ModalSection>

        {/* Team */}
        <ModalSection icon={FiUsers} label="Team">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Jane Doe or LSCS Dev Team"
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
                  placeholder="e.g. productivity, social"
                  className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors"
                />
              </div>
            </div>
          </div>
        </ModalSection>

        {/* Media */}
        <ModalSection icon={FiImage} label="Media">
          {/* App Icon */}
          <div className="w-full">
            <label className="block text-sm font-medium text-white/60 mb-1.5">App Icon</label>
            <div
              onClick={() => iconInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl px-4 py-5 text-center cursor-pointer transition-colors border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <input
                ref={iconInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleIconChange}
              />

              {currentIconPreview ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-white/10">
                    <Image
                      fill
                      unoptimized
                      src={currentIconPreview}
                      alt="App icon preview"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveIcon(); }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                      aria-label="Remove icon"
                    >
                      <FiX className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white/70">Replace or remove icon</p>
                    <p className="text-xs text-white/40">Click to choose a new image.</p>
                  </div>
                </div>
              ) : (
                <>
                  <FiUpload className="w-5 h-5 text-white/30 mx-auto mb-2" />
                  <p className="text-sm text-white/40">
                    Drop icon here or <span className="text-white/60 font-semibold">click to browse</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Preview Images */}
          <div className="w-full">
            <label className="block text-sm font-medium text-white/60 mb-1.5">Preview Images</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors border-white/10 hover:border-white/20 hover:bg-white/5"
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
              <p className="text-xs text-white/25 mt-1">Up to 5 images, max 5 MB each.</p>
            </div>

            {(existingPreviewImages.length > 0 || newPreviewUrls.length > 0) && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {existingPreviewImages.map((preview, index) => (
                  <div key={`existing-${preview}-${index}`} className="relative h-20 overflow-hidden rounded-xl border border-white/10">
                    <Image
                      fill
                      unoptimized
                      src={preview}
                      alt={`Existing preview ${index + 1}`}
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPreviewImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                      aria-label="Remove preview image"
                    >
                      <FiX className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                ))}
                {newPreviewUrls.map((preview, index) => (
                  <div key={`new-${index}`} className="relative h-20 overflow-hidden rounded-xl border border-white/10">
                    <Image
                      fill
                      unoptimized
                      src={preview}
                      alt={`New preview ${index + 1}`}
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPreviewFile(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                      aria-label="Remove preview image"
                    >
                      <FiX className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ModalSection>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isBusy}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isBusy || !title.trim() || !url.trim()}
          >
            {isBusy ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
