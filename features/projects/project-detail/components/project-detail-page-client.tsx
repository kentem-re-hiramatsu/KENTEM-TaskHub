'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2, RefreshCw, Settings } from 'lucide-react';
import { css, cva } from 'styled-system/css';
import { Grid, HStack, VStack } from 'styled-system/jsx';
import { Card } from '@/components/card/card';
import { ProjectCard } from '@/components/project-card/project-card';
import { ProgressTrendChart } from '@/features/projects/project-detail/components/progress-trend-chart';
import { WorkingDaysEditor } from '@/features/projects/project-detail/components/working-days-editor';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import type { MemberProgressRow, ProjectProgressDetail, TaskStatus } from '@/mocks/data/project-progress-detail-data';

interface ProjectDetailPageClientProps {
  detail: ProjectProgressDetail;
  showBackLink?: boolean;
  showProjectName?: boolean;
}

type TabKey = 'summary' | 'tasks' | 'workingDays';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'summary', label: '概要' },
  { key: 'tasks', label: 'タスク' },
  { key: 'workingDays', label: '稼働日管理' },
];

const extractIterationNumber = (value: string) => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : Number.NaN;
};

const toIterationKey = (num: number) => `I-${num}`;
const toIterationLabel = (key: string, trend: ProjectProgressDetail['trend']) => {
  const num = extractIterationNumber(key);
  if (Number.isNaN(num)) return key;
  const point = trend.find((t) => t.iteration === key);
  if (point) return `IT#${num}（${point.startDate}〜${point.endDate}）`;
  return `イテレーション${num}`;
};

type AggregateMode = 'selected-only' | 'through-selected';
type TaskSortColumn = 'points' | 'status' | 'division' | 'assignee';
type SortDirection = 'asc' | 'desc';

