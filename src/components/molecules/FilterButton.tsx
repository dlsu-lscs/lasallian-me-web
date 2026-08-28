import { Button } from '../atoms/Button';

export interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
  className?: string;
}

export function FilterButton({
  label,
  isActive,
  onClick,
  count,
  className = '',
}: FilterButtonProps) {
  return (
    <Button
      variant={isActive ? 'primary' : 'secondary'}
      size="sm"
      onClick={onClick}
      className={`transform duration-200 ease-out hover:scale-105 active:scale-95 inline-flex items-center gap-1.5 ${className}`.trim()}
    >
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            isActive ? 'bg-black/10 text-black' : 'bg-white/10 text-white/60'
          }`}
        >
          {count}
        </span>
      )}
    </Button>
  );
}
