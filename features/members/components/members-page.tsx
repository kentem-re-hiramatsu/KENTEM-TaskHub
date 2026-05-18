import type { Member } from '@/features/members/components/members-page-client';
import { MembersPageClient } from '@/features/members/components/members-page-client';

const initialMembers: Member[] = [
  {
    userId: 'u-001',
    memberName: '山田 太郎',
    displayName: 'PL 山田',
    login: 'pl-kentem',
    role: 'admin',
    isLinked: true,
  },
  {
    userId: 'u-002',
    memberName: '佐藤 花子',
    displayName: 'FE 佐藤',
    login: 'fe-kentem',
    role: 'standard',
    isLinked: false,
  },
  {
    userId: 'u-003',
    memberName: '鈴木 一郎',
    displayName: 'BE 鈴木',
    login: 'be-kentem',
    role: 'standard',
    isLinked: true,
  },
];

export const MembersPage = async () => {
  return <MembersPageClient initialMembers={initialMembers} />;
};
