import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PowerIcon } from '@heroicons/react/24/outline';
import { navItems, type NavItem } from '../../types/nav';
import { authService } from '../../services/auth.service';
import { getIcon } from '../../utils/iconMapper';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showToggle?: boolean;
}

export default function Sidebar({ isOpen, onClose, showToggle = true }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      const key = item.displayName || '';
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });
    }
  };

  const isActive = (route?: string): boolean => {
    if (!route) return false;
    return location.pathname === route || location.pathname.startsWith(`${route}/`);
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    if (item.navCap) {
      return (
        <div key={item.navCap} className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
          {item.navCap}
        </div>
      );
    }

    if (item.external) {
      return (
        <a
          key={item.displayName}
          href={item.route}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-6 py-3 text-white hover:bg-white/10 rounded-md"
        >
          {item.iconName && (() => {
            const IconComponent = getIcon(item.iconName);
            if (!IconComponent) return null;
            return (
              <span className="mr-3">
                <IconComponent className="w-5 h-5" />
              </span>
            );
          })()}
          <span className="flex-1">{item.displayName}</span>
        </a>
      );
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.displayName || '');
    const active = isActive(item.route);

    return (
      <div key={item.displayName || item.route}>
        {item.route && !hasChildren ? (
          <Link
            to={item.route}
            onClick={() => onClose()}
            className={`flex items-center px-6 py-3 rounded-md transition-colors ${
              active
                ? 'bg-orange text-white'
                : 'text-white hover:bg-white/10'
            } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ paddingLeft: `${depth * 1.5 + 1.5}rem` }}
          >
            {item.iconName && (() => {
              const IconComponent = getIcon(item.iconName);
              if (!IconComponent) return null;
              return (
                <span className="mr-3">
                  <IconComponent className="w-5 h-5" />
                </span>
              );
            })()}
            <span className="flex-1">{item.displayName}</span>
          </Link>
        ) : (
          <div
            onClick={() => toggleExpand(item)}
            className={`flex items-center px-6 py-3 rounded-md cursor-pointer transition-colors ${
              active
                ? 'bg-orange text-white'
                : 'text-white hover:bg-white/10'
            } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ paddingLeft: `${depth * 1.5 + 1.5}rem` }}
          >
            {item.iconName && (() => {
              const IconComponent = getIcon(item.iconName);
              if (!IconComponent) return null;
              return (
                <span className="mr-3">
                  <IconComponent className="w-5 h-5" />
                </span>
              );
            })()}
            <span className="flex-1">{item.displayName}</span>
            {hasChildren && (
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            )}
          </div>
        )}
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children?.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 flex flex-col`}
      style={{ width: '270px' }}
    >
      {/* Header do Sidebar - Logo com fundo branco */}
      <div className="bg-white flex items-center justify-between p-5 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img
            src="/assets/images/svgs/logo-sidebar/2 91.svg"
            alt="Beanstalk Logo"
            className="h-10 w-auto"
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              console.error('Failed to load logo:', '/assets/images/svgs/logo-sidebar/2 91.svg');
            }}
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold" style={{ color: '#36263F' }}>Beanstalk</span>
            <span className="text-sm" style={{ color: '#FB7F0D' }}>Orchestrate Efficiency</span>
          </div>
        </Link>
        {showToggle && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Menu Items - Fundo roxo escuro */}
      <nav className="flex-1 overflow-y-auto py-4" style={{ backgroundColor: '#36263F' }}>
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Profile Bar - Fundo azul claro */}
      <div className="p-6 mt-auto border-t" style={{ backgroundColor: '#36263F', borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="bg-accent-100 rounded-lg p-4 flex items-center">
          <img
            src="/assets/images/profile/user-1.jpg"
            alt="User"
            className="w-10 h-10 rounded-full mr-4 object-cover"
            style={{ minWidth: '40px', minHeight: '40px' }}
            onError={(e) => {
              console.error('Failed to load user image:', '/assets/images/profile/user-1.jpg');
              // Se a imagem não existir, mostra um placeholder
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM1ZDg3ZmYiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJDMTQuNzYxNCAxMiAxNyA5Ljc2MTQyIDE3IDdDMTcgNC4yMzg1OCAxNC43NjE0IDIgMTIgMkM5LjIzODU4IDIgNyA0LjIzODU4IDcgN0M3IDkuNzYxNDIgOS4yMzg1OCAxMiAxMiAxMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxNEM4LjY2NjY3IDE0IDUuODY2NjcgMTUuMzMzMyA0IDE3LjMzMzNWMjBIMjBWMjBDMTguMTMzMyAxNS4zMzMzIDE1LjMzMzMgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
            }}
          />
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-700 uppercase">ADMIN</span>
          </div>
          <button
            onClick={() => authService.logout()}
            className="text-primary hover:text-primary/80 transition-colors"
            title="Logout"
          >
            <PowerIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
