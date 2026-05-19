'use client';

import Image from 'next/image';
import { useRef } from 'react';
import {
  FiUpload, FiX,
  FiGlobe, FiGithub, FiUser, FiTag, FiHash,
} from 'react-icons/fi';
import { Button } from '@/components/atoms/Button';
import { AppEditFormState } from '../types/app-edit.types';

interface AppEditSidebarProps {
  formState: AppEditFormState;
  onFormChange: (updates: Partial<AppEditFormState>) => void;
  onSave: () => void;
  isSaving: boolean;
  error?: string | null;
  /** Optional slot rendered at the top — status banner or review card */
  sidebarTop?: React.ReactNode;
  /** Icon preview URL (blob: or existing URL) */
  iconPreviewUrl?: string | null;
  /** Preview URLs for newly staged files */
  newPreviewUrls?: string[];
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const input =
  'w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors';

export function AppEditSidebar({
  formState,
  onFormChange,
  onSave,
  isSaving,
  error,
  sidebarTop,
  iconPreviewUrl,
  newPreviewUrls = [],
}: AppEditSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: File[]) => {
    const images = incoming.filter((f) => f.type.startsWith('image/'));
    if (!images.length) return;
    onFormChange({ newPreviewFiles: [...formState.newPreviewFiles, ...images].slice(0, 5) });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    onFormChange({ iconFile: file, iconUrl: '', removeIcon: false });
    if (iconInputRef.current) iconInputRef.current.value = '';
  };

  const handleRemoveIcon = () => {
    onFormChange({ iconFile: null, iconUrl: '', removeIcon: true });
  };

  const currentIcon = iconPreviewUrl ?? (formState.removeIcon ? null : formState.iconUrl) ?? null;

  const allPreviews = [
    ...formState.existingPreviewImages.map((url) => ({ url, isNew: false, index: 0 })),
    ...newPreviewUrls.map((url, i) => ({ url, isNew: true, index: i })),
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {sidebarTop && <div>{sidebarTop}</div>}

        {/* ── App Info ── */}
        <section className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">App Info</p>
          <div className="flex flex-col gap-2.5">
            <Field label="Title">
              <input
                value={formState.title}
                onChange={(e) => onFormChange({ title: e.target.value })}
                placeholder="My App"
                className={input}
              />
            </Field>
            <Field label="Slug">
              <div className="relative">
                <FiHash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
                <input
                  value={formState.slug}
                  onChange={(e) => onFormChange({ slug: e.target.value })}
                  placeholder="my-app"
                  className={`${input} pl-7 font-mono`}
                />
              </div>
            </Field>
            <Field label="Description">
              <textarea
                value={formState.description}
                onChange={(e) => onFormChange({ description: e.target.value })}
                rows={3}
                placeholder="What does it do?"
                className={`${input} resize-none`}
              />
            </Field>
          </div>
        </section>

        {/* ── Links ── */}
        <section className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Links</p>
          <div className="flex flex-col gap-2.5">
            <Field label="App URL">
              <div className="relative">
                <FiGlobe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
                <input
                  value={formState.url}
                  onChange={(e) => onFormChange({ url: e.target.value })}
                  placeholder="https://..."
                  className={`${input} pl-7`}
                />
              </div>
            </Field>
            <Field label="GitHub">
              <div className="relative">
                <FiGithub className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
                <input
                  value={formState.githubLink}
                  onChange={(e) => onFormChange({ githubLink: e.target.value })}
                  placeholder="https://github.com/..."
                  className={`${input} pl-7`}
                />
              </div>
            </Field>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Team</p>
          <div className="flex flex-col gap-2.5">
            <Field label="Author">
              <div className="relative">
                <FiUser className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
                <input
                  value={formState.author}
                  onChange={(e) => onFormChange({ author: e.target.value })}
                  placeholder="Jane Doe"
                  className={`${input} pl-7`}
                />
              </div>
            </Field>
            <Field label="Tags">
              <div className="relative">
                <FiTag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
                <input
                  value={formState.tags}
                  onChange={(e) => onFormChange({ tags: e.target.value })}
                  placeholder="productivity, social"
                  className={`${input} pl-7`}
                />
              </div>
            </Field>
          </div>
        </section>

        {/* ── Media ── */}
        <section className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Media</p>
          <div className="flex flex-col gap-2.5">

            {/* Icon */}
            <Field label="Icon">
              <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={handleIconChange} />
              {currentIcon ? (
                <div className="flex items-center gap-3 p-2.5 bg-black/30 border border-white/10 rounded-lg">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <Image fill unoptimized src={currentIcon} alt="Icon" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-xs truncate">Current icon</p>
                    <button
                      type="button"
                      onClick={() => iconInputRef.current?.click()}
                      className="text-[10px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors shrink-0 cursor-pointer"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-white/15 hover:border-white/25 rounded-lg text-white/40 hover:text-white/60 transition-colors text-xs cursor-pointer"
                >
                  <FiUpload className="w-3.5 h-3.5 shrink-0" />
                  Upload icon
                </button>
              )}
            </Field>

            {/* Preview images */}
            <Field label="Screenshots">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
              />
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addFiles(Array.from(e.dataTransfer.files)); }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-white/15 hover:border-white/25 rounded-lg text-white/40 hover:text-white/60 transition-colors text-xs cursor-pointer"
              >
                <FiUpload className="w-3.5 h-3.5 shrink-0" />
                Add screenshots (up to 5)
              </div>

              {allPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {allPreviews.map(({ url, isNew, index }) => (
                    <div key={`${isNew ? 'new' : 'exist'}-${index}-${url}`} className="relative h-16 rounded-lg overflow-hidden border border-white/10 group">
                      <Image fill unoptimized src={url} alt="" className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          if (isNew) {
                            onFormChange({ newPreviewFiles: formState.newPreviewFiles.filter((_, i) => i !== index) });
                          } else {
                            onFormChange({ existingPreviewImages: formState.existingPreviewImages.filter((_, i) => i !== index) });
                          }
                        }}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <FiX className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          </div>
        </section>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 px-4 py-3 border-t border-white/8 flex flex-col gap-2">
        {error && (
          <p className="text-xs text-red-400 leading-snug">{error}</p>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !formState.title.trim() || !formState.url.trim()}
          className="w-full"
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
