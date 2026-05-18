import { ProjectSettingsContainer } from '@/features/projects/project-detail/components/project-settings-container';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { projectId } = await params;
  return <ProjectSettingsContainer projectId={projectId} />;
};

export default Page;
