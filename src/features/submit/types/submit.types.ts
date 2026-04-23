export interface SubmitApplicationForm {
  title: string;
  slug: string;
  description?: string;
  url?: string;
  previewImages?: string[];
  tags?: string[];
  authorName: string;
  authorEmail: string;
  authorDescription?: string;
  authorWebsite?: string;
}
