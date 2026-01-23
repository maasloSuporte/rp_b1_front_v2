import {
  Home,
  Settings,
  Users,
  Shield,
  Calendar,
  Briefcase,
  Package,
  Server,
  FolderOpen,
  PlayCircle,
  FilePlus,
  LayoutDashboard,
} from 'lucide-react';
import type { ReactNode } from 'react';

const iconMap: Record<string, (props: { className?: string }) => ReactNode> = {
  aperture: LayoutDashboard,
  home: Home,
  dashboard: LayoutDashboard,
  automation: Settings,
  project: FilePlus,
  manage: Settings,
  scheduled: Calendar,
  jobs: Briefcase,
  packages: Package,
  machines: Server,
  assets: FolderOpen,
  administration: Shield,
  users: Users,
  roles: Shield,
  'group-permissions': Shield,
  execute: PlayCircle,
};

export const getIcon = (iconName?: string) => {
  if (!iconName) return null;
  
  const IconComponent = iconMap[iconName.toLowerCase()] || LayoutDashboard;
  return IconComponent;
};

export default iconMap;
