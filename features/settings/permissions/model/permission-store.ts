export type AppRole = 'admin' | 'standard';

export interface PermissionMember {
  userId: string;
  githubUserId: number;
  login: string;
  memberName: string;
  displayName: string;
  role: AppRole;
}

export interface PermissionResponse {
  projectId: string;
  projectName: string;
  members: PermissionMember[];
}

export const validRoles: AppRole[] = ['admin', 'standard'];

export const permissionStore: PermissionResponse = {
  projectId: 'pjt-001',
  projectName: 'KENTEM TaskHub',
  members: [
    {
      userId: 'u-001',
      githubUserId: 1001,
      login: 'pl-kentem',
      memberName: '',
      displayName: 'PL 山田',
      role: 'admin',
    },
    {
      userId: 'u-002',
      githubUserId: 1002,
      login: 'fe-kentem',
      memberName: '',
      displayName: 'FE 佐藤',
      role: 'standard',
    },
    {
      userId: 'u-003',
      githubUserId: 1003,
      login: 'be-kentem',
      memberName: '',
      displayName: 'BE 鈴木',
      role: 'standard',
    },
  ],
};

export const linkMemberByGithubLogin = (params: {
  login: string;
  githubUserId: number;
  memberName?: string;
  displayName?: string;
}) => {
  const normalizedLogin = params.login.trim().toLowerCase();
  if (!normalizedLogin) return;

  const member = permissionStore.members.find(
    (item) => item.login.trim().toLowerCase() === normalizedLogin,
  );
  if (!member) return;

  member.githubUserId = params.githubUserId;
  if (!member.memberName.trim() && params.memberName?.trim()) {
    member.memberName = params.memberName.trim();
  }
  if (!member.displayName.trim() && params.displayName?.trim()) {
    member.displayName = params.displayName.trim();
  }
};
