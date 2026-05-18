import { headers } from 'next/headers';

type AppRole = 'admin' | 'standard';

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

const createBaseUrl = async () => {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http';
  const host = requestHeaders.get('host') ?? 'localhost:3000';
  return `${protocol}://${host}`;
};

export const getPermissions = async () => {
  const baseUrl = await createBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/permissions`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as PermissionResponse;
  } catch {
    return undefined;
  }
};
