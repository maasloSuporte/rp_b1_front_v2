import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import Breadcrumb from './Breadcrumb';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showToggle={isMobile}
      />

      {/* Overlay para mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${!isMobile ? 'ml-[270px]' : ''}`}>
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleMobileNav={() => setSidebarOpen(!sidebarOpen)}
          showToggle={!isMobile}
        />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-5">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>

        {/* Logo direito inferior */}
        <div className="fixed bottom-0 right-0 p-4 z-10">
          <img
            src="/assets/images/svgs/login/image 85.png"
            alt=""
            className="h-20 opacity-50"
            onError={(e) => {
              // Se a imagem não existir, esconde o elemento
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
  );
}
