export interface Application {
  id: number;
  title: string;
  slug: string;
  description: string;
  url: string;
  previewImages: string[];
  tags: string[];
  authorId: number;
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
}
