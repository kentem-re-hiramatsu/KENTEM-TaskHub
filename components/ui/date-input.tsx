'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { css } from 'styled-system/css';
import type { ComponentProps } from 'react';
import { Calendar } from './calendar';

interface DateInputProps extends Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'size'> {
  id?: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  size?: 'small' | 'medium';
  useDialog?: boolean;
}

const formatDisplay = (date: Date | null): string => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
};

export const DateInput = ({
  id,
  value,
  onChange,
  size = 'medium',
  disabled,
  className,
}: DateInputProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={css({ position: 'relative', display: 'inline-block' })}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        className={`${triggerStyle} ${sizeMap[size]} ${className ?? ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span
          className={css({
            flex: 1,
            textAlign: 'left',
            color: value ? 'app.text' : 'app.textTertiary',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {formatDisplay(value) || '日付を選択'}
        </span>
        <CalendarDays
          size={15}
          className={css({ color: 'app.textSecondary', flexShrink: '0' })}
        />
      </button>

      {open && (
        <div className={popoverStyle}>
          <Calendar
            value={value}
            onChange={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

const triggerStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  px: '10px',
  border: '1.5px solid token(colors.app.border)',
  borderRadius: '8px',
  bg: 'app.bgElevated',
  color: 'app.text',
  fontFamily: 'inherit',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  outline: 'none',
  width: '100%',
  _focusVisible: {
    borderColor: 'app.borderFocused',
    boxShadow: '0 0 0 3px token(colors.app.info.subtle)',
  },
  _disabled: {
    bg: 'app.bgElevated2',
    color: 'app.textDisabled',
    cursor: 'not-allowed',
  },
});

const sizeMap: Record<string, string> = {
  small: css({ height: '32px' }),
  medium: css({ height: '40px' }),
};

const popoverStyle = css({
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: '0',
  zIndex: '200',
  bg: 'app.bgElevated',
  border: '1.5px solid token(colors.app.border)',
  borderRadius: '16px',
  boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
  overflow: 'hidden',
  animation: 'fadeIn 150ms ease',
});

