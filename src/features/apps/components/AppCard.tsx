import { App } from '../types/app.types';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';

export interface AppCardProps {
  app: App;
  onClick?: (app: App) => void;
}

export function AppCard({ app, onClick }: AppCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-shadow p-6 h-full flex flex-col">
      
      {/* App Photo */}
      <div className="w-full h-32 mb-4 rounded-t-md bg-gray-100 overflow-hidden flex items-center justify-center">
        {app.icon ? (
          <img
            src={app.icon}
            alt={`${app.name} photo header`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-300 text-4xl font-bold">Photo</span>
        )}
      </div>
      
      {/* App Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3 flex-1">
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {app.name}
            </h3>
            {app.featured && (
              <Badge variant="success" className="mt-1">
                Featured
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-2 line-clamp-3 flex-grow">
        {app.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {app.tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="primary">
            {tag}
          </Badge>
        ))}
        {app.tags.length > 3 && (
          <Badge variant="default">+{app.tags.length - 3}</Badge>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto border-gray-100">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => onClick?.(app)}
        >
          Open App
        </Button>
      </div>
    </div>
  );
}


