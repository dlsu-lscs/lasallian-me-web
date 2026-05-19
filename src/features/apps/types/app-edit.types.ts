export interface AppEditFormState {
  title: string;
  slug: string;
  description: string;
  url: string;
  githubLink: string;
  author: string;
  /** Comma-separated tag list */
  tags: string;
  existingPreviewImages: string[];
  newPreviewFiles: File[];
  /** Existing icon URL (empty string = none) */
  iconUrl: string;
  iconFile: File | null;
  removeIcon: boolean;
}
