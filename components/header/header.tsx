import type { ReactNode } from 'react';
import { HeaderContainer } from '@/components/ui/header-container';

interface HeaderProps {
  logoLink?: string;
  items?: ReactNode;
}

export const Header = ({ items }: HeaderProps) => {
  return <HeaderContainer logo={<span>KENTEM-TaskHub</span>} items={items} />;
};
