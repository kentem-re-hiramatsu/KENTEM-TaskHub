'use client';

import { useMemo, useState } from 'react';
import { css } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { Button } from '@/components/ui/button';
import { NumericInput } from '@/components/ui/numeric-input';
import { Select } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import type {
  MemberProgressRow,
  ProjectProgressDetail,
  TrendPoint,
} from '@/mocks/data/project-progress-detail-data';

const DEFAULT_WORKING_DAYS = 10;

interface WorkingDaysEditorProps {
  members: MemberProgressRow[];
  membersByIteration: ProjectProgressDetail['membersByIteration'];
  maxIterationNumber?: number;
  currentIteration?: string;
  trend?: TrendPoint[];
}

type RowState = { days: number; memo: string };
type WorkingDaysState = Record<string, Record<string, RowState>>;

const toIterationKey = (num: number) => `I-${num}`;
const extractNumber = (key: string) => {
  const m = key.match(/\d+/);
  return m ? Number(m[0]) : 0;
};

const buildInitialState = (
  membersByIteration: ProjectProgressDetail['membersByIteration'],
): WorkingDaysState => {
  return membersByIteration.reduce<WorkingDaysState>((acc, block) => {
    for (const member of block.members) {
      acc[member.id] = {
        ...(acc[member.id] ?? {}),
        [block.iteration]: { days: member.workingDays, memo: member.workingDaysMemo ?? '' },
      };
    }
    return acc;
  }, {});
};

