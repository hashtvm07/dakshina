export const MENU_OPTIONS = [
  { key: 'dashboard', label: 'Dashboard', route: '/dashboard' },
  { key: 'content', label: 'Content', route: '/content' },
  { key: 'settings', label: 'Settings', route: '/settings' },
  { key: 'users', label: 'User Management', route: '/users' },
  { key: 'colleges', label: 'Colleges', route: '/colleges' },
  { key: 'vacancies', label: 'Vacancies', route: '/vacancies' },
  { key: 'registrations', label: 'Muallim Registrations', route: '/registrations' },
] as const;

export type MenuKey = (typeof MENU_OPTIONS)[number]['key'];
