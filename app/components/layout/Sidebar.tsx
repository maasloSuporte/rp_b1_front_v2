import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { navItems, type NavItem } from '../../types/nav';
import { getIcon } from '../../utils/iconMapper';
import AdminUserModal from './AdminUserModal';

import logoClosed from '../../assets/images/svgs/login/logoNovo.svg';
import logoOpen from '../../assets/images/svgs/logo-sidebar/2 91.svg';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose: () => void;
  onToggleCollapse?: () => void;
  showToggle?: boolean;
  width?: number;
}

function normalizeRoute(route?: string): string {
  if (!route) return '';
  return route.startsWith('/') ? route : `/${route}`;
}

export default function Sidebar({
  isOpen,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
  showToggle = true,
  width = 270,
}: SidebarProps) {
  const { t } = useTranslation('translation');
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Abre o grupo que contém a rota ativa ao mudar de página
  useEffect(() => {
    const path = location.pathname;
    setExpandedItems((prev) => {
      const next = new Set(prev);
      navItems.forEach((item) => {
        if (item.children?.some((c) => {
          const r = normalizeRoute(c.route);
          return r && (path === r || path.startsWith(r + '/'));
        })) {
          if (item.displayName) next.add(item.displayName);
        }
      });
      return next;
    });
  }, [location.pathname]);

  const toggleExpand = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      const key = item.displayName || '';
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    }
  };

  const isActive = (route?: string): boolean => {
    const r = normalizeRoute(route);
    if (!r) return false;
    return location.pathname === r || location.pathname.startsWith(`${r}/`);
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    if (item.navCap) {
      if (isCollapsed) return null;
      return (
        <div
          key={item.navCap}
          className="px-5 py-2.5 mt-4 first:mt-2 text-[11px] font-semibold text-white/50 uppercase tracking-widest"
        >
          {t(item.navCap as never)}
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
          style={{ cursor: 'pointer' }}
          className={`cursor-pointer flex items-center rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors ${isCollapsed ? 'justify-center py-3 px-2.5' : 'gap-3 px-5 py-3'}`}
        >
          {item.iconName && (() => {
            const IconComponent = getIcon(item.iconName);
            if (!IconComponent) return null;
            return <IconComponent className="w-6 h-6 shrink-0 text-white/70" />;
          })()}
          {!isCollapsed && <span className="flex-1">{item.displayName ? t(item.displayName as never) : ''}</span>}
        </a>
      );
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.displayName || '');
    const active = isActive(item.route);

    const basePadding = isCollapsed ? 'justify-center py-3 px-2.5' : 'pl-5 gap-3 py-3 pr-5';
    const indent = depth > 0 && !isCollapsed ? { paddingLeft: `${1.25 + depth * 1.25}rem` } : undefined;

    // Colapsado com filhos: só ícone (subitens ficam ocultos até expandir a sidebar)
    if (isCollapsed && hasChildren) {
      return (
        <div key={item.displayName || item.route}>
          <button
            type="button"
            onClick={() => toggleExpand(item)}
            style={{ cursor: item.disabled ? 'not-allowed' : 'pointer' }}
            className={`cursor-pointer w-full flex items-center rounded-lg justify-center py-3 px-2.5 transition-colors ${
              active ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
            } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {item.iconName && (() => {
              const IconComponent = getIcon(item.iconName);
              if (!IconComponent) return null;
              return <IconComponent className="w-8 h-8 shrink-0 text-white/70" />;
            })()}
          </button>
        </div>
      );
    }

    return (
      <div key={item.displayName || item.route}>
        {item.route && !hasChildren ? (
          <Link
            to={normalizeRoute(item.route) || '#'}
            onClick={() => onClose()}
            style={indent}
            className={`flex items-center rounded-lg transition-colors ${basePadding} ${
              active
                ? 'bg-orange text-white shadow-sm'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            } ${item.disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {item.iconName && (() => {
              const IconComponent = getIcon(item.iconName);
              if (!IconComponent) return null;
              return (
                <IconComponent className={`w-8 h-8 shrink-0 ${active ? 'text-white' : 'text-white/70'}`} />
              );
            })()}
            {!isCollapsed && <span className="flex-1 font-medium">{item.displayName ? t(item.displayName as never) : ''}</span>}
          </Link>
        ) : (
          <>
            <button
              type="button"
              onClick={() => toggleExpand(item)}
              style={indent}
              className={`cursor-pointer w-full flex items-center rounded-lg text-left transition-colors ${basePadding} ${
                active ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
              } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {item.iconName && (() => {
                const IconComponent = getIcon(item.iconName);
                if (!IconComponent) return null;
                return (
                  <IconComponent className="w-8 h-8 shrink-0 text-white/70" />
                );
              })()}
              {!isCollapsed && <span className="flex-1 font-medium">{item.displayName ? t(item.displayName as never) : ''}</span>}
              {hasChildren && !isCollapsed && (
                <ChevronDownIcon
                  className={`w-5 h-5 shrink-0 text-white/60 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              )}
            </button>
            {hasChildren && isExpanded && !isCollapsed && (
              <div className="mt-1 space-y-1 border-l border-white/10 ml-7 pl-2">
                {item.children?.map((child) => renderNavItem(child, depth + 1))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`app-sidebar fixed inset-y-0 left-0 z-50 flex flex-col bg-purple shadow-xl transition-[transform,width] duration-300 ease-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width }}
    >
      {/* Header: 70px (mesma altura do header com menu hamburger). Aberto = logo sidebar; fechado = logoNovo */}
      <div className={`flex items-center justify-between shrink-0 h-[70px] bg-white border-b border-gray-100 ${isCollapsed ? 'px-2' : 'px-5'}`}>
        <Link
          to="/dashboard"
          className={`cursor-pointer flex items-center min-w-0 h-full ${isCollapsed ? 'flex-1 justify-center' : 'gap-3'}`}
        >
          <div className="flex items-center justify-center shrink-0 h-full w-full max-h-[70px]">
            <img
              src={isCollapsed ? logoClosed : logoOpen}
              alt="Beanstalk"
              className={`object-contain object-center h-full max-h-[70px] ${isCollapsed ? 'w-full max-w-[66px]' : 'w-auto min-h-[50px]'}`}
            />
          </div>
        </Link>
        {showToggle && !isCollapsed && (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 -m-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label={t('nav.closeMenu')}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        <div className={`space-y-3 ${isCollapsed ? 'px-2' : 'px-0'}`}>
          {navItems.map((item) => renderNavItem(item))}
        </div>
      </nav>

      {/* Área do usuário: clique abre modal (idioma + sair) */}
      <div className="shrink-0 p-4 border-t border-white/10 bg-purple">
        <button
          type="button"
          onClick={() => setAdminModalOpen(true)}
          className={`cursor-pointer w-full flex items-center rounded-xl bg-white/10 transition-[padding] duration-300 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 ${
            isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-3'
          }`}
        >
          <img
            src="/assets/images/profile/user-1.jpg"
            alt=""
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/20"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.src = 'data:image/svg+xml,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.2)"/><path fill="white" d="M20 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 4c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/></svg>'
              );
            }}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-white/80 uppercase tracking-wider truncate">
                {t('nav.admin')}
              </p>
            </div>
          )}
        </button>
        <AdminUserModal
          open={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          userName="Admin"
          userEmail=""
        />
      </div>
    </aside>
  );
}
