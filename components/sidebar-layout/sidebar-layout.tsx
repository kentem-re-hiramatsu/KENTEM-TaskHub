'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { PAGE_INFO } from '@/constants/url';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { CustomLink } from '../custom-link/custom-link';

type SelectedType =
  | 'assignedProjects'
  | 'home'
  | 'members'
  | 'projectRegistration'
  | 'estimateCriteria'
  | 'developer'
  | 'settings';

interface MenuItem {
  text: string;
  icon: string;
  href: string;
  type: SelectedType;
}

const topMenu: readonly MenuItem[] = [
  { text: '担当', icon: 'member', href: PAGE_INFO.assignedProjects.url, type: 'assignedProjects' },
  { text: '一覧', icon: 'dashboard', href: PAGE_INFO.home.url, type: 'home' },
  { text: 'メンバー', icon: 'grouping', href: PAGE_INFO.members.url, type: 'members' },
  { text: '登録', icon: 'constructionAdd', href: PAGE_INFO.projectRegistration.url, type: 'projectRegistration' },
  { text: '見積', icon: 'list', href: PAGE_INFO.estimateCriteria.url, type: 'estimateCriteria' },
];

const bottomMenu: readonly MenuItem[] = [
  { text: '開発', icon: 'constructionAdd', href: PAGE_INFO.developer.url, type: 'developer' },
  { text: '設定', icon: 'settings', href: PAGE_INFO.settings.url, type: 'settings' },
];

interface SidebarLayoutProps {
  children: ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const pathname = usePathname();
  const selectedType: SelectedType | null = pathname.startsWith(PAGE_INFO.assignedProjects.url)
    ? 'assignedProjects'
    : pathname.startsWith(PAGE_INFO.home.url)
      ? 'home'
      : pathname.startsWith('/members')
        ? 'members'
        : pathname.startsWith('/project-registration')
          ? 'projectRegistration'
          : pathname.startsWith('/estimate-criteria')
            ? 'estimateCriteria'
            : pathname.startsWith('/developer')
              ? 'developer'
              : pathname.startsWith('/settings')
                ? 'settings'
                : null;

  const toNavItem = (item: MenuItem) => ({
    text: item.text,
    icon: item.icon,
    isSelected: item.type === selectedType,
    renderItem: (props: { className: string; children: ReactNode }) => (
      <CustomLink href={item.href} className={props.className}>
        {props.children}
      </CustomLink>
    ),
  });

  return (
    <Flex flex="1" overflow="hidden">
      <NavigationBar
        topMenu={topMenu.map(toNavItem)}
        bottomMenu={bottomMenu.map(toNavItem)}
      />
      <div className={css({ flex: '1', overflow: 'auto' })}>{children}</div>
    </Flex>
  );
};
