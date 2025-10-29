export interface App {
  id: string;
  name: string;
  description: string;
  icon?: string;
  url: string;
  tags: string[];
  category?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppFilters {
  searchQuery: string;
  selectedTags: string[];
  category?: string;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}


