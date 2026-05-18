'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';

type IterationCalendarRow = {
  id: string;
  workingDays: number;
  startDate: string;
  endDate: string;
};

interface PermissionsPageClientProps {
  initialProjectName: string;
  initialMembers: unknown[];
}

export const PermissionsPageClient = (_props: PermissionsPageClientProps) => {
  const [iterationCalendar, setIterationCalendar] = useState<IterationCalendarRow[]>([
    { id: '1', workingDays: 10, startDate: '2026-05-18', endDate: '2026-05-29' },
    { id: '2', workingDays: 10, startDate: '2026-06-01', endDate: '2026-06-12' },
    { id: '3', workingDays: 10, startDate: '2026-06-15', endDate: '2026-06-26' },
    { id: '4', workingDays: 10, startDate: '2026-06-29', endDate: '2026-07-10' },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<IterationCalendarRow[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const parseIsoDate = (value: string): Date | null => {
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const toIsoDate = (value: Date | null): string => {
    if (!value) return '';
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  };

  const countWorkingDays = (startDate: string, endDate: string): number => {
    const start = parseIsoDate(startDate);
    const end = parseIsoDate(endDate);
    if (!start || !end || start > end) return 0;
    const current = new Date(start);
    let days = 0;
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) days += 1;
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const nextId = (rows: IterationCalendarRow[]) =>
    String(Math.max(0, ...rows.map((r) => Number(r.id))) + 1);

  const onEditClick = () => {
    const base = [...iterationCalendar];
    setEditingCalendar([...base, { id: nextId(base), workingDays: 0, startDate: '', endDate: '' }]);
    setIsEditing(true);
    setSuccessMessage('');
  };

  const onSave = () => {
    const saved = editingCalendar.filter((row) => row.startDate || row.endDate);
    setIterationCalendar(saved);
    setIsEditing(false);
    setSuccessMessage('保存しました');
  };

  const onRemoveRow = (rowId: string) => {
    setEditingCalendar((current) => {
      if (current[current.length - 1]?.id === rowId) {
        return current.map((row) => row.id === rowId ? { ...row, startDate: '', endDate: '', workingDays: 0 } : row);
      }
      return current.filter((row) => row.id !== rowId);
    });
  };

  const onLastRowFocus = (rowId: string) => {
    setEditingCalendar((current) => {
      if (current[current.length - 1]?.id !== rowId) return current;
      return [...current, { id: nextId(current), workingDays: 0, startDate: '', endDate: '' }];
    });
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  const updateIterationDate = (id: string, target: 'startDate' | 'endDate', value: Date | null) => {
    const nextValue = toIsoDate(value);
    setEditingCalendar((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        const nextRow = { ...row, [target]: nextValue };
        return { ...nextRow, workingDays: countWorkingDays(nextRow.startDate, nextRow.endDate) };
      }),
    );
  };

  const updateIterationWorkingDays = (id: string, value: string) => {
    const nextValue = Number(value);
    setEditingCalendar((current) =>
      current.map((row) =>
        row.id === id ? { ...row, workingDays: Number.isNaN(nextValue) ? 0 : nextValue } : row,
      ),
    );
  };

  const formatDate = (isoDate: string): string => {
    const d = parseIsoDate(isoDate);
    if (!d) return '';
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  const displayCalendar = isEditing ? editingCalendar : iterationCalendar;

  return (
    <VStack className={containerStyle} alignItems="stretch" gap="16px">
      <Heading level="h1" size="large" weight="bold" text="設定" />
      <VStack alignItems="stretch" gap="8px">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading level="h2" size="large" weight="bold" text="イテレーションカレンダー設定" />
          {isEditing ? (
            <HStack gap="8px">
              <Button type="button" variant="secondary" onClick={onCancel}>キャンセル</Button>
              <Button type="button" variant="primary" onClick={onSave}>保存</Button>
            </HStack>
          ) : (
            <Button type="button" variant="secondary" onClick={onEditClick}>編集</Button>
          )}
        </HStack>
        <div className={tableContainerStyle}>
          <div className={isEditing ? tableHeaderRowEditStyle : tableHeaderRowStyle}>
            <div>開始日</div>
            <div>終了日</div>
            <div>稼働日</div>
            {isEditing && <div />}
          </div>
          {displayCalendar.map((row) => (
            <div key={row.id} className={isEditing ? tableDataRowEditStyle : tableDataRowStyle} onFocus={isEditing ? () => onLastRowFocus(row.id) : undefined}>
              {isEditing ? (
                <>
                  <div className={dateInputWrapStyle}>
                    <DateInput id={`iteration-start-${row.id}`} value={parseIsoDate(row.startDate)} size="small" onChange={(v) => updateIterationDate(row.id, 'startDate', v)} />
                  </div>
                  <div className={dateInputWrapStyle}>
                    <DateInput id={`iteration-end-${row.id}`} value={parseIsoDate(row.endDate)} size="small" onChange={(v) => updateIterationDate(row.id, 'endDate', v)} />
                  </div>
                  <div className={workingDaysInputWrapStyle}>
                    <Input value={String(row.workingDays)} onChange={(v) => updateIterationWorkingDays(row.id, v)} heightSize="small" widthSize="parentFull" />
                  </div>
                  <button type="button" className={removeButtonStyle} onClick={() => onRemoveRow(row.id)} onFocus={(e) => e.stopPropagation()} aria-label="行を削除">×</button>
                </>
              ) : (
                <>
                  <div className={cellTextStyle}>{formatDate(row.startDate)}</div>
                  <div className={cellTextStyle}>{formatDate(row.endDate)}</div>
                  <div className={cellTextStyle}>{row.workingDays}日</div>
                </>
              )}
            </div>
          ))}
        </div>
      </VStack>
      {successMessage && <p className={successTextStyle}>{successMessage}</p>}
    </VStack>
  );
};

const containerStyle = css({ p: { base: '16px', md: '24px' } });

const tableContainerStyle = css({
  border: '1px solid token(colors.app.separator)',
  borderRadius: '12px',
  background: 'token(colors.ksTheme.background.white)',
  maxWidth: '560px',
});

const tableHeaderBase = {
  display: 'grid',
  gap: '8px',
  px: '16px',
  py: '8px',
  background: 'token(colors.ksTheme.background.canvas)',
  borderBottom: '1px solid token(colors.app.separator)',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  fontSize: '12px',
  fontWeight: '500',
  color: 'token(colors.app.textSecondary)',
  alignItems: 'center',
} as const;

const tableHeaderRowStyle = css({ ...tableHeaderBase, gridTemplateColumns: '1fr 1fr 120px' });
const tableHeaderRowEditStyle = css({ ...tableHeaderBase, gridTemplateColumns: '1fr 1fr 120px 32px' });

const tableDataRowBase = {
  display: 'grid',
  gap: '8px',
  px: '16px',
  py: '12px',
  minHeight: '52px',
  alignItems: 'center',
  borderTop: '1px solid token(colors.app.separator)',
  background: 'token(colors.ksTheme.background.white)',
  '&:last-child': {
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  },
} as const;

const tableDataRowStyle = css({ ...tableDataRowBase, gridTemplateColumns: '1fr 1fr 120px' });
const tableDataRowEditStyle = css({ ...tableDataRowBase, gridTemplateColumns: '1fr 1fr 120px 32px' });

const cellTextStyle = css({
  fontSize: '13px',
  color: 'token(colors.ksTheme.text.active)',
});

const dateInputWrapStyle = css({ width: '168px' });
const workingDaysInputWrapStyle = css({ width: '80px' });
const successTextStyle = css({ fontSize: '13px', color: 'app.success.DEFAULT' });

const removeButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  fontSize: '14px',
  color: 'token(colors.app.textSecondary)',
  cursor: 'pointer',
  _hover: { background: 'token(colors.ksTheme.background.canvas)', color: 'token(colors.ksTheme.text.active)' },
});
