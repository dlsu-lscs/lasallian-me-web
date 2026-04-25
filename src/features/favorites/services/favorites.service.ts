const base = () => `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`;

export async function getUserFavorites(userId: string): Promise<{ userId: string; applicationIds: number[] }> {
  const response = await fetch(`${base()}/users/${encodeURIComponent(userId)}`);
  if (!response.ok) throw new Error(`Failed to fetch user favorites: ${response.statusText}`);
  return response.json();
}

export async function addFavorite(applicationId: number): Promise<void> {
  const response = await fetch(`${base()}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ applicationId }),
  });
  if (!response.ok) throw new Error(`Failed to add favorite: ${response.statusText}`);
}

export async function removeFavorite(applicationId: number): Promise<void> {
  const response = await fetch(`${base()}/${applicationId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(`Failed to remove favorite: ${response.statusText}`);
}
