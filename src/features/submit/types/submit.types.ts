export interface SubmitApplicationForm {
  title: string;
  slug: string;
  githubLink: string;
  description?: string;
  url?: string;
  author?: string;
  tags?: string[];
  previewImages?: string[];
}
