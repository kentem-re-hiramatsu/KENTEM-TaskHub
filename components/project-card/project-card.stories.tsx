import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard, ProjectCardSkeleton } from './project-card';

const meta = {
  title: 'components/ProjectCard',
  component: ProjectCard,
  args: {
    projectName: 'ProjectName',
    version: '1.0.0',
    plannedProgress: 55.6,
    actualProgress: 60.0,
    iterationCount: 3,
    href: 'https://example.com',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectCard>;

export default meta;

export const Default: StoryObj<typeof ProjectCard> = {};

export const NoLink: StoryObj<typeof ProjectCard> = {
  args: {
    href: undefined,
  },
};

export const BehindSchedule: StoryObj<typeof ProjectCard> = {
  args: {
    projectName: '遅延中プロジェクト',
    version: '0.5.2',
    plannedProgress: 70.0,
    actualProgress: 35.0,
    iterationCount: 5,
  },
};

export const AheadOfSchedule: StoryObj<typeof ProjectCard> = {
  args: {
    projectName: '先行中プロジェクト',
    version: '2.1.0',
    plannedProgress: 40.0,
    actualProgress: 65.0,
    iterationCount: 4,
  },
};

export const Complete: StoryObj<typeof ProjectCard> = {
  args: {
    projectName: '完了プロジェクト',
    version: '1.0.0',
    plannedProgress: 100.0,
    actualProgress: 100.0,
    iterationCount: 10,
  },
};

export const Skeleton: StoryObj<typeof ProjectCard> = {
  render: () => <ProjectCardSkeleton />,
};
