export interface NavItem {
  displayName?: string;
  disabled?: boolean;
  external?: boolean;
  twoLines?: boolean;
  chip?: boolean;
  iconName?: string;
  navCap?: string;
  chipContent?: string;
  chipClass?: string;
  subtext?: string;
  route?: string;
  children?: NavItem[];
  ddType?: string;
}

export const navItems: NavItem[] = [
  {
    navCap: 'DASHBOARDS',
    chipClass: 'title-sidebar'
  },
  {
    displayName: 'Home',
    iconName: 'home',
    route: '/dashboard',
  },
  {
    navCap: 'PROJECTS',
    chipClass: 'title-sidebar'
  },
  {
    displayName: 'Automation',
    iconName: 'automation',
    children: [
      {
        displayName: 'Automation',
        route: 'automation',
      },
      {
        displayName: 'Create Project',
        route: 'project',
      },
    ],
  },
  {
    navCap: 'MANAGE',
    chipClass: 'title-sidebar'
  },
  {
    displayName: 'Manage',
    iconName: 'manage',
    children: [
      {
        displayName: 'Scheduled',
        chipClass: 'children',
        route: 'scheduled',
      },
      {
        displayName: 'Jobs',
        chipClass: 'children',
        route: 'jobs',
      },
      {
        displayName: 'Packages',
        chipClass: 'children',
        route: 'packages',
      },
      {
        displayName: 'Machines',
        chipClass: 'children',
        route: 'machines',
      },
      {
        displayName: 'Assets',
        chipClass: 'children',
        route: 'assets',
      }
    ],
  },
  {
    navCap: 'ADMINISTRATION',
    chipClass: 'title-sidebar'
  },
  {
    displayName: 'Administration',
    iconName: 'administration',
    children: [
      {
        displayName: 'Users',
        route: 'users',
      },
      {
        displayName: 'Group permissions',
        route: 'roles',
      },
    ],
  },
];
