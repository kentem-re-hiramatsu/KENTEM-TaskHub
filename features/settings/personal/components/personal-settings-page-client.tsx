'use client';

import { useState } from 'react';
import { useAppSession } from '@/features/auth/hooks/use-app-session';
import { css } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProjectHistoryCard } from '@/features/members/components/project-history-card';
import { mockMemberDetails } from '@/mocks/data/member-detail-data';

type PersonalForm = {
  githubAccountName: string;
  displayName: string;
  githubAccountId: string;
  role: string;
};

export const PersonalSettingsPageClient = () => {
  const { data } = useAppSession();
  const [form, setForm] = useState<PersonalForm>({
    githubAccountName: data?.user?.name ?? '',
    displayName: data?.user?.name ?? '',
    githubAccountId: data?.user?.email ?? '',
    role: '標準(user)',
  });
  const [message, setMessage] = useState('');

  const githubAccountId = data?.user?.email ?? '';
  const myMember = Object.values(mockMemberDetails).find((m) => m.login === githubAccountId);

  const updateField = (key: keyof PersonalForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage('');
  };

  const onSave = () => {
    setMessage('個人設定を保存しました（モック動作）');
  };

  return (
    <VStack className={containerStyle} alignItems="stretch" gap="16px">
      <Heading level="h1" size="large" weight="bold" text="個人設定" />

      <VStack alignItems="stretch" gap="10px" className={formBlockStyle}>
        <VStack alignItems="stretch" gap="4px">
          <Label htmlFor="personal-github-name">GitHub Account Name</Label>
          <Input
            id="personal-github-name"
            value={form.githubAccountName}
            onChange={() => {}}
            heightSize="small"
            widthSize="parentFull"
            disabled={true}
          />
        </VStack>

        <VStack alignItems="stretch" gap="4px">
          <Label htmlFor="personal-display-name">表示名</Label>
          <Input
            id="personal-display-name"
            value={form.displayName}
            onChange={(value) => updateField('displayName', value)}
            heightSize="small"
            widthSize="parentFull"
            placeholder="表示名"
          />
        </VStack>

        <VStack alignItems="stretch" gap="4px">
          <Label htmlFor="personal-github-id">GitHub Account ID</Label>
          <Input
            id="personal-github-id"
            value={form.githubAccountId}
            onChange={() => {}}
            heightSize="small"
            widthSize="parentFull"
            disabled={true}
          />
        </VStack>

        <VStack alignItems="stretch" gap="4px">
          <Label htmlFor="personal-role">権限</Label>
          <Input
            id="personal-role"
            value={form.role}
            onChange={() => {}}
            heightSize="small"
            widthSize="parentFull"
            disabled={true}
          />
        </VStack>
      </VStack>

      <HStack gap="8px" justifyContent="end">
        <Button type="button" variant="primary" onClick={onSave}>
          保存
        </Button>
      </HStack>

      {message && <p className={successTextStyle}>{message}</p>}

      <ProjectHistoryCard projectHistory={myMember?.projectHistory ?? []} />
    </VStack>
  );
};

const containerStyle = css({ p: { base: '16px', md: '24px' } });
const formBlockStyle = css({ maxW: '560px' });
const successTextStyle = css({ fontSize: '13px', color: 'app.success.DEFAULT' });
