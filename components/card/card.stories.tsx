import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from 'styled-system/jsx';
import { Card } from './card';

const SampleHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <VStack alignItems="flex-start" gap="4px">
    <span
      style={{
        fontSize: '17px',
        fontWeight: 'bold',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      }}
    >
      {title}
    </span>
    {subtitle && (
      <span style={{ fontSize: '13px', lineHeight: 1.4, color: '#888' }}>
        {subtitle}
      </span>
    )}
  </VStack>
);

const meta = {
  title: 'components/Card',
  component: Card,
  args: {
    header: <SampleHeader title="タイトル" subtitle="サブタイトル" />,
    children: 'カードの本文がここに入ります。',
  },
} satisfies Meta<typeof Card>;

export default meta;

export const Default: StoryObj<typeof Card> = {};

export const TitleOnly: StoryObj<typeof Card> = {
  args: {
    header: <SampleHeader title="タイトルのみ" />,
    children: undefined,
  },
};

export const WithFooter: StoryObj<typeof Card> = {
  args: {
    header: <SampleHeader title="お知らせ" subtitle="2026/05/08" />,
    children: 'フッターにアクションボタンを配置できます。',
    footer: (
      <>
        <button type="button">キャンセル</button>
        <button type="button">OK</button>
      </>
    ),
  },
};

export const Clickable: StoryObj<typeof Card> = {
  args: {
    header: (
      <SampleHeader
        title="クリック可能なカード"
        subtitle="タップするとアニメーションします"
      />
    ),
    children: 'onClick を渡すとインタラクティブになります。',
    onClick: () => {
      // eslint-disable-next-line no-alert
      alert('カードがクリックされました');
    },
  },
};

export const BodyOnly: StoryObj<typeof Card> = {
  args: {
    header: undefined,
    children: '本文だけのシンプルなカードです。',
  },
};
