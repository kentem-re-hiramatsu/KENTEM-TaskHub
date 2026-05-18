import { getProjectProgressDetail } from '@/features/projects/api/server/project-progress-api';
import { ProjectDetailPage } from '@/features/projects/project-detail/components/project-detail-page';

interface ProjectDetailContainerProps {
  projectId: string;
}

export const ProjectDetailContainer = async ({
  projectId,
}: ProjectDetailContainerProps) => {
  const detail = await getProjectProgressDetail(projectId);

  return <ProjectDetailPage detail={detail} />;
};
