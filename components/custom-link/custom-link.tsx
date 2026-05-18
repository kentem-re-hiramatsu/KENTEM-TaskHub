'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import nProgress from 'nprogress';
import { createSerializer, parseAsIsoDate, useQueryState } from 'nuqs';
import type { ComponentProps, ReactNode } from 'react';

interface CustomLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  href: string;
  children: ReactNode;
}

const serialize = createSerializer({
  date: parseAsIsoDate,
});

export const CustomLink = ({ children, ...props }: CustomLinkProps) => {
  const [date] = useQueryState('date', parseAsIsoDate);
  const pathname = usePathname();
  return (
    <Link
      onNavigate={(e) => {
        if (pathname === props.href.toString()) {
          e.preventDefault();
          window.location.reload();
        }
        nProgress.start();
      }}
      {...props}
      href={serialize(props.href.toString(), { date })}
    >
      {children}
    </Link>
  );
};
