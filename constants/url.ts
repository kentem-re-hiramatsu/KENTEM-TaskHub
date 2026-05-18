interface PageInfo {
  url: string;
  title: string;
}

export const PAGE_INFO = {
  assignedProjects: {
    url: '/my-projects',
    title: 'Assigned Projects',
  },
  home: {
    url: '/projects',
    title: 'Project List',
  },
  members: {
    url: '/members',
    title: 'Members',
  },
  projectRegistration: {
    url: '/project-registration',
    title: 'Project Registration',
  },
  estimateCriteria: {
    url: '/estimate-criteria',
    title: 'Estimate Criteria',
  },
  developer: {
    url: '/developer',
    title: 'Developer',
  },
  personalSettings: {
    url: '/profile',
    title: 'Personal Settings',
  },
  settings: {
    url: '/settings',
    title: 'Settings',
  },
} as const satisfies Record<string, PageInfo>;
