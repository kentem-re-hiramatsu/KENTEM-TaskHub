import { getPermissions } from '@/features/settings/permissions/api/server/permissions-api';
import { PermissionsPageClient } from '@/features/settings/permissions/components/permissions-page-client';

export const PermissionsContainer = async () => {
  const data = await getPermissions();

  return (
    <PermissionsPageClient
      initialProjectName={data?.projectName ?? 'KENTEM TaskHub'}
      initialMembers={data?.members ?? []}
    />
  );
};
