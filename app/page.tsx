import { redirect } from 'next/navigation';
import { PAGE_INFO } from '@/constants/url';

const Page = () => redirect(PAGE_INFO.assignedProjects.url);

export default Page;
