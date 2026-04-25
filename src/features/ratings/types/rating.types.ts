export interface Rating {
  applicationId: number;
  score: number;
  comment: string | null;
  isAnonymous: boolean;
  userEmail: string | null;
}

export interface ApplicationRatings {
  applicationSlug: string;
  ratings: Rating[];
  total: number;
  averageScore: number;
}

export interface CreateRatingPayload {
  score: number;
  comment?: string | null;
  isAnonymous: boolean;
}
