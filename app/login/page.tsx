import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { PAGE_INFO } from '@/constants/url';
import { LoginPage } from '@/features/auth/components/login-page';

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(PAGE_INFO.assignedProjects.url);
  }

  return <LoginPage />;
};

export default Page;
