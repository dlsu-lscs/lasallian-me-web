'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiX } from 'react-icons/fi';
import { Application } from '../types/app.types';
import { AppEditFormState } from '../types/app-edit.types';
import { AppDetailPreview } from './AppDetailPreview';
import { AppEditSidebar } from './AppEditSidebar';
import { uploadImages, uploadIcon } from '@/features/submit/services/upload.service';

export interface AppEditPreviewPanelProps {
  app: Application;
  /** If provided the panel renders as a modal overlay */
  onClose?: () => void;
  onSave: (updates: Partial<Application>) => void;
  isSaving: boolean;
  saveError?: string | null;
  /** Slot at the top of the sidebar — status banner or review card */
  sidebarTop?: React.ReactNode;
}

function initFormState(app: Application): AppEditFormState {
  return {
    title: app.title ?? '',
    slug: app.slug ?? '',
    description: app.description ?? '',
    url: app.url ?? '',
    githubLink: app.githubLink ?? '',
    author: app.author ?? '',
    tags: app.tags?.join(', ') ?? '',
    existingPreviewImages: app.previewImages ?? [],
    newPreviewFiles: [],
    iconUrl: app.icon ?? '',
    iconFile: null,
    removeIcon: false,
  };
}

function parseTags(raw: string): string[] {
  return raw.split(',').map((t) => t.trim()).filter(Boolean);
}

export function AppEditPreviewPanel({
  app,
  onClose,
  onSave,
  isSaving,
  saveError,
  sidebarTop,
}: AppEditPreviewPanelProps) {
  const [formState, setFormState] = useState<AppEditFormState>(() => initFormState(app));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);

  // Reset when the app changes (e.g. different app selected)
  useEffect(() => {
    setFormState(initFormState(app));
    setUploadError(null);
  }, [app.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive blob URLs for staged preview images
  useEffect(() => {
    const urls = formState.newPreviewFiles.map((f) => URL.createObjectURL(f));
    setNewPreviewUrls(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [formState.newPreviewFiles]);

  // Derive blob URL for staged icon
  useEffect(() => {
    if (!formState.iconFile) { setIconPreviewUrl(null); return; }
    const url = URL.createObjectURL(formState.iconFile);
    setIconPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formState.iconFile]);

  // Merge form state into the app for the live preview
  const mergedApp = useMemo<Application>(() => ({
    ...app,
    title: formState.title || app.title,
    slug: formState.slug || app.slug,
    description: formState.description,
    url: formState.url,
    githubLink: formState.githubLink,
    author: formState.author,
    tags: formState.tags ? parseTags(formState.tags) : app.tags,
    previewImages: [...formState.existingPreviewImages, ...newPreviewUrls],
    icon: formState.iconFile
      ? (iconPreviewUrl ?? app.icon)
      : formState.removeIcon
        ? null
        : (formState.iconUrl || null),
  }), [app, formState, newPreviewUrls, iconPreviewUrl]);

  const handleSave = async () => {
    setUploadError(null);
    setIsUploading(true);
    try {
      let previewImages = [...formState.existingPreviewImages];
      if (formState.newPreviewFiles.length > 0) {
        const uploaded = await uploadImages(formState.newPreviewFiles);
        previewImages = previewImages.concat(
          uploaded.map((r) => `${window.location.origin}/api/image?key=${encodeURIComponent(r.key)}`),
        );
      }
      let icon: string | null | undefined = undefined;
      if (formState.removeIcon) {
        icon = null;
      } else if (formState.iconFile) {
        const uploaded = await uploadIcon(formState.iconFile);
        icon = `${window.location.origin}/api/image?key=${encodeURIComponent(uploaded.key)}`;
      }
      onSave({
        title: formState.title.trim() || undefined,
        slug: formState.slug.trim() || undefined,
        description: formState.description.trim() || undefined,
        url: formState.url.trim() || undefined,
        githubLink: formState.githubLink.trim() || undefined,
        author: formState.author.trim() || undefined,
        tags: formState.tags ? parseTags(formState.tags) : undefined,
        previewImages,
        icon,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isSaving || isUploading;
  const error = uploadError ?? saveError ?? null;

  const splitPane = (
    <div className="flex w-full h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 xl:w-80 shrink-0 border-r border-white/8 flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-white/8 shrink-0">
          <p className="text-xs font-semibold text-white/50">Edit Application</p>
          <p className="text-white font-bold text-sm truncate mt-0.5">{mergedApp.title}</p>
        </div>
        {/* flex-1 min-h-0 lets AppEditSidebar fill remaining height without overflowing the header */}
        <div className="flex-1 min-h-0">
          <AppEditSidebar
            formState={formState}
            onFormChange={(updates) => setFormState((prev) => ({ ...prev, ...updates }))}
            onSave={handleSave}
            isSaving={isBusy}
            error={error}
            sidebarTop={sidebarTop}
            iconPreviewUrl={iconPreviewUrl}
            newPreviewUrls={newPreviewUrls}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-hidden bg-black/20">
        <div className="h-full overflow-y-auto">
          <AppDetailPreview app={mergedApp} />
        </div>
      </div>
    </div>
  );

  // Modal mode
  if (onClose) {
    return (
      <AnimatePresence>
        <motion.div
          key="app-edit-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            key="app-edit-panel"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-[92vw] max-w-6xl h-[88vh] glass-lg rounded-2xl shadow-[var(--shadow-modal)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
            {splitPane}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Page mode — same bounded container as the modal
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div
        className="glass-lg rounded-2xl overflow-hidden shadow-[var(--shadow-modal)]"
        style={{ height: '82vh' }}
      >
        {splitPane}
      </div>
    </div>
  );
}
