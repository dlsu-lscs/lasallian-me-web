import { Button } from '../atoms/Button';

export interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export function FilterButton({
  label,
  isActive,
  onClick,
  count,
}: FilterButtonProps) {
  return (
    <Button
      variant={isActive ? 'primary' : 'outline'}
      size="sm"
      onClick={onClick}
      className="whitespace-nowrap"
    >
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
            isActive
              ? 'bg-white bg-opacity-30'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {count}
        </span>
      )}
    </Button>
  );
}
