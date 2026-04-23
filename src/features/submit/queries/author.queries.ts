import { useQuery } from '@tanstack/react-query';

export const useAuthorByEmail = (email: string | undefined) => {
  return useQuery({
    queryKey: ['author', email],
    queryFn: async () => {
      if (!email) return null;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/authors/${email}`
      );
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('Author not found in database');
        throw new Error('Failed to fetch author details');
      }
      
      return response.json(); // Returns { id: number, name: string, ... }
    },
    enabled: !!email, // Only runs when email is available
  });
};