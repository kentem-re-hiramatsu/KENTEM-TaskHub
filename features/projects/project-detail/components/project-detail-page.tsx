import Link from 'next/link';
import { css } from 'styled-system/css';
import { VStack } from 'styled-system/jsx';
import { ProjectDetailPageClient } from '@/features/projects/project-detail/components/project-detail-page-client';
import type { ProjectProgressDetail } from '@/mocks/data/project-progress-detail-data';

interface ProjectDetailPageProps {
  detail?: ProjectProgressDetail;
}

export const ProjectDetailPage = ({ detail }: ProjectDetailPageProps) => {
  if (!detail) {
    return (
      <VStack className={containerStyle} alignItems="flex-start" gap="12px">
        <h1 className={titleStyle}>プロジェクト詳細</h1>
        <p>データ取得に失敗しました。</p>
        <Link href="/projects">戻る</Link>
      </VStack>
    );
  }

  return <ProjectDetailPageClient detail={detail} />;
};

const containerStyle = css({
  p: { base: '16px', md: '24px' },
});

const titleStyle = css({
  fontSize: '24px',
  fontWeight: '700',
  color: 'token(colors.ksTheme.text.active)',
});
