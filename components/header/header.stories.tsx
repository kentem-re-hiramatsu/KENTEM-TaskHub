import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import { Header } from './header';

const meta = {
  title: 'components/Header',
  component: Header,
  args: {
    logoLink: '/',
    items: (
      <Button variant="primary" size="small">
        dummy
      </Button>
    ),
  },
} satisfies Meta<typeof Header>;

export default meta;

export const Default: StoryObj<typeof Header> = {};

export const NonItem = () => {
  return (
    <>
      <p>error画面等で使うヘッダです</p>
      <Header logoLink="/" items={undefined} />
    </>
  );
};

export const NonLogoLink = () => {
  return (
    <>
      <p>共有画面で使うヘッダです</p>
      <Header items={undefined} />
    </>
  );
};
