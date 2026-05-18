import { NextResponse } from 'next/server';
import {
  permissionStore,
  validRoles,
  type PermissionResponse,
} from '@/features/settings/permissions/model/permission-store';

export async function GET() {
  return NextResponse.json(permissionStore);
}

export async function PUT(request: Request) {
  const body = (await request
    .json()
    .catch(() => null)) as PermissionResponse | null;
  if (!body || !Array.isArray(body.members)) {
    return NextResponse.json(
      { error: '更新内容が不正です。' },
      { status: 400 },
    );
  }

  const hasInvalidRole = body.members.some(
    (member) => !validRoles.includes(member.role),
  );
  if (hasInvalidRole) {
    return NextResponse.json(
      { error: 'role は admin/standard のみ指定できます。' },
      { status: 400 },
    );
  }

  const adminCount = body.members.filter(
    (member) => member.role === 'admin',
  ).length;
  if (adminCount === 0) {
    return NextResponse.json(
      { error: '管理者を最低1名設定してください。' },
      { status: 400 },
    );
  }

  const hasMissingLogin = body.members.some((member) => !member.login.trim());
  if (hasMissingLogin) {
    return NextResponse.json(
      { error: 'GitHub login は必須です。' },
      { status: 400 },
    );
  }

  const normalizedLogins = body.members.map((member) =>
    member.login.trim().toLowerCase(),
  );
  if (new Set(normalizedLogins).size !== normalizedLogins.length) {
    return NextResponse.json(
      { error: 'GitHub login が重複しています。' },
      { status: 400 },
    );
  }

  permissionStore.members = body.members;
  return NextResponse.json(permissionStore);
}
