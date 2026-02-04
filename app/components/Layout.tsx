import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import Breadcrumb from './Breadcrumb';

const SIDEBAR_WIDTH = 270;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Fecha sidebar no mobile após navegação
    if (isMobile) {
      setSidebarOpen(false);
    }
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location, isMobile]);

  const desktopSidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={!isMobile && sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        showToggle={isMobile}
        width={isMobile ? SIDEBAR_WIDTH : desktopSidebarWidth}
      />

      {/* Overlay para mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content - margem conforme sidebar (desktop) ou 0 (mobile). min-w-0 + overflow-x-hidden evita scroll lateral. */}
      <div
        className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden transition-[margin] duration-300"
        style={{ marginLeft: isMobile ? 0 : desktopSidebarWidth }}
      >
        <Header
          onToggleSidebar={() => (!isMobile ? setSidebarCollapsed((c) => !c) : setSidebarOpen((o) => !o))}
          onToggleMobileNav={() => setSidebarOpen(!sidebarOpen)}
          showToggle={!isMobile}
        />

        <main className="flex-1 bg-background min-w-0 overflow-x-hidden">
          <div className="p-5 min-w-0 max-w-full">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
