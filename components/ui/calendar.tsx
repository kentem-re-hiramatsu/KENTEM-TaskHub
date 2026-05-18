'use client';

import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { css } from 'styled-system/css';

interface CalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const;

export const Calendar = ({ value, onChange }: CalendarProps) => {
  const [viewMonth, setViewMonth] = useState(() => value ?? new Date());

  const monthStart = startOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return (
    <div className={containerStyle}>
      <div className={headerStyle}>
        <button
          type="button"
          className={navBtnStyle}
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          aria-label="前の月"
        >
          <ChevronLeft size={18} />
        </button>
        <span className={monthLabelStyle}>
          {viewMonth.getFullYear()}年{viewMonth.getMonth() + 1}月
        </span>
        <button
          type="button"
          className={navBtnStyle}
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          aria-label="次の月"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={weekHeaderStyle}>
        {DAY_LABELS.map((label, i) => (
          <span
            key={label}
            className={`${weekLabelBase} ${i === 0 ? weekLabelSun : i === 6 ? weekLabelSat : weekLabelWeekday}`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className={gridStyle}>
        {days.map((day) => {
          const selected = value ? isSameDay(day, value) : false;
          const today = isToday(day);
          const inMonth = isSameMonth(day, viewMonth);
          const dow = day.getDay();

          let cls = dayBase;
          if (selected) {
            cls += ` ${daySelected}`;
          } else if (today) {
            cls += ` ${dayToday}`;
          } else if (!inMonth) {
            cls += ` ${dayOutside}`;
          } else if (dow === 0) {
            cls += ` ${daySun}`;
          } else if (dow === 6) {
            cls += ` ${daySat}`;
          } else {
            cls += ` ${dayDefault}`;
          }

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={cls}
              onClick={() => onChange(day)}
              tabIndex={inMonth ? 0 : -1}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const containerStyle = css({
  p: '12px',
  width: '280px',
  userSelect: 'none',
});

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: '8px',
  px: '4px',
});

const navBtnStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  color: 'app.primary',
  cursor: 'pointer',
  transition: 'background 120ms ease',
  _hover: { bg: 'app.primary.subtle' },
  _focusVisible: {
    outline: '2px solid token(colors.app.primary)',
    outlineOffset: '2px',
  },
});

const monthLabelStyle = css({
  fontSize: '15px',
  fontWeight: '600',
  color: 'app.text',
  letterSpacing: '0.01em',
});

const weekHeaderStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  mb: '2px',
});

const weekLabelBase = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '28px',
  fontSize: '11px',
  fontWeight: '600',
});

const weekLabelSun = css({ color: 'app.error.DEFAULT' });
const weekLabelSat = css({ color: 'app.info.DEFAULT' });
const weekLabelWeekday = css({ color: 'app.textSecondary' });

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '1px',
});

const dayBase = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background 120ms ease, color 120ms ease',
  mx: 'auto',
  fontVariantNumeric: 'tabular-nums',
});

const daySelected = css({
  bg: 'app.primary',
  color: 'white',
  fontWeight: '700',
  _hover: { bg: 'app.primary.pressed' },
});

const dayToday = css({
  color: 'app.primary',
  fontWeight: '700',
  boxShadow: '0 0 0 2px token(colors.app.primary) inset',
  _hover: { bg: 'app.primary.subtle' },
});

const dayOutside = css({
  color: 'app.textTertiary',
  _hover: { bg: 'app.fill' },
});

const daySun = css({
  color: 'app.error.DEFAULT',
  _hover: { bg: 'app.fill' },
});

const daySat = css({
  color: 'app.info.DEFAULT',
  _hover: { bg: 'app.fill' },
});

const dayDefault = css({
  color: 'app.text',
  _hover: { bg: 'app.fill' },
});
