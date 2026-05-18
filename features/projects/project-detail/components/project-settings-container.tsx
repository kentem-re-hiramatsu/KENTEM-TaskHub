import Link from 'next/link';
import { css } from 'styled-system/css';
import { VStack } from 'styled-system/jsx';
import { getProjectProgressDetail } from '@/features/projects/api/server/project-progress-api';
import { ProjectSettingsPageClient } from '@/features/projects/project-detail/components/project-settings-page-client';

interface ProjectSettingsContainerProps {
  projectId: string;
}

export const ProjectSettingsContainer = async ({ projectId }: ProjectSettingsContainerProps) => {
  const detail = await getProjectProgressDetail(projectId);

  if (!detail) {
    return (
      <VStack className={errorStyle} alignItems="flex-start" gap="12px">
        <p>データ取得に失敗しました。</p>
        <Link href="/projects">プロジェクト一覧へ戻る</Link>
      </VStack>
    );
  }

  return <ProjectSettingsPageClient detail={detail} />;
};

const errorStyle = css({ p: { base: '16px', md: '24px' } });
