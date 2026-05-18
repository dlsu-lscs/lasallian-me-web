export interface Application {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  url: string;
  githubLink: string | null;
  previewImages: string[] | null;
  tags: string[] | null;
  userId: string;
  userEmail?: string;
  author?: string | null;
  isApproved: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED';
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  favoritesCount?: number;
}

export interface ApplicationsMeta {
  page: number;
  limit: number;
  count: number;
  total: number;
  totalPages: number;
}

export interface ApplicationsListResponse {
  data: Application[];
  meta: ApplicationsMeta;
}

export interface AppFilters {
  searchQuery: string;
  selectedTags: string[];
  userId?: string;
}
