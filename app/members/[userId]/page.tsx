import { notFound } from 'next/navigation';
import { mockMemberDetails } from '@/mocks/data/member-detail-data';
import { MemberDetailPageClient } from '@/features/members/member-detail/components/member-detail-page-client';

type Props = {
  params: Promise<{ userId: string }>;
};

const Page = async ({ params }: Props) => {
  const { userId } = await params;
  const member = mockMemberDetails[userId];
  if (!member) notFound();

  return <MemberDetailPageClient member={member} />;
};

export default Page;