export const WorkingDaysEditor = ({
  members,
  membersByIteration,
  maxIterationNumber,
  currentIteration,
  trend = [],
}: WorkingDaysEditorProps) => {
  const iterations = useMemo(() => {
    if (maxIterationNumber && maxIterationNumber > 0) {
      return Array.from({ length: maxIterationNumber }, (_, i) => toIterationKey(i + 1));
    }
    return membersByIteration.map((b) => b.iteration);
  }, [maxIterationNumber, membersByIteration]);

  const currentNumber = currentIteration ? extractNumber(currentIteration) : Number.POSITIVE_INFINITY;
  const selectableIterations = iterations.filter((it) => extractNumber(it) <= currentNumber);

  const [selectedIteration, setSelectedIteration] = useState<string>(
    selectableIterations[selectableIterations.length - 1] ?? iterations[0] ?? '',
  );
  const [savedState, setSavedState] = useState<WorkingDaysState>(buildInitialState(membersByIteration));
  const [editState, setEditState] = useState<WorkingDaysState>({});
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = () => {
    setEditState(JSON.parse(JSON.stringify(savedState)));
    setIsEditing(true);
  };
  const saveEdit = () => {
    setSavedState(editState);
    setIsEditing(false);
  };
  const cancelEdit = () => {
    setEditState({});
    setIsEditing(false);
  };

  const state = isEditing ? editState : savedState;
  const setState = isEditing
    ? setEditState
    : setSavedState;

  const dateRangeLabel = useMemo(() => {
    const point = trend.find((t) => t.iteration === selectedIteration);
    if (!point) return null;
    return `${point.startDate} 〜 ${point.endDate}`;
  }, [trend, selectedIteration]);

  const iterationNum = extractNumber(selectedIteration);

  const updateDays = (memberId: string, valueText: string) => {
    const next = Number(valueText || '0');
    if (Number.isNaN(next) || !selectedIteration) return;
    const iter = selectedIteration;
    setState((prev) => ({
      ...prev,
      [memberId]: {
        ...(prev[memberId] ?? {}),
        [iter]: { ...(prev[memberId]?.[iter] ?? { days: DEFAULT_WORKING_DAYS, memo: '' }), days: next },
      },
    }));
  };

  const updateMemo = (memberId: string, value: string) => {
    if (!selectedIteration) return;
    const iter = selectedIteration;
    setState((prev) => ({
      ...prev,
      [memberId]: {
        ...(prev[memberId] ?? {}),
        [iter]: { ...(prev[memberId]?.[iter] ?? { days: DEFAULT_WORKING_DAYS, memo: '' }), memo: value },
      },
    }));
  };

  return (
    <VStack alignItems="stretch" gap="12px">
      <HStack gap="12px" alignItems="center" flexWrap="wrap" justifyContent="space-between">
        <HStack gap="12px" alignItems="center" flexWrap="wrap">
          <Select
            horizontalSize="small"
            verticalSize="smallGrid"
            selectedId={selectedIteration}
            items={selectableIterations.map((it) => ({
              id: it,
              text: `イテレーション${extractNumber(it)}`,
              onClick: () => setSelectedIteration(it),
            }))}
          />
          <Typography text={`デフォルト稼働日: ${DEFAULT_WORKING_DAYS}日`} size="small" fontColor="inActive" />
        </HStack>
        {isEditing ? (
          <HStack gap="8px">
            <Button variant="ghost" size="small" onClick={cancelEdit}>キャンセル</Button>
            <Button variant="primary" size="small" onClick={saveEdit}>保存</Button>
          </HStack>
        ) : (
          <Button variant="secondary" size="small" onClick={startEdit}>編集</Button>
        )}
      </HStack>

      {dateRangeLabel && (
        <Typography text={`イテレーション #${iterationNum}（${dateRangeLabel}）`} size="small" fontColor="inActive" />
      )}

      <div className={tableWrapStyle}>
        <table className={tableStyle}>
          <thead>
            <tr>
              <th>名前</th>
              <th>区分</th>
              <th>稼働日数</th>
              <th>変更メモ</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const iterKey: string = selectedIteration;
              const row = state[member.id]?.[iterKey];
              const days = row?.days ?? DEFAULT_WORKING_DAYS;
              const memo = row?.memo ?? '';
              const isModified = days !== DEFAULT_WORKING_DAYS;
              return (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.division}</td>
                  <td className={isModified ? modifiedCellStyle : undefined}>
                    {isEditing ? (
                      <NumericInput
                        widthSize="small"
                        heightSize="small"
                        useMinus={false}
                        useFloat={false}
                        value={String(days)}
                        onChange={(v) => updateDays(member.id, v)}
                        ariaLabel={`${member.name} イテレーション${iterationNum} の稼働日`}
                      />
                    ) : (
                      <span className={daysTextStyle}>{days}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={memo}
                        onChange={(e) => updateMemo(member.id, e.target.value)}
                        placeholder="変更理由（任意）"
                        className={memoInputStyle}
                        aria-label={`${member.name} 変更メモ`}
                      />
                    ) : (
                      <span className={memoTextStyle}>{memo || <span className={memoPlaceholderStyle}>—</span>}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </VStack>
  );
};

const tableWrapStyle = css({ width: '100%', overflowX: 'auto' });

const tableStyle = css({
  width: '100%',
  borderCollapse: 'collapse',
  '& th': {
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'left',
    color: 'app.textSecondary',
    borderBottom: '1px solid token(colors.app.border)',
    py: '8px',
    pr: '12px',
    whiteSpace: 'nowrap',
  },
  '& th:nth-child(1)': { width: '160px' },
  '& th:nth-child(2)': { width: '120px' },
  '& th:nth-child(3)': { width: '120px' },
  '& th:nth-child(4)': { minWidth: '300px' },
  '& td': {
    fontSize: '14px',
    color: 'app.text',
    borderBottom: '1px solid token(colors.app.separator)',
    height: '52px',
    pr: '12px',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  },
});

const modifiedCellStyle = css({ color: 'app.error.DEFAULT' });

const memoInputStyle = css({
  fontSize: '13px',
  color: 'app.text',
  border: '1.5px solid token(colors.app.border)',
  borderRadius: '8px',
  bg: 'app.bgElevated',
  px: '8px',
  height: '32px',
  width: '280px',
  outline: 'none',
  _focus: { borderColor: 'app.borderFocused', boxShadow: '0 0 0 3px token(colors.app.info.subtle)' },
  _placeholder: { color: 'app.textTertiary' },
});

const daysTextStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  height: '32px',
  fontSize: '14px',
  color: 'app.text',
});

const memoTextStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  height: '32px',
  fontSize: '13px',
  color: 'app.text',
});

const memoPlaceholderStyle = css({ color: 'app.textTertiary' });
