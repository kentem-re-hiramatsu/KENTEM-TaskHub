'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { css, cva } from 'styled-system/css';
import { ProjectDetailPageClient } from '@/features/projects/project-detail/components/project-detail-page-client';
import { Loader2 } from 'lucide-react';
import type { ProjectCardMockItem } from '@/mocks/data/project-progress-cards-data';
import type { ProjectProgressDetail } from '@/mocks/data/project-progress-detail-data';

interface MyProjectsPageProps {
  projects: ProjectCardMockItem[];
}

const fetchProjectDetail = async (projectId: string): Promise<ProjectProgressDetail | null> => {
  const res = await fetch(`/api/project-progress/projects/${projectId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.value ?? null;
};

export const MyProjectsPage = ({ projects }: MyProjectsPageProps) => {
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id ?? '');

  const { data: detail, isLoading } = useQuery({
    queryKey: ['my-project-detail', selectedId],
    queryFn: () => fetchProjectDetail(selectedId),
    enabled: !!selectedId,
  });

  return (
    <div className={layoutStyle}>
      <aside className={panelStyle}>
        <div className={panelHeaderStyle}>担当プロジェクト</div>
        <ul className={listStyle}>
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                className={itemStyle({ selected: project.id === selectedId })}
                onClick={() => setSelectedId(project.id)}
              >
                <span className={itemNameStyle}>{project.projectName}</span>
                <span className={itemMetaStyle}>{project.actualProgress}%</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className={mainStyle}>
        {isLoading ? (
          <div className={loadingStyle}>
            <Loader2 size={24} className={spinnerStyle} />
            <span>読み込み中...</span>
          </div>
        ) : !detail ? (
          <div className={emptyStyle}>
            プロジェクトを選択してください
          </div>
        ) : (
          <ProjectDetailPageClient detail={detail} showBackLink={false} />
        )}
      </div>
    </div>
  );
};

const PANEL_WIDTH = '220px';

const layoutStyle = css({
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
});

const panelStyle = css({
  width: PANEL_WIDTH,
  flexShrink: '0',
  borderRight: '1px solid token(colors.app.separator)',
  bg: 'app.bgElevated',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const panelHeaderStyle = css({
  px: '16px',
  py: '14px',
  fontSize: '12px',
  fontWeight: '600',
  color: 'app.textSecondary',
  letterSpacing: '0.04em',
  borderBottom: '1px solid token(colors.app.separator)',
  flexShrink: '0',
});

const listStyle = css({
  listStyle: 'none',
  m: '0',
  p: '4px',
  flex: '1',
});

const itemStyle = cva({
  base: {
    w: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    px: '12px',
    py: '10px',
    borderRadius: '8px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 120ms ease',
    _hover: { bg: 'app.fill' },
  },
  variants: {
    selected: {
      true: { bg: 'app.primary.subtle', _hover: { bg: 'app.primary.subtle' } },
      false: { bg: 'transparent' },
    },
  },
  defaultVariants: { selected: false },
});

const itemNameStyle = css({
  fontSize: '13px',
  fontWeight: '500',
  color: 'app.text',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: '1',
  minWidth: '0',
});

const itemMetaStyle = css({
  fontSize: '12px',
  color: 'app.textSecondary',
  flexShrink: '0',
});

const mainStyle = css({
  flex: '1',
  minWidth: '0',
  overflowY: 'auto',
  position: 'relative',
});

const loadingStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  height: '100%',
  color: 'app.textSecondary',
  fontSize: '14px',
});

const spinnerStyle = css({
  animation: 'spin 1s linear infinite',
});

const emptyStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: 'app.textSecondary',
  fontSize: '14px',
});
