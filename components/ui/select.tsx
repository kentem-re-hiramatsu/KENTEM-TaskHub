'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';
import { css, cva } from 'styled-system/css';

interface SelectItem {
  id: string;
  text: string;
  onClick: () => void;
}

interface SelectProps {
  selectedId: string;
  items: SelectItem[];
  horizontalSize?: 'fit' | 'small' | 'medium' | 'large' | 'parentFull';
  verticalSize?: 'small' | 'smallGrid' | 'medium';
  scrollSize?: 'small' | 'medium' | 'large';
  isSearchable?: boolean;
  isOpenUp?: boolean;
}

type DropdownPos = { top?: number; bottom?: number; left: number; minWidth: number };

export const Select = ({
  selectedId,
  items,
  horizontalSize = 'fit',
  verticalSize = 'medium',
  scrollSize,
  isSearchable = false,
  isOpenUp = false,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [pos, setPos] = useState<DropdownPos>({ left: 0, minWidth: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = items.find((item) => item.id === selectedId);
  const filtered = isSearchable && search
    ? items.filter((item) => item.text.toLowerCase().includes(search.toLowerCase()))
    : items;

  const calcPos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    if (isOpenUp) {
      setPos({ bottom: window.innerHeight - rect.top + 4, left: rect.left, minWidth: rect.width });
    } else {
      setPos({ top: rect.bottom + 4, left: rect.left, minWidth: rect.width });
    }
  };

  const handleToggle = () => {
    if (!open) calcPos();
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapRef.current && !wrapRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setOpen(false);
        setSearch('');
      }
    };
    const handleScroll = () => {
      calcPos();
    };
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', calcPos);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', calcPos);
    };
  }, [open]);

  const handleSelect = (item: SelectItem) => {
    item.onClick();
    setOpen(false);
    setSearch('');
  };

  const triggerH = verticalSize === 'small' || verticalSize === 'smallGrid' ? '32px' : '40px';
  const maxH = scrollSize === 'small' ? '160px' : scrollSize === 'large' ? '320px' : '240px';
  const wClass = widthMap[horizontalSize] ?? '';

  return (
    <div ref={wrapRef} className={`${wrapStyle} ${wClass}`}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerStyle}
        style={{ height: triggerH }}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={triggerTextStyle}>{selected?.text ?? ''}</span>
        <ChevronDown
          size={14}
          className={css({
            flexShrink: '0',
            color: 'app.textSecondary',
            transition: 'transform 150ms ease',
          })}
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          className={dropdownStyle}
          style={{
            position: 'fixed',
            top: pos.top,
            bottom: pos.bottom,
            left: pos.left,
            minWidth: pos.minWidth,
            maxHeight: maxH,
          }}
          role="listbox"
        >
          {isSearchable && (
            <div className={searchWrapStyle}>
              <Search size={14} className={css({ color: 'app.textTertiary', flexShrink: '0' })} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索..."
                className={searchInputStyle}
                // biome-ignore lint: intentional autofocus for search
                autoFocus
              />
            </div>
          )}
          <div className={listStyle}>
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.id === selectedId}
                className={optionStyle({ selected: item.id === selectedId })}
                onClick={() => handleSelect(item)}
              >
                {item.text}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className={emptyStyle}>該当なし</div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};

const wrapStyle = css({ position: 'relative', display: 'inline-block' });

const widthMap: Record<string, string> = {
  fit: css({ minWidth: '80px' }),
  small: css({ minWidth: '100px' }),
  medium: css({ minWidth: '160px' }),
  large: css({ minWidth: '220px' }),
  parentFull: css({ width: '100%' }),
};

const triggerStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '6px',
  width: '100%',
  px: '10px',
  bg: 'app.bgElevated',
  border: '1.5px solid token(colors.app.border)',
  borderRadius: '8px',
  fontSize: '14px',
  color: 'app.text',
  cursor: 'pointer',
  transition: 'border-color 150ms ease',
  _hover: { borderColor: 'app.borderFocused' },
  _focusVisible: {
    outline: '2px solid token(colors.app.borderFocused)',
    outlineOffset: '2px',
  },
});

const triggerTextStyle = css({
  flex: '1',
  textAlign: 'left',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const dropdownStyle = css({
  zIndex: '9999',
  bg: 'app.bgElevated',
  border: '1.5px solid token(colors.app.border)',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
  overflow: 'hidden',
});

const searchWrapStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  px: '10px',
  py: '6px',
  borderBottom: '1px solid token(colors.app.separator)',
});

const searchInputStyle = css({
  flex: '1',
  border: 'none',
  outline: 'none',
  bg: 'transparent',
  fontSize: '13px',
  color: 'app.text',
  _placeholder: { color: 'app.textTertiary' },
});

const listStyle = css({ overflowY: 'auto', maxHeight: 'inherit', py: '4px' });

const optionStyle = cva({
  base: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    px: '12px',
    py: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 100ms ease',
    color: 'app.text',
    _hover: { bg: 'app.fill' },
  },
  variants: {
    selected: {
      true: { color: 'app.primary', fontWeight: '600', bg: 'app.primary.subtle' },
      false: {},
    },
  },
  defaultVariants: { selected: false },
});

const emptyStyle = css({
  px: '12px',
  py: '8px',
  fontSize: '13px',
  color: 'app.textTertiary',
});
