'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { css } from 'styled-system/css';

interface DropzoneProps {
  onDrop: (files: { status: 'accept'; data: File }[]) => void;
  acceptTypes?: string[];
  multiple?: boolean;
  size?: 'full' | 'fit';
  direction?: 'row' | 'column';
}

export const Dropzone = ({
  onDrop,
  acceptTypes = [],
  multiple = false,
  size = 'full',
}: DropzoneProps) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = acceptTypes.length
    ? acceptTypes.map((t) => (t.startsWith('.') ? t : `.${t}`)).join(',')
    : undefined;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const result = Array.from(files).map((f) => ({ status: 'accept' as const, data: f }));
    onDrop(result);
  };

  return (
    <div
      className={zoneStyle({ dragging, size })}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      aria-label="ファイルをドロップまたはクリックして選択"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className={css({ display: 'none' })}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Upload size={24} className={css({ color: 'app.primary' })} />
      <p className={textStyle}>
        ドロップ、または<span className={css({ color: 'app.textLink' })}>クリックして選択</span>
      </p>
      {acceptTypes.length > 0 && (
        <p className={hintStyle}>{acceptTypes.join(', ')} ファイル対応</p>
      )}
    </div>
  );
};

import { cva } from 'styled-system/css';

const zoneStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    p: '24px',
    border: '2px dashed token(colors.app.border)',
    borderRadius: '12px',
    bg: 'app.bgElevated',
    cursor: 'pointer',
    transition: 'border-color 150ms ease, background 150ms ease',
    _hover: { borderColor: 'app.borderFocused', bg: 'app.primary.subtle' },
    _focusVisible: { outline: '2px solid token(colors.app.borderFocused)', outlineOffset: '2px' },
  },
  variants: {
    dragging: {
      true: { borderColor: 'app.primary', bg: 'app.primary.subtle' },
      false: {},
    },
    size: {
      full: { width: '100%' },
      fit: { width: 'fit-content' },
    },
  },
  defaultVariants: { dragging: false, size: 'full' },
});

const textStyle = css({ fontSize: '14px', color: 'app.text', textAlign: 'center' });
const hintStyle = css({ fontSize: '12px', color: 'app.textTertiary' });
