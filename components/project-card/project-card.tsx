import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { css, cva } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { Card } from '../card/card';
import { ProgressBar } from '../progress-bar/progress-bar';

interface ProjectCardProps {
  projectName: string;
  version: string;
  plannedProgress: number;
  actualProgress: number;
  iterationCount: number;
  href?: string;
  showDetailLink?: boolean;
  showMeta?: boolean;
}

interface ProjectCardSkeletonProps {
  showLink?: boolean;
}

const PLANNED_COLOR = '#007AFF';
const ACTUAL_COLOR = '#34C759';

export const ProjectCard = ({
  projectName,
  version,
  plannedProgress,
  actualProgress,
  iterationCount,
  href,
  showDetailLink = true,
  showMeta = true,
}: ProjectCardProps) => {
  const isDelayed = actualProgress < plannedProgress;
  const isExternalLink = href?.startsWith('http://') || href?.startsWith('https://');
  const detailLink =
    showDetailLink && href ? (
      isExternalLink ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${projectName} を別タブで開く`}
          className={linkStyle}
        >
          <ExternalLink size={18} className={css({ color: 'app.textSecondary' })} />
        </a>
      ) : (
        <Link
          href={href}
          aria-label={`${projectName} の詳細を表示`}
          className={linkStyle}
        >
          <ExternalLink size={18} className={css({ color: 'app.textSecondary' })} />
        </Link>
      )
    ) : null;

  const header = (
    <HStack width="100%" justifyContent="space-between" alignItems="flex-start" gap="8px">
      <VStack alignItems="flex-start" gap="4px">
        <span className={titleStyle}>{projectName}</span>
        {showMeta && (
          <HStack gap="12px" alignItems="center">
            <span className={metaStyle}>Ver {version}</span>
            <span className={metaStyle}>{iterationCount} イテレーション</span>
          </HStack>
        )}
      </VStack>
      {detailLink}
    </HStack>
  );

  return (
    <Card header={header}>
      <VStack alignItems="stretch" gap="12px">
        <ProgressBar
          value={actualProgress}
          plannedValue={plannedProgress}
          max={100}
          aria-label={`${projectName} の進捗`}
        />
        <HStack gap="32px" alignItems="flex-start">
          <VStack alignItems="flex-start" gap="4px">
            <span className={progressLabelStyle} style={{ color: PLANNED_COLOR }}>予定進捗</span>
            <span className={progressValueStyle}>{plannedProgress.toFixed(1)}%</span>
          </VStack>
          <VStack alignItems="flex-start" gap="4px">
            <span className={progressLabelStyle} style={{ color: ACTUAL_COLOR }}>実績進捗</span>
            <span className={progressValueStyle}>{actualProgress.toFixed(1)}%</span>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
};

export const ProjectCardSkeleton = ({ showLink = true }: ProjectCardSkeletonProps) => {
  const header = (
    <HStack width="100%" justifyContent="space-between" alignItems="flex-start" gap="8px">
      <VStack alignItems="flex-start" gap="8px" flex="1">
        <span className={skeletonRecipe({ size: 'title' })} />
        <HStack gap="12px" alignItems="center">
          <span className={skeletonRecipe({ size: 'version' })} />
          <span className={skeletonRecipe({ size: 'iteration' })} />
        </HStack>
      </VStack>
      {showLink ? <span className={skeletonRecipe({ size: 'icon' })} /> : null}
    </HStack>
  );

  return (
    <Card header={header}>
      <VStack alignItems="stretch" gap="12px">
        <span className={skeletonRecipe({ size: 'progressBar' })} />
        <HStack gap="32px" alignItems="flex-start">
          <VStack alignItems="flex-start" gap="6px">
            <span className={skeletonRecipe({ size: 'label' })} />
            <span className={skeletonRecipe({ size: 'value' })} />
          </VStack>
          <VStack alignItems="flex-start" gap="6px">
            <span className={skeletonRecipe({ size: 'label' })} />
            <span className={skeletonRecipe({ size: 'value' })} />
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
};

const titleStyle = css({ fontSize: '18px', fontWeight: '600', lineHeight: '1.3', color: 'app.text' });
const metaStyle = css({ fontSize: '13px', lineHeight: '1.4', color: 'app.textSecondary' });
const progressLabelStyle = css({ fontSize: '13px', lineHeight: '1.4' });
const progressValueStyle = css({ fontSize: '14px', lineHeight: '1.4', color: 'app.text' });

const linkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  rounded: '6px',
  cursor: 'pointer',
  _hover: { color: 'app.primary' },
  _focusVisible: { outline: '2px solid token(colors.app.borderFocused)', outlineOffset: '2px' },
});

const skeletonRecipe = cva({
  base: {
    display: 'inline-block',
    borderRadius: '6px',
    background: 'linear-gradient(90deg, token(colors.app.fill) 0%, token(colors.app.fillSecondary) 45%, token(colors.app.fill) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s ease-in-out infinite',
  },
  variants: {
    size: {
      title: { height: '20px', width: '65%' },
      version: { height: '14px', width: '72px' },
      iteration: { height: '14px', width: '110px' },
      icon: { height: '24px', width: '24px', borderRadius: '4px' },
      progressBar: { height: '16px', width: '100%', borderRadius: '999px' },
      label: { height: '12px', width: '72px' },
      value: { height: '16px', width: '56px' },
    },
  },
});
