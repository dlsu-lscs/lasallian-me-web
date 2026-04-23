import { useEffect, useState } from 'react';
import { Application } from '@/features/apps/types/app.types';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onSave: (id: number, updates: Partial<Application>) => void;
  isSubmitting: boolean;
}

export function EditModal({ isOpen, onClose, application, onSave, isSubmitting }: EditModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (application) {
      setTitle(application.title ?? '');
      setSlug(application.slug ?? '');
      setDescription(application.description ?? '');
      setUrl(application.url ?? '');
      setTags(application.tags?.join(', ') ?? '');
    }
  }, [application]);

  const handleSave = () => {
    if (!application) return;
    onSave(application.id, {
      title: title.trim() || undefined,
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      url: url.trim() || undefined,
      tags: tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Application">
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />
        </div>
        <Input
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. productivity, social"
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSubmitting}
            className="disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
