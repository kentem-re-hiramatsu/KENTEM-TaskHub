import { getProjectCards } from '@/features/projects/api/server/project-progress-api';
import { ProjectsPage } from '@/features/projects/components/projects-page';

interface ProjectsContainerProps {
  includeMockProjects?: boolean;
}

export const ProjectsContainer = async ({
  includeMockProjects = true,
}: ProjectsContainerProps = {}) => {
  const projects = includeMockProjects ? await getProjectCards() : [];

  return <ProjectsPage projects={projects} />;
};
