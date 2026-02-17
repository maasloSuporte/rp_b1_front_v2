import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Home } from 'lucide-react';

const BREADCRUMB_KEYS: Record<string, string> = {
  dashboard: 'breadcrumb.dashboard',
  users: 'breadcrumb.users',
  roles: 'breadcrumb.roles',
  assets: 'breadcrumb.assets',
  packages: 'breadcrumb.packages',
  jobs: 'breadcrumb.jobs',
  scheduled: 'breadcrumb.scheduled',
  queues: 'breadcrumb.queues',
  machines: 'breadcrumb.machines',
  automation: 'breadcrumb.automation',
  project: 'breadcrumb.project',
  execution: 'breadcrumb.execution',
  create: 'breadcrumb.create',
  upload: 'breadcrumb.upload',
};

export default function Breadcrumb() {
  const { t } = useTranslation('translation');
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbName = (path: string): string => {
    const key = BREADCRUMB_KEYS[path];
    return key ? t(key as never) : path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (paths.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link to="/dashboard" className="hover:text-primary">
        <Home className="w-4 h-4" />
      </Link>
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        const route = '/' + paths.slice(0, index + 1).join('/');
        const name = getBreadcrumbName(path);

        return (
          <div key={route} className="flex items-center space-x-2">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{name}</span>
            ) : (
              <Link to={route} className="hover:text-primary">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
