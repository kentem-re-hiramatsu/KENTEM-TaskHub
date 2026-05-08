import '../styles/globals.css';
import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0, gcTime: 0, retry: false } },
});

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['components', 'features', 'ks-react-components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    screenshot: {
      delay: 0,
      viewport: {
        width: 600,
        height: 400,
        deviceScaleFactor: 1,
        isMobile: false,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <Story />
          </NuqsAdapter>
        </QueryClientProvider>
      );
    },
  ],
  tags: ['autodocs'],
};

export default preview;
