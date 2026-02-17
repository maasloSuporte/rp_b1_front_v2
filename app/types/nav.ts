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

/** Chaves de tradução para itens do menu (nav). Use t(key) no componente. */
export const navItems: NavItem[] = [
  {
    navCap: 'nav.dashboards',
    chipClass: 'title-sidebar'
  },
  {
    displayName: 'nav.home',
    iconName: 'home',
    route: '/dashboard',
  },
  {
    navCap: 'nav.projects',
    chipClass: 'title-sidebar'
  },
  {
    displayName: 'nav.automation',
    iconName: 'automation',
    children: [
      {
        displayName: 'nav.automation',
        route: '/automation',
      },
      {
        displayName: 'nav.createProject',
        route: '/project',
      },
    ],
  },
  {
    navCap: 'nav.manage',
    chipClass: 'title-sidebar'
  },
  {
    displayName: 'nav.manage',
    iconName: 'manage',
    children: [
      {
        displayName: 'nav.scheduled',
        chipClass: 'children',
        route: '/scheduled',
      },
      {
        displayName: 'nav.jobs',
        chipClass: 'children',
        route: '/jobs',
      },
      {
        displayName: 'nav.packages',
        chipClass: 'children',
        route: '/packages',
      },
      {
        displayName: 'nav.machines',
        chipClass: 'children',
        route: '/machines',
      },
      {
        displayName: 'nav.assets',
        chipClass: 'children',
        route: '/assets',
      }
    ],
  },
  {
    navCap: 'nav.administration',
    chipClass: 'title-sidebar'
  },
  {
    displayName: 'nav.administration',
    iconName: 'administration',
    children: [
      {
        displayName: 'nav.users',
        route: '/users',
      },
      {
        displayName: 'nav.groupPermissions',
        route: '/roles',
      },
    ],
  },
];
