'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { css } from 'styled-system/css';
import { Icon } from './icon';

interface MenuItemDef {
  text: string;
  leftIcon?: { category?: 'mask' | 'fill'; type: string; variant?: string };
  onClick?: () => void;
}

interface DropdownProps {
  button: {
    text: string;
    size?: 'small' | 'medium';
    leftIcon?: { category?: 'mask' | 'fill'; type: string };
  };
  menuList: { items: MenuItemDef[] };
  isRightAligned?: boolean;
  menuSize?: 'small' | 'medium';
  ariaLabel?: string;
}

export const Dropdown = ({
  button,
  menuList,
  isRightAligned = false,
  ariaLabel,
}: DropdownProps) => {
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
        type="button"
        className={triggerStyle}
        style={{ height: button.size === 'small' ? '30px' : '36px' }}
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {button.leftIcon && (
          <Icon type={button.leftIcon.type} size="small" variant="secondary" />
        )}
        <span className={triggerTextStyle}>{button.text}</span>
        <ChevronDown
          size={14}
          className={css({ color: 'app.textSecondary', transition: 'transform 150ms ease', flexShrink: '0' })}
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>

      {open && (
        <div
          className={css({
            position: 'absolute',
            top: '100%',
            zIndex: '200',
            marginTop: '4px',
            minWidth: '160px',
            bg: 'app.bgElevated',
            border: '1.5px solid token(colors.app.border)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            py: '4px',
          })}
          style={{ right: isRightAligned ? '0' : undefined, left: isRightAligned ? undefined : '0' }}
        >
          {menuList.items.map((item, i) => (
            <button
              key={`${item.text}-${i}`}
              type="button"
              className={menuItemStyle}
              onClick={() => { item.onClick?.(); setOpen(false); }}
            >
              {item.leftIcon && (
                <Icon type={item.leftIcon.type} size="small" variant="secondary" />
              )}
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const triggerStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  px: '10px',
  bg: 'app.fill',
  border: '1px solid token(colors.app.border)',
  borderRadius: '8px',
  fontSize: '14px',
  color: 'app.text',
  cursor: 'pointer',
  transition: 'background 150ms ease',
  _hover: { bg: 'app.fillSecondary' },
  _focusVisible: { outline: '2px solid token(colors.app.borderFocused)', outlineOffset: '2px' },
});

const triggerTextStyle = css({
  maxWidth: '120px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const menuItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  textAlign: 'left',
  px: '14px',
  py: '10px',
  fontSize: '14px',
  color: 'app.text',
  cursor: 'pointer',
  transition: 'background 100ms ease',
  _hover: { bg: 'app.fill' },
});
