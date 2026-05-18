import { PermissionsPageClient } from '@/features/settings/permissions/components/permissions-page-client';

const initialMembers = [
  {
    userId: 'u-001',
    githubUserId: 1001,
    login: 'pl-kentem',
    memberName: '山田 太郎',
    displayName: 'PL 山田',
    role: 'admin',
  },
  {
    userId: 'u-002',
    githubUserId: 1002,
    login: 'fe-kentem',
    memberName: '佐藤 花子',
    displayName: 'FE 佐藤',
    role: 'standard',
  },
  {
    userId: 'u-003',
    githubUserId: 1003,
    login: 'be-kentem',
    memberName: '鈴木 一郎',
    displayName: 'BE 鈴木',
    role: 'standard',
  },
] as const;

export const PermissionsPage = async () => {
  return (
    <PermissionsPageClient
      initialProjectName="KENTEM TaskHub"
      initialMembers={[...initialMembers]}
    />
  );
};
