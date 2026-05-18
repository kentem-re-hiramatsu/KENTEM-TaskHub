import type { Meta, StoryObj } from '@storybook/react';
import { CustomLink } from './custom-link';

const meta = {
  title: 'components/CustomLink',
  component: CustomLink,
  args: {
    href: '/',
    children:
      'TopLoaderを走らせるためのカスタムのリンクです。リンクにはこちらを使うように今後はお願いします',
  },
} satisfies Meta<typeof CustomLink>;

export default meta;

export const Default: StoryObj<typeof CustomLink> = {};
