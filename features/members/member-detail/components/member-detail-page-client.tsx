'use client';

import Link from 'next/link';
import { css } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { Card } from '@/components/card/card';
import { Heading } from '@/components/ui/heading';
import { ProjectHistoryCard } from '@/features/members/components/project-history-card';
import type { MemberDetailData } from '@/mocks/data/member-detail-data';

interface Props {
  member: MemberDetailData;
}

export const MemberDetailPageClient = ({ member }: Props) => {
  return (
    <VStack className={containerStyle} alignItems="stretch" gap="24px">
      <Link href="/members" className={backLinkStyle}>
        ← メンバー一覧
      </Link>

      <Card>
        <VStack alignItems="stretch" gap="16px">
          <HStack alignItems="center" gap="10px">
            <Heading level="h1" size="xLarge" weight="bold" text={member.memberName || member.displayName} />
            <span className={member.isLinked ? linkedBadgeStyle : unlinkedBadgeStyle}>
              {member.isLinked ? '連携済み' : '未連携'}
            </span>
            <span className={roleBadgeStyle}>
              {member.role === 'admin' ? '管理者' : '標準'}
            </span>
          </HStack>
          <div className={profileDividerStyle} />
          <div className={profileGridStyle}>
            <span className={profileLabelStyle}>GitHub Account Name</span>
            <span className={profileValueStyle}>{member.memberName || '-'}</span>
            <span className={profileLabelStyle}>表示名</span>
            <span className={profileValueStyle}>{member.displayName}</span>
            <span className={profileLabelStyle}>GitHub Account ID</span>
            <span className={profileValueStyle}>{member.login || '-'}</span>
          </div>
        </VStack>
      </Card>

      <ProjectHistoryCard projectHistory={member.projectHistory} />
    </VStack>
  );
};

const containerStyle = css({ p: { base: '16px', md: '24px' }, maxWidth: '900px', mx: 'auto' });

const backLinkStyle = css({
  fontSize: '14px',
  color: 'app.primary',
  textDecoration: 'none',
  _hover: { opacity: '0.7' },
  width: 'fit-content',
});

const linkedBadgeStyle = css({
  fontSize: '12px',
  fontWeight: '600',
  px: '10px',
  py: '3px',
  rounded: '999px',
  bgColor: 'token(colors.app.success)/15',
  color: 'app.success',
});

const unlinkedBadgeStyle = css({
  fontSize: '12px',
  fontWeight: '600',
  px: '10px',
  py: '3px',
  rounded: '999px',
  bgColor: 'token(colors.app.textSecondary)/12',
  color: 'app.textSecondary',
});

const roleBadgeStyle = css({
  fontSize: '12px',
  fontWeight: '600',
  px: '10px',
  py: '3px',
  rounded: '999px',
  bgColor: 'token(colors.app.primary)/10',
  color: 'app.primary',
});

const profileDividerStyle = css({
  borderTop: '1px solid token(colors.app.separator)',
});

const profileGridStyle = css({
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  rowGap: '12px',
  alignItems: 'center',
});

const profileLabelStyle = css({
  fontSize: '13px',
  color: 'app.textSecondary',
  fontWeight: '500',
  whiteSpace: 'nowrap',
});

const profileValueStyle = css({
  fontSize: '14px',
  color: 'app.text',
  fontWeight: '500',
});