export const ProjectDetailPageClient = ({ detail, showBackLink = true, showProjectName = true }: ProjectDetailPageClientProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const [isSyncing, setIsSyncing] = useState(false);

  const maxIterationNumber = useMemo(() => {
    const candidates = [
      ...detail.membersByIteration.map((b) => extractIterationNumber(b.iteration)),
      ...detail.trend.map((t) => extractIterationNumber(t.iteration)),
      extractIterationNumber(detail.currentIteration),
    ].filter((n) => !Number.isNaN(n));
    return candidates.length > 0 ? Math.max(...candidates) : 1;
  }, [detail.currentIteration, detail.membersByIteration, detail.trend]);

  const currentNumber = extractIterationNumber(detail.currentIteration);
  const iterations = useMemo(
    () => Array.from({ length: maxIterationNumber }, (_, i) => toIterationKey(i + 1)),
    [maxIterationNumber],
  );
  const selectableIterations = iterations.filter((it) => extractIterationNumber(it) <= currentNumber);
  const initialIteration = selectableIterations.includes(detail.currentIteration)
    ? detail.currentIteration
    : (selectableIterations[selectableIterations.length - 1] ?? detail.currentIteration);

  const [selectedIteration, setSelectedIteration] = useState(initialIteration);
  const [aggregateMode, setAggregateMode] = useState<AggregateMode>('selected-only');

  const [membersByIterationState, setMembersByIterationState] = useState(detail.membersByIteration);
  const [editingMembers, setEditingMembers] = useState<MemberProgressRow[]>([]);
  const [isEditingMembers, setIsEditingMembers] = useState(false);

  const handleIterationChange = (it: string) => {
    if (isEditingMembers) {
      setEditingMembers([]);
      setIsEditingMembers(false);
    }
    setSelectedIteration(it);
  };

  const [taskSearch, setTaskSearch] = useState('');
  const [taskFilterStatus, setTaskFilterStatus] = useState('');
  const [taskFilterDivision, setTaskFilterDivision] = useState('');
  const [taskFilterAssignee, setTaskFilterAssignee] = useState('');
  const [taskFilterAccounting, setTaskFilterAccounting] = useState<'' | 'included' | 'excluded'>('');
  const [taskSort, setTaskSort] = useState<{ column: TaskSortColumn | null; direction: SortDirection }>({ column: null, direction: 'asc' });
  const [excludedTaskIds, setExcludedTaskIds] = useState<Set<string>>(new Set());

  const handleStartEdit = () => {
    setEditingMembers(membersForIteration.map((m) => ({ ...m })));
    setIsEditingMembers(true);
  };

  const handleSaveEdit = () => {
    setMembersByIterationState((prev) =>
      prev.map((block) =>
        block.iteration === selectedIteration ? { ...block, members: editingMembers } : block,
      ),
    );
    setIsEditingMembers(false);
  };

  const handleCancelEdit = () => {
    setEditingMembers([]);
    setIsEditingMembers(false);
  };

  const handleEditMemberDivision = (id: string, division: MemberProgressRow['division']) => {
    setEditingMembers((prev) => prev.map((m) => (m.id === id ? { ...m, division } : m)));
  };

  const handleEditMemberTargetVelocity = (id: string, value: string) => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed < 0.01) return;
    const rounded = Math.round(parsed * 100) / 100;
    setEditingMembers((prev) => prev.map((m) => (m.id === id ? { ...m, targetVelocity: rounded } : m)));
  };

  const toggleTaskAccounting = (id: string) => {
    setExcludedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const uniqueStatuses = useMemo(() => [...new Set(detail.tasks.map((t) => t.status))].sort(), [detail.tasks]);
  const uniqueAssignees = useMemo(() => [...new Set(detail.tasks.map((t) => t.assignee))].sort(), [detail.tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = detail.tasks;
    if (taskSearch.trim()) {
      const q = taskSearch.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q));
    }
    if (taskFilterStatus) result = result.filter((t) => t.status === taskFilterStatus);
    if (taskFilterDivision) result = result.filter((t) => t.division === taskFilterDivision);
    if (taskFilterAssignee) result = result.filter((t) => t.assignee === taskFilterAssignee);
    if (taskFilterAccounting === 'included') result = result.filter((t) => !excludedTaskIds.has(t.id));
    if (taskFilterAccounting === 'excluded') result = result.filter((t) => excludedTaskIds.has(t.id));
    if (taskSort.column) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (taskSort.column === 'points') cmp = a.points - b.points;
        else if (taskSort.column === 'status') cmp = a.status.localeCompare(b.status);
        else if (taskSort.column === 'division') cmp = a.division.localeCompare(b.division);
        else if (taskSort.column === 'assignee') cmp = a.assignee.localeCompare(b.assignee, 'ja');
        return taskSort.direction === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [detail.tasks, taskSearch, taskFilterStatus, taskFilterDivision, taskFilterAssignee, taskFilterAccounting, excludedTaskIds, taskSort]);

  const handleTaskSort = (column: TaskSortColumn) => {
    setTaskSort((prev) => {
      if (prev.column !== column) return { column, direction: 'asc' };
      if (prev.direction === 'asc') return { column, direction: 'desc' };
      return { column: null, direction: 'asc' };
    });
  };

  const TaskSortIcon = ({ column }: { column: TaskSortColumn }) => {
    if (taskSort.column !== column) return <ArrowUpDown size={12} className={sortIconStyle} />;
    return taskSort.direction === 'asc'
      ? <ArrowUp size={12} className={sortIconActiveStyle} />
      : <ArrowDown size={12} className={sortIconActiveStyle} />;
  };

  const membersForIteration = useMemo(() => {
    const block = membersByIterationState.find((item) => item.iteration === selectedIteration);
    return block?.members ?? [];
  }, [membersByIterationState, selectedIteration]);

  const displayedProgressByDivision = useMemo(() => {
    const progressByIteration = detail.progressByDivisionByIteration ?? [];
    if (progressByIteration.length === 0) return detail.progressByDivision;
    const selectedNumber = extractIterationNumber(selectedIteration);
    const targetBlocks = aggregateMode === 'through-selected'
      ? progressByIteration.filter((b) => extractIterationNumber(b.iteration) <= selectedNumber)
      : progressByIteration.filter((b) => b.iteration === selectedIteration);
    if (targetBlocks.length === 0) return detail.progressByDivision;
    const totals = new Map<string, { division: string; plannedProgress: number; actualProgress: number }>();
    for (const block of targetBlocks) {
      for (const division of block.progressByDivision) {
        const current = totals.get(division.division) ?? { division: division.division, plannedProgress: 0, actualProgress: 0 };
        current.plannedProgress += division.plannedProgress;
        current.actualProgress += division.actualProgress;
        totals.set(division.division, current);
      }
    }
    return detail.progressByDivision.map((base) => {
      const total = totals.get(base.division);
      if (!total) return base;
      return {
        ...base,
        plannedProgress: aggregateMode === 'through-selected'
          ? Number((total.plannedProgress / targetBlocks.length).toFixed(1))
          : Number(total.plannedProgress.toFixed(1)),
        actualProgress: aggregateMode === 'through-selected'
          ? Number((total.actualProgress / targetBlocks.length).toFixed(1))
          : Number(total.actualProgress.toFixed(1)),
      };
    });
  }, [aggregateMode, detail.progressByDivision, detail.progressByDivisionByIteration, selectedIteration]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className={pageStyle}>
      <div className={stickyHeaderStyle}>
        <div className={headerInnerStyle}>
          <HStack justifyContent="space-between" alignItems="center">
            {showBackLink && <Link href="/projects" className={backLinkStyle}>← プロジェクト一覧</Link>}
            <HStack gap="8px">
              <Link href={`/projects/${detail.id}/settings`} className={settingsLinkStyle} aria-label="プロジェクト設定">
                <Settings size={14} />
                設定
              </Link>
              <Button type="button" variant="secondary" size="small" leftIcon={isSyncing ? Loader2 : RefreshCw} onClick={handleSync} disabled={isSyncing} aria-label="データを同期">
                {isSyncing ? '同期中…' : '同期'}
              </Button>
            </HStack>
          </HStack>
          {showProjectName && <Heading level="h1" size="large" weight="bold" text={detail.projectName} />}
          <HStack gap="8px" alignItems="center" flexWrap="wrap">
            <Typography text={`Ver ${detail.version}`} size="small" fontColor="inActive" />
            <span className={css({ color: 'app.textDisabled', fontSize: '13px' })}>·</span>
            <Typography text={`最終同期: ${detail.lastSyncedAt}`} size="small" fontColor="inActive" />
          </HStack>
          <Grid className={summaryGridStyle}>
            {displayedProgressByDivision.map((item) => (
              <ProjectCard
                key={item.division}
                projectName={item.division}
                version={detail.version}
                plannedProgress={item.plannedProgress}
                actualProgress={item.actualProgress}
                iterationCount={detail.membersByIteration.length}
                showDetailLink={false}
                showMeta={false}
              />
            ))}
          </Grid>
          <HStack gap="16px" alignItems="center" flexWrap="wrap">
            <HStack gap="8px" alignItems="center">
              <span className={selectorLabelStyle}>イテレーション</span>
              <Select
                horizontalSize="medium"
                verticalSize="smallGrid"
                selectedId={selectedIteration}
                scrollSize="medium"
                items={selectableIterations.map((it) => ({
                  id: it,
                  text: toIterationLabel(it, detail.trend),
                  onClick: () => handleIterationChange(it),
                }))}
              />
            </HStack>
            <HStack gap="8px" alignItems="center">
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
            </HStack>
          </HStack>
        </div>
        <div className={tabBarStyle} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={tabButtonStyle({ active: activeTab === tab.key })}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={tabContentStyle}>
        {activeTab === 'summary' && (
          <VStack alignItems="stretch" gap="16px">
            <Card
              header={
                <HStack justifyContent="space-between" alignItems="center" width="100%">
                  <Heading size="large" weight="bold" text="メンバー進捗" />
                  {isEditingMembers ? (
                    <HStack gap="8px">
                      <Button type="button" variant="primary" size="small" onClick={handleSaveEdit}>保存</Button>
                      <Button type="button" variant="secondary" size="small" onClick={handleCancelEdit}>キャンセル</Button>
                    </HStack>
                  ) : (
                    <Button type="button" variant="secondary" size="small" onClick={handleStartEdit}>編集</Button>
                  )}
                </HStack>
              }
            >
              {membersForIteration.length === 0 ? (
                <p className={emptyMessageStyle}>このイテレーションのメンバーデータがありません。</p>
              ) : (
                <div className={memberTableWrapStyle}>
                  <table className={tableStyle}>
                    <thead>
                      <tr>
                        <th className={css({ width: '100px' })}>名前</th>
                        <th className={css({ width: '120px' })}>区分</th>
                        <th className={css({ width: '80px' })}>稼働日</th>
                        <th className={css({ width: '130px' })}>目標ベロシティ</th>
                        <th className={css({ width: '110px' })}>目標ポイント</th>
                        <th className={css({ width: '120px' })}>実績ベロシティ</th>
                        <th>開発効率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isEditingMembers ? editingMembers : membersForIteration).map((member) => (
                        <tr key={member.id}>
                          <td className={css({ fontWeight: '500' })}>
                            <div className={cellInnerStyle}>{member.name}</div>
                          </td>
                          <td>
                            {isEditingMembers ? (
                              <Select
                                horizontalSize="small"
                                verticalSize="smallGrid"
                                selectedId={member.division}
                                items={(['FE', 'BE', 'テスト'] as const).map((d) => ({
                                  id: d,
                                  text: d,
                                  onClick: () => handleEditMemberDivision(member.id, d),
                                }))}
                              />
                            ) : (
                              <div className={cellInnerStyle}>
                                <span className={divisionBadgeStyle({ division: member.division })}>{member.division}</span>
                              </div>
                            )}
                          </td>
                          <td><div className={cellInnerStyle}>{member.workingDays}</div></td>
                          <td>
                            {isEditingMembers ? (
                              <Input
                                value={String(member.targetVelocity)}
                                onChange={(v) => handleEditMemberTargetVelocity(member.id, v)}
                                heightSize="small"
                                widthSize="small"
                                type="number"
                                min="0.01"
                                step="0.01"
                                className={noSpinnerStyle}
                              />
                            ) : (
                              <div className={cellInnerStyle}>{member.targetVelocity.toFixed(2)}</div>
                            )}
                          </td>
                          <td><div className={cellInnerStyle}>{member.targetPoints}pt</div></td>
                          <td><div className={cellInnerStyle}>{member.actualVelocity.toFixed(2)}</div></td>
                          <td className={member.developmentEfficiency > 1 ? css({ color: 'app.error.DEFAULT', fontWeight: '600' }) : undefined}>
                            <div className={cellInnerStyle}>{member.developmentEfficiency.toFixed(2)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
            <Card header={<Heading size="large" weight="bold" text="進捗推移グラフ" />}>
              <ProgressTrendChart trend={detail.trend} currentIteration={detail.currentIteration} />
            </Card>
          </VStack>
        )}
        {activeTab === 'tasks' && (
          <Card header={<Heading size="large" weight="bold" text="タスク一覧" />}>
            {detail.tasks.length === 0 ? (
              <p className={emptyMessageStyle}>タスクがありません。</p>
            ) : (
              <>
                <div className={taskFilterBarStyle}>
                  <Input
                    value={taskSearch}
                    onChange={setTaskSearch}
                    heightSize="small"
                    widthSize="large"
                    placeholder="タイトル・担当で検索"
                  />
                  <Select
                    horizontalSize="small"
                    verticalSize="smallGrid"
                    selectedId={taskFilterStatus}
                    items={[
                      { id: '', text: '状態: すべて', onClick: () => setTaskFilterStatus('') },
                      ...uniqueStatuses.map((s) => ({ id: s, text: s, onClick: () => setTaskFilterStatus(s) })),
                    ]}
                  />
                  <Select
                    horizontalSize="small"
                    verticalSize="smallGrid"
                    selectedId={taskFilterDivision}
                    items={[
                      { id: '', text: '区分: すべて', onClick: () => setTaskFilterDivision('') },
                      { id: 'FE', text: 'FE', onClick: () => setTaskFilterDivision('FE') },
                      { id: 'BE', text: 'BE', onClick: () => setTaskFilterDivision('BE') },
                      { id: 'テスト', text: 'テスト', onClick: () => setTaskFilterDivision('テスト') },
                      { id: 'unclassified', text: '未分類', onClick: () => setTaskFilterDivision('unclassified') },
                    ]}
                  />
                  <Select
                    horizontalSize="small"
                    verticalSize="smallGrid"
                    selectedId={taskFilterAssignee}
                    items={[
                      { id: '', text: '担当: すべて', onClick: () => setTaskFilterAssignee('') },
                      ...uniqueAssignees.map((a) => ({ id: a, text: a, onClick: () => setTaskFilterAssignee(a) })),
                    ]}
                  />
                  <Select
                    horizontalSize="small"
                    verticalSize="smallGrid"
                    selectedId={taskFilterAccounting}
                    items={[
                      { id: '', text: '計上: すべて', onClick: () => setTaskFilterAccounting('') },
                      { id: 'included', text: '計上', onClick: () => setTaskFilterAccounting('included') },
                      { id: 'excluded', text: '除外', onClick: () => setTaskFilterAccounting('excluded') },
                    ]}
                  />
                  {(taskSearch || taskFilterStatus || taskFilterDivision || taskFilterAssignee || taskFilterAccounting || taskSort.column) && (
                    <button
                      type="button"
                      className={clearFilterButtonStyle}
                      onClick={() => {
                        setTaskSearch('');
                        setTaskFilterStatus('');
                        setTaskFilterDivision('');
                        setTaskFilterAssignee('');
                        setTaskFilterAccounting('');
                        setTaskSort({ column: null, direction: 'asc' });
                      }}
                    >
                      クリア
                    </button>
                  )}
                  <span className={taskCountStyle}>{filteredAndSortedTasks.length} 件</span>
                </div>
                <div className={tableWrapStyle}>
                  <table className={tableStyle}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>タイトル</th>
                        <th>
                          <button type="button" className={sortThButtonStyle} onClick={() => handleTaskSort('status')}>
                            状態 <TaskSortIcon column="status" />
                          </button>
                        </th>
                        <th>
                          <button type="button" className={sortThButtonStyle} onClick={() => handleTaskSort('assignee')}>
                            担当 <TaskSortIcon column="assignee" />
                          </button>
                        </th>
                        <th>
                          <button type="button" className={sortThButtonStyle} onClick={() => handleTaskSort('division')}>
                            区分 <TaskSortIcon column="division" />
                          </button>
                        </th>
                        <th>
                          <button type="button" className={sortThButtonStyle} onClick={() => handleTaskSort('points')}>
                            Pt. <TaskSortIcon column="points" />
                          </button>
                        </th>
                        <th>計上</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedTasks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={css({ textAlign: 'center', color: 'app.textSecondary', py: '24px' })}>
                            条件に一致するタスクがありません。
                          </td>
                        </tr>
                      ) : filteredAndSortedTasks.map((task) => {
                        const isExcluded = excludedTaskIds.has(task.id);
                        return (
                          <tr key={task.id}>
                            <td className={css({ fontSize: '12px', color: 'app.textSecondary', fontFamily: 'monospace' })}>{task.id}</td>
                            <td className={css({ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' })}>{task.title}</td>
                            <td><span className={statusBadgeStyle({ status: task.status as TaskStatus })}>{task.status}</span></td>
                            <td>{task.assignee}</td>
                            <td>
                              {task.division !== 'unclassified' ? (
                                <span className={divisionBadgeStyle({ division: task.division as 'FE' | 'BE' | 'テスト' })}>{task.division}</span>
                              ) : <span className={css({ fontSize: '12px', color: 'app.textSecondary' })}>未分類</span>}
                            </td>
                            <td>{task.points}pt</td>
                            <td>
                              <button
                                type="button"
                                className={accountingBadgeStyle({ state: isExcluded ? 'excluded' : 'included' })}
                                onClick={() => toggleTaskAccounting(task.id)}
                                title={isExcluded ? 'クリックで計上に変更' : 'クリックで除外に変更'}
                              >
                                {isExcluded ? '除外' : '計上'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}
        {activeTab === 'workingDays' && (
          <Card header={<Heading size="large" weight="bold" text="稼働日管理" />}>
            <WorkingDaysEditor
              members={detail.members}
              membersByIteration={detail.membersByIteration}
              maxIterationNumber={maxIterationNumber}
              currentIteration={detail.currentIteration}
              trend={detail.trend}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

const pageStyle = css({ display: 'flex', flexDirection: 'column', minHeight: '100%', bg: 'app.bg' });
const stickyHeaderStyle = css({ position: 'sticky', top: '0', zIndex: '10', bg: 'app.bgElevated', borderBottom: '1px solid token(colors.app.separator)', boxShadow: '0 1px 0 rgba(0,0,0,0.06)' });
const headerInnerStyle = css({ px: { base: '16px', md: '24px' }, pt: '12px', pb: '0', display: 'flex', flexDirection: 'column', gap: '10px' });
const backLinkStyle = css({ fontSize: '14px', color: 'app.textLink', display: 'inline-flex', alignItems: 'center', gap: '4px', _hover: { opacity: '0.8' } });
const settingsLinkStyle = css({ fontSize: '13px', color: 'app.textSecondary', display: 'inline-flex', alignItems: 'center', gap: '4px', px: '8px', py: '4px', borderRadius: '6px', border: '1px solid token(colors.app.border)', bg: 'transparent', _hover: { bg: 'app.bgElevated2', color: 'app.text' } });
const summaryGridStyle = css({ display: 'grid', gap: '16px', my: '18px', gridTemplateColumns: { base: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } });
const selectorLabelStyle = css({ fontSize: '13px', color: 'app.textSecondary', whiteSpace: 'nowrap' });
const tabBarStyle = css({ display: 'flex', gap: '0', pt: '4px', width: '100%' });
const tabButtonStyle = cva({
  base: { flex: '1', fontSize: '14px', py: '8px', borderRadius: '0', borderBottom: '2px solid transparent', transition: 'all 150ms ease', bg: 'transparent' },
  variants: {
    active: {
      true: { fontWeight: '600', color: 'app.text', borderBottomColor: 'app.primary' },
      false: { fontWeight: '400', color: 'app.textSecondary' },
    },
  },
  defaultVariants: { active: false },
});
const tabContentStyle = css({ flex: '1', px: { base: '16px', md: '24px' }, py: '16px' });
const tableWrapStyle = css({ width: '100%', overflowX: 'auto' });
const memberTableWrapStyle = css({ width: '100%' });
const noSpinnerStyle = css({
  '&::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: '0' },
  '&::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: '0' },
  '&[type=number]': { appearance: 'textfield' },
});
const tableStyle = css({
  width: '100%',
  borderCollapse: 'collapse',
  '& th': { fontSize: '12px', fontWeight: '600', textAlign: 'left', color: 'app.textSecondary', borderBottom: '2px solid token(colors.app.border)', py: '8px', pr: '16px', whiteSpace: 'nowrap' },
  '& td': { fontSize: '14px', color: 'app.text', borderBottom: '1px solid token(colors.app.separator)', py: '11px', pr: '16px', whiteSpace: 'nowrap', verticalAlign: 'middle' },
  '& tr:last-child td': { borderBottom: 'none' },
});
const cellInnerStyle = css({ display: 'flex', alignItems: 'center', height: '32px' });
const divisionBadgeStyle = cva({
  base: { display: 'inline-block', fontSize: '11px', fontWeight: '600', px: '6px', py: '2px', borderRadius: '6px', letterSpacing: '0.03em' },
  variants: {
    division: {
      FE: { bg: '#dbeafe', color: '#1d4ed8' },
      BE: { bg: '#dcfce7', color: '#15803d' },
      テスト: { bg: '#fef9c3', color: '#854d0e' },
    },
  },
  defaultVariants: { division: 'FE' },
});
const statusBadgeStyle = cva({
  base: { display: 'inline-block', fontSize: '11px', fontWeight: '600', px: '7px', py: '2px', borderRadius: '999px' },
  variants: {
    status: {
      未対応: { bg: '#f3f4f6', color: '#6b7280' },
      実装中: { bg: '#dbeafe', color: '#1d4ed8' },
      PR中: { bg: '#fef9c3', color: '#854d0e' },
      完了: { bg: '#dcfce7', color: '#15803d' },
      破棄: { bg: '#fee2e2', color: '#991b1b' },
    },
  },
  defaultVariants: { status: '未対応' },
});
const emptyMessageStyle = css({ fontSize: '14px', color: 'app.textSecondary', py: '24px', textAlign: 'center' });
const taskFilterBarStyle = css({ display: 'flex', alignItems: 'center', gap: '8px', mb: '12px', flexWrap: 'wrap' });
const taskCountStyle = css({ fontSize: '12px', color: 'app.textSecondary', ml: 'auto', whiteSpace: 'nowrap' });
const clearFilterButtonStyle = css({ fontSize: '12px', color: 'app.textLink', bg: 'transparent', cursor: 'pointer', px: '6px', py: '2px', borderRadius: '4px', _hover: { bg: 'app.bgElevated2' } });
const sortThButtonStyle = css({ display: 'inline-flex', alignItems: 'center', gap: '4px', bg: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: 'app.textSecondary', _hover: { color: 'app.text' } });
const sortIconStyle = css({ color: 'app.textTertiary', flexShrink: '0' });
const sortIconActiveStyle = css({ color: 'app.primary', flexShrink: '0' });
const accountingBadgeStyle = cva({
  base: { display: 'inline-block', fontSize: '11px', fontWeight: '600', px: '8px', py: '2px', borderRadius: '999px', cursor: 'pointer', transition: 'opacity 120ms ease', _hover: { opacity: '0.75' } },
  variants: {
    state: {
      included: { bg: '#dcfce7', color: '#15803d' },
      excluded: { bg: '#f3f4f6', color: '#9ca3af' },
    },
  },
  defaultVariants: { state: 'included' },
});
