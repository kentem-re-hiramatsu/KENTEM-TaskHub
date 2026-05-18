import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { css } from 'styled-system/css';
import { Stack } from 'styled-system/jsx';
import { Header } from '@/components/header/header';
import { HeaderMenu } from '@/components/header/header-menu';
import { AuthProvider } from '@/components/providers/auth-provider';
import { MswProvider } from '@/components/providers/msw-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SidebarLayout } from '@/components/sidebar-layout/sidebar-layout';
import { PAGE_INFO } from '@/constants/url';
import './globals.css';

export const metadata: Metadata = {
  title: 'KENTEM TaskHub',
  description: 'KENTEM TaskHub',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body className={bodyStyle}>
        <ThemeProvider>
          <AuthProvider>
            <MswProvider>
              <QueryProvider>
                <Suspense>
                  <NuqsAdapter>
                    <Stack h="100svh" gap="0">
                      <div className={css({ position: 'relative', zIndex: '100' })}>
                        <Header
                          logoLink={PAGE_INFO.assignedProjects.url}
                          items={<HeaderMenu />}
                        />
                      </div>
                      <SidebarLayout>{children}</SidebarLayout>
                    </Stack>
                  </NuqsAdapter>
                </Suspense>
              </QueryProvider>
            </MswProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

const bodyStyle = css({
  fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
  bg: 'app.bg',
  color: 'app.text',
});
