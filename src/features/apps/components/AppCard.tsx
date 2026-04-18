import { Application } from '../types/app.types';
import { Badge } from '@/components/atoms/Badge';
import { useRouter } from 'next/navigation';
import { FiHeart } from 'react-icons/fi';

export interface AppCardProps {
  app: Application;
  onClick?: (app: Application) => void;
}

export function AppCard({ app }: AppCardProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/${app.slug}`);
  };
  return (
    <button
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-shadow p-3 h-full flex flex-col text-left"
    >
      {/* App Photo */}
      <div className="w-full h-45 mb-4 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
        {app.previewImages[0] ? (
          <img
            src={app.previewImages[0]}
            alt={`${app.title} photo header`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-300 text-4xl font-bold">Photo</span>
        )}
      </div>

      {/* App Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3 flex-1 justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {app.title}
            </h3>
          </div>

          {app.favoritesCount !== undefined && (
            <h3 className="font-semibold text-base leading-[140%] tracking-normal flex items-center gap-1 text-gray-800">
              <FiHeart className="text-black w-4 h-4" />
              {app.favoritesCount}
            </h3>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-2 line-clamp-3 flex-grow">
        {app.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-1">
        {app.tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="primary">
            {tag}
          </Badge>
        ))}
        {app.tags.length > 3 && (
          <Badge variant="default">+{app.tags.length - 3}</Badge>
        )}
      </div>
    </button>
  );
}
