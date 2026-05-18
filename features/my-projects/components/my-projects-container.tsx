import { getProjectCards } from '@/features/projects/api/server/project-progress-api';
import { MyProjectsPage } from '@/features/my-projects/components/my-projects-page';

export const MyProjectsContainer = async () => {
  const projects = await getProjectCards();
  return <MyProjectsPage projects={projects} />;
};
