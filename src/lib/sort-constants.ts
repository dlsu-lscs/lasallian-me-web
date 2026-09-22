export const SORT_BY_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'favoritesCount', label: 'Most Favorited' },
  { value: 'ratingCount', label: 'Most Reviewed' },
  { value: 'averageRating', label: 'Highest Rated' },
  { value: 'viewCount', label: 'Most Viewed' },
] as const;

export const SORT_VALUES = SORT_BY_OPTIONS.map((option) => option.value)