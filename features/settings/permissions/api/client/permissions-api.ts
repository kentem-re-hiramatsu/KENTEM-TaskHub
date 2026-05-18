import type { PermissionResponse } from '@/features/settings/permissions/api/server/permissions-api';

export const updatePermissions = async (payload: PermissionResponse) => {
  const response = await fetch('/api/permissions', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as PermissionResponse & {
    error?: string;
  };

  return {
    ok: response.ok,
    result,
  };
};
