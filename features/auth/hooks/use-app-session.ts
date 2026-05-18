'use client';

import { useSession } from 'next-auth/react';
import { mockMemberDetails } from '@/mocks/data/member-detail-data';

const MOCK_USER_ID = process.env.NEXT_PUBLIC_MOCK_USER_ID;

export type AppSession = {
  data: {
    user: {
      name: string;
      email: string;
    };
  } | null;
  status: 'authenticated' | 'loading' | 'unauthenticated';
};

export const useAppSession = (): AppSession => {
  const realSession = useSession();

  if (MOCK_USER_ID) {
    const member = mockMemberDetails[MOCK_USER_ID];
    if (member) {
      return {
        data: {
          user: {
            name: member.memberName,
            email: member.login,
          },
        },
        status: 'authenticated',
      };
    }
  }

  return {
    data: realSession.data
      ? {
          user: {
            name: realSession.data.user?.name ?? '',
            email: realSession.data.user?.email ?? '',
          },
        }
      : null,
    status: realSession.status,
  };
};
