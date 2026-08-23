export interface SubmitApplicationForm {
  title: string;
  slug: string;
  url: string;
  description?: string;
  author?: string;
  githubLink?: string;
  tags?: string[];
  previewImages?: string[];
  icon?: string;
}

export interface TosStatus {
  tosAccepted: boolean;
  tosAcceptedAt: string | null;
}