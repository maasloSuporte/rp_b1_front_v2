import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobileNav: () => void;
  showToggle?: boolean;
}

export default function Header({
  onToggleSidebar,
  onToggleMobileNav,
  showToggle = true,
}: HeaderProps) {
  return (
    <header className="h-[70px] bg-white shadow-sm border-b border-gray-200 flex items-center px-4">
      {showToggle ? (
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-600 hover:text-gray-900 lg:block hidden"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      ) : (
        <button
          onClick={onToggleMobileNav}
          className="p-2 text-gray-600 hover:text-gray-900 lg:hidden"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      <div className="flex-1"></div>

      <button
        onClick={onToggleMobileNav}
        className="p-2 text-gray-600 hover:text-gray-900 lg:hidden"
      >
        <span className="text-xl">⚙️</span>
      </button>
    </header>
  );
}
