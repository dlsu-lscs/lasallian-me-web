export function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'never';

  const ms = Date.now() - new Date(dateStr).getTime();
  if (ms < 0) return 'just now';

  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
