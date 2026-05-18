'use client';

import { useMemo, useState } from 'react';
import { Edit, Search } from 'lucide-react';
import { css } from 'styled-system/css';
import { Box, Grid, VStack } from 'styled-system/jsx';
import { ProjectCard, ProjectCardSkeleton } from '@/components/project-card/project-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Heading } from '@/components/ui/heading';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import type { ProjectCardMockItem } from '@/mocks/data/project-progress-cards-data';

interface ProjectsPageClientProps {
  projects: ProjectCardMockItem[];
}

export const ProjectsPageClient = ({ projects }: ProjectsPageClientProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [hiddenProjectIds, setHiddenProjectIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleProjects = useMemo(
    () => projects.filter((project) => !hiddenProjectIds.includes(project.id)),
    [projects, hiddenProjectIds],
  );

  const hiddenProjects = useMemo(
    () => projects.filter((project) => hiddenProjectIds.includes(project.id)),
    [projects, hiddenProjectIds],
  );

  const filteredHiddenProjects = useMemo(
    () => hiddenProjects.filter((p) => p.projectName.includes(searchQuery)),
    [hiddenProjects, searchQuery],
  );

  const hideProject = (projectId: string) => {
    setHiddenProjectIds((current) =>
      current.includes(projectId) ? current : [...current, projectId],
    );
  };

  const toggleHidden = (projectId: string) => {
    setHiddenProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId],
    );
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      if (prev) setSearchQuery('');
      return !prev;
    });
  };

  return (
    <div className={pushLayoutStyle}>
      <div className={mainContentStyle}>
        <div className={headerBarStyle}>
          <Heading level="h1" size="large" weight="bold" text="プロジェクトカード（Mock）" />
          <Button type="button" variant="secondary" leftIcon={Edit} onClick={toggleEditMode}>
            {isEditMode ? '編集完了' : '編集'}
          </Button>
        </div>

        <Grid className={gridStyle}>
          {visibleProjects.map((project, index) => (
            <div key={project.id} className={cardSlotStyle}>
              <div
                className={isEditMode ? `${cardWrapStyle} ${wiggleStyle}` : cardWrapStyle}
                style={isEditMode ? { animationDelay: `${(index % 5) * 0.07}s` } : undefined}
              >
                {isEditMode ? (
                  <Box position="absolute" top="8px" right="8px" zIndex="2">
                    <IconButton
                      mainIcon={{ category: 'mask', type: 'close' }}
                      variant="tertiaryNoFrame"
                      size="xSmall"
                      ariaLabel={`${project.projectName}を非表示にする`}
                      onClick={() => hideProject(project.id)}
                    />
                  </Box>
                ) : null}
                <ProjectCard {...project} showDetailLink={!isEditMode} />
              </div>
            </div>
          ))}
          {projects.length === 0
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={`empty-${index}`} className={cardSlotStyle}>
                  <ProjectCardSkeleton />
                </div>
              ))
            : null}
        </Grid>
      </div>

      <aside
        className={drawerPanelStyle}
        style={{ width: isEditMode ? DRAWER_WIDTH : '0' }}
      >
        <div className={drawerInnerStyle}>
          <div className={drawerBodyStyle}>
            <div className={searchWrapStyle}>
              <Search size={15} className={searchIconStyle} />
              <Input
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="プロジェクトを検索..."
                widthSize="parentFull"
                heightSize="small"
                style={{ paddingLeft: '34px' }}
              />
            </div>

            {hiddenProjects.length === 0 ? (
              <Typography text="現在、非表示のプロジェクトはありません。" size="medium" fontColor="inActive" />
            ) : filteredHiddenProjects.length === 0 ? (
              <Typography text={`「${searchQuery}」に一致するプロジェクトはありません。`} size="medium" fontColor="inActive" />
            ) : (
              <VStack alignItems="stretch" gap="4px">
                {filteredHiddenProjects.map((project) => (
                  <div key={`hidden-${project.id}`} className={checkboxRowStyle}>
                    <Checkbox
                      checked={!hiddenProjectIds.includes(project.id)}
                      label={project.projectName}
                      onChange={() => toggleHidden(project.id)}
                    />
                  </div>
                ))}
              </VStack>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

const wiggleStyle = css({ animation: 'wiggle 0.5s ease-in-out infinite', transformOrigin: 'center center' });

const pushLayoutStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
});

const mainContentStyle = css({
  flex: '1',
  minWidth: '0',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  p: { base: '16px', md: '24px' },
});

const headerBarStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  flexWrap: 'wrap',
});

const gridStyle = css({
  width: '100%',
  display: 'grid',
  gap: '16px',
  justifyContent: 'center',
  gridTemplateColumns: { base: '1fr', sm: 'repeat(auto-fit, minmax(360px, 360px))' },
});

const cardSlotStyle = css({ width: '100%', maxWidth: '360px' });
const cardWrapStyle = css({ position: 'relative' });

const DRAWER_WIDTH = '300px';

const drawerPanelStyle = css({
  overflowX: 'hidden',
  flexShrink: '0',
  transition: 'width 280ms cubic-bezier(0.32, 0.72, 0, 1)',
  position: 'sticky',
  top: '0',
  height: '100svh',
});

const drawerInnerStyle = css({
  width: DRAWER_WIDTH,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderLeft: '1px solid token(colors.app.separator)',
  bg: 'app.bgElevated',
});

const drawerHeaderStyle = css({
  px: '16px',
  pb: '12px',
  pt: '20px',
  borderBottom: '1px solid token(colors.app.separator)',
  flexShrink: '0',
});

const drawerTitleStyle = css({
  fontSize: '14px',
  fontWeight: '600',
  color: 'app.text',
  whiteSpace: 'nowrap',
});

const drawerBodyStyle = css({
  px: '16px',
  py: '12px',
  overflowY: 'auto',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const searchWrapStyle = css({ position: 'relative' });

const searchIconStyle = css({
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'app.textTertiary',
  pointerEvents: 'none',
  zIndex: '1',
});

const checkboxRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  px: '8px',
  py: '10px',
  borderRadius: '8px',
  transition: 'background 150ms ease',
  _hover: { bg: 'app.fill' },
});
