import { ProjectDetailContainer } from '@/features/projects/project-detail/components/project-detail-container';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { projectId } = await params;
  return <ProjectDetailContainer projectId={projectId} />;
};

export default Page;
