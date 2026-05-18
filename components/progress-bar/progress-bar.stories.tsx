import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './progress-bar';

const meta = {
  title: 'components/ProgressBar',
  component: ProgressBar,
  args: {
    value: 60,
    plannedValue: 50,
    max: 100,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;

export const Default: StoryObj<typeof ProgressBar> = {};

export const BehindSchedule: StoryObj<typeof ProgressBar> = {
  args: {
    value: 30,
    plannedValue: 60,
    max: 100,
  },
};

export const AheadOfSchedule: StoryObj<typeof ProgressBar> = {
  args: {
    value: 80,
    plannedValue: 50,
    max: 100,
  },
};

export const Empty: StoryObj<typeof ProgressBar> = {
  args: {
    value: 0,
    plannedValue: 30,
    max: 100,
  },
};

export const Complete: StoryObj<typeof ProgressBar> = {
  args: {
    value: 100,
    plannedValue: 100,
    max: 100,
  },
};

export const TaskCount: StoryObj<typeof ProgressBar> = {
  args: {
    value: 7,
    plannedValue: 10,
    max: 20,
  },
};
