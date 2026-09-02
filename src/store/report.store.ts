import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * State and actions for tracking user-reported applications and reviews.
 */
export interface ReportStoreState {
  /** Array of application slugs reported by the user. */
  reportedAppSlugs: string[];
  /** Array of unique review identifiers reported by the user. */
  reportedReviewKeys: string[];
  /**
   * Adds an application slug to the list of reported applications if not already present.
   * @param slug Unique slug of the application.
   */
  markAppReported: (slug: string) => void;
  /**
   * Adds a review key to the list of reported reviews if not already present.
   * @param key Unique identifier of the review.
   */
  markReviewReported: (key: string) => void;
  /**
   * Checks whether a specific application slug has been reported.
   * @param slug Unique slug of the application.
   * @returns Boolean indicating whether the app is reported.
   */
  isAppReported: (slug: string) => boolean;
  /**
   * Checks whether a specific review key has been reported.
   * @param key Unique identifier of the review.
   * @returns Boolean indicating whether the review is reported.
   */
  isReviewReported: (key: string) => boolean;
}

/**
 * Zustand store with local storage persistence for tracking client-side report submissions.
 */
export const useReportStore = create<ReportStoreState>()(
  persist(
    (set, get) => ({
      reportedAppSlugs: [],
      reportedReviewKeys: [],

      markAppReported: (slug: string) => {
        set((state) => {
          if (state.reportedAppSlugs.includes(slug)) return state;
          return { reportedAppSlugs: [...state.reportedAppSlugs, slug] };
        });
      },

      markReviewReported: (key: string) => {
        set((state) => {
          if (state.reportedReviewKeys.includes(key)) return state;
          return { reportedReviewKeys: [...state.reportedReviewKeys, key] };
        });
      },

      isAppReported: (slug: string) => {
        return get().reportedAppSlugs.includes(slug);
      },

      isReviewReported: (key: string) => {
        return get().reportedReviewKeys.includes(key);
      },
    }),
    {
      name: 'lasallian-me-user-reports',
    },
  ),
);
