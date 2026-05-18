'use client';

import { useMemo, useState } from 'react';
import { css } from 'styled-system/css';
import { VStack } from 'styled-system/jsx';
import { Card } from '@/components/card/card';
import { Heading } from '@/components/ui/heading';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import type { MemberProjectHistory } from '@/mocks/data/member-detail-data';

type AggregateMode = 'selected-only' | 'through-selected';

const extractIterationNumber = (value: string) => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : Number.NaN;
};

interface Props {
  projectHistory: MemberProjectHistory[];
}

export const ProjectHistoryCard = ({ projectHistory }: Props) => {
  const projectNames = useMemo(
    () => [...new Set(projectHistory.map((p) => p.projectName))],
    [projectHistory],
  );

  const [selectedProjectName, setSelectedProjectName] = useState(projectNames[0] ?? '');

  const versionsForProject = useMemo(
    () => projectHistory.filter((p) => p.projectName === selectedProjectName).map((p) => p.version),
    [projectHistory, selectedProjectName],
  );

  const [selectedVersion, setSelectedVersion] = useState(versionsForProject[0] ?? '');

  const selectedProject = useMemo(
    () => projectHistory.find((p) => p.projectName === selectedProjectName && p.version === selectedVersion),
    [projectHistory, selectedProjectName, selectedVersion],
  );

  const iterations = useMemo(() => selectedProject?.iterations ?? [], [selectedProject]);

  const [selectedIteration, setSelectedIteration] = useState(
    iterations[iterations.length - 1]?.iteration ?? '',
  );
  const [aggregateMode, setAggregateMode] = useState<AggregateMode>('selected-only');

  const handleProjectNameChange = (name: string) => {
    setSelectedProjectName(name);
    const versions = projectHistory.filter((p) => p.projectName === name).map((p) => p.version);
    const firstVersion = versions[0] ?? '';
    setSelectedVersion(firstVersion);
    const newIterations = projectHistory.find(
      (p) => p.projectName === name && p.version === firstVersion,
    )?.iterations ?? [];
    setSelectedIteration(newIterations[newIterations.length - 1]?.iteration ?? '');
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    const newIterations = projectHistory.find(
      (p) => p.projectName === selectedProjectName && p.version === version,
    )?.iterations ?? [];
    setSelectedIteration(newIterations[newIterations.length - 1]?.iteration ?? '');
  };

  const displayedData = useMemo(() => {
    if (!selectedProject || iterations.length === 0) return null;
    const selectedNumber = extractIterationNumber(selectedIteration);
    const targets =
      aggregateMode === 'through-selected'
        ? iterations.filter((it) => extractIterationNumber(it.iteration) <= selectedNumber)
        : iterations.filter((it) => it.iteration === selectedIteration);
    if (targets.length === 0) return null;
    const count = targets.length;
    return {
      developmentEfficiency: Number((targets.reduce((s, it) => s + it.developmentEfficiency, 0) / count).toFixed(2)),
      actualVelocity: Number((targets.reduce((s, it) => s + it.actualVelocity, 0) / count).toFixed(2)),
      targetVelocity: Number((targets.reduce((s, it) => s + it.targetVelocity, 0) / count).toFixed(2)),
    };
  }, [aggregateMode, iterations, selectedIteration, selectedProject]);

  const toIterationLabel = (iteration: string) => {
    const it = iterations.find((i) => i.iteration === iteration);
    const num = extractIterationNumber(iteration);
    if (it) return `IT#${num}（${it.startDate}〜${it.endDate}）`;
    return iteration;
  };

  return (
    <Card header={<Heading level="h2" size="large" weight="bold" text="参加プロジェクト実績" />}>
      {projectHistory.length === 0 ? (
        <p className={emptyMessageStyle}>参加プロジェクトのデータがありません。</p>
      ) : (
        <VStack alignItems="stretch" gap="12px">
          <div className={selectorGridStyle}>
            <span className={selectorLabelStyle}>PJ</span>
            <Select
              horizontalSize="large"
              verticalSize="smallGrid"
              selectedId={selectedProjectName}
              items={projectNames.map((name) => ({
                id: name,
                text: name,
                onClick: () => handleProjectNameChange(name),
              }))}
            />
            <span className={selectorLabelStyle}>バージョン</span>
            <Select
              horizontalSize="small"
              verticalSize="smallGrid"
              selectedId={selectedVersion}
              items={versionsForProject.map((v) => ({
                id: v,
                text: v,
                onClick: () => handleVersionChange(v),
              }))}
            />
            {selectedProject && iterations.length > 0 && (
              <>
                <span className={selectorLabelStyle}>イテレーション</span>
                <Select
                  horizontalSize="medium"
                  verticalSize="smallGrid"
                  selectedId={selectedIteration}
                  scrollSize="medium"
                  items={iterations.map((it) => ({
                    id: it.iteration,
                    text: toIterationLabel(it.iteration),
                    onClick: () => setSelectedIteration(it.iteration),
                  }))}
                />
                <span className={selectorLabelStyle}>集計範囲</span>
                <Select
                  horizontalSize="small"
                  verticalSize="smallGrid"
                  selectedId={aggregateMode}
                  items={[
                    { id: 'selected-only', text: '選択のみ', onClick: () => setAggregateMode('selected-only') },
                    { id: 'through-selected', text: '選択まで累計', onClick: () => setAggregateMode('through-selected') },
                  ]}
                />
              </>
            )}
          </div>

          {displayedData ? (
            <Table
              headers={['区分', '目標ベロシティ', '実績ベロシティ', '開発効率']}
              gridTemplateColumns="1fr 1fr 1fr 1fr"
            >
              <Table.Row>
                <div className={cellStyle}>{selectedProject?.division ?? '-'}</div>
                <div className={cellStyle}>{displayedData.targetVelocity.toFixed(2)}</div>
                <div className={cellStyle}>{displayedData.actualVelocity.toFixed(2)}</div>
                <div className={cellStyle}>
                  <span className={efficiencyValueStyle(displayedData.developmentEfficiency)}>
                    {displayedData.developmentEfficiency.toFixed(2)}
                  </span>
                </div>
              </Table.Row>
            </Table>
          ) : (
            <p className={emptyMessageStyle}>選択したイテレーションのデータがありません。</p>
          )}
        </VStack>
      )}
    </Card>
  );
};

const selectorGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'max-content auto max-content auto',
  columnGap: '8px',
  rowGap: '8px',
  alignItems: 'center',
});

const selectorLabelStyle = css({
  fontSize: '13px',
  color: 'app.textSecondary',
  fontWeight: '500',
  whiteSpace: 'nowrap',
});

const cellStyle = css({
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  fontSize: '14px',
  fontWeight: '500',
});

const efficiencyValueStyle = (value: number) =>
  css({
    color: value >= 1.0 ? 'app.success' : 'app.textSecondary',
    fontWeight: '600',
  });

const emptyMessageStyle = css({ fontSize: '14px', color: 'app.textSecondary', py: '8px' });
