'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { css } from 'styled-system/css';
import { VStack } from 'styled-system/jsx';
import { PAGE_INFO } from '@/constants/url';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

const errorMessageByCode: Record<string, string> = {
  accessDenied:
    'このアカウントは利用対象外です。社内 kentem を含むアカウントでログインしてください。',
  orgCheckFailed:
    '組織所属の確認に失敗しました。時間をおいてから再度お試しください。',
};

const normalizeErrorCode = (errorCode: string) => {
  if (errorCode === 'AccessDenied') return 'accessDenied';
  if (errorCode === 'OrgCheckFailed') return 'orgCheckFailed';
  return errorCode;
};

export const LoginPage = () => {
  const searchParams = useSearchParams();
  const errorCode = normalizeErrorCode(searchParams.get('error') ?? '');
  const ghLogin = searchParams.get('gh_login') ?? '';

  return (
    <VStack className={wrapStyle}>
      <VStack className={cardStyle}>
        <Heading level="h1" size="large" weight="bold" text="KENTEM TaskHub ログイン" />
        <p className={descStyle}>
          GitHub OAuth でログインしてください。社内 kentem を含むユーザーのみ利用できます。
        </p>
        {errorCode ? (
          <p className={errorStyle}>
            {errorMessageByCode[errorCode] ?? 'ログインに失敗しました。再度お試しください。'}
            {ghLogin ? `（検出されたGitHubアカウント: ${ghLogin}）` : ''}
          </p>
        ) : null}
        <Button
          type="button"
          onClick={() =>
            void signIn('github', { callbackUrl: PAGE_INFO.assignedProjects.url })
          }
          horizontalSize="parentFull"
        >
          GitHub でログイン
        </Button>
      </VStack>
    </VStack>
  );
};

const wrapStyle = css({
  minHeight: '100svh',
  justifyContent: 'center',
  alignItems: 'center',
  p: '24px',
  bg: 'app.bg',
});

const cardStyle = css({
  width: '100%',
  maxWidth: '520px',
  gap: '16px',
  alignItems: 'stretch',
  p: '28px',
  border: '1px solid token(colors.app.border)',
  borderRadius: '14px',
  bg: 'app.bgElevated',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
});

const descStyle = css({ fontSize: '14px', color: 'app.textSecondary', lineHeight: '1.6' });
const errorStyle = css({ fontSize: '14px', color: 'app.error.DEFAULT', lineHeight: '1.5' });
