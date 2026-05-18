'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { css } from 'styled-system/css';

interface DialogProps {
  isOpen: boolean;
  afterClose: () => void;
  title?: string;
  description?: string;
  hasCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  footerElements?: { right?: ReactNode; left?: ReactNode };
  children?: ReactNode;
}

export const Dialog = ({
  isOpen,
  afterClose,
  title,
  description,
  hasCloseButton = true,
  closeOnOutsideClick = true,
  footerElements,
  children,
}: DialogProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') afterClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, afterClose]);

  if (!isOpen) return null;

  return (
    <div
      className={overlayStyle}
      onClick={closeOnOutsideClick ? afterClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        className={panelStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || hasCloseButton) && (
          <div className={headerStyle}>
            <div>
              {title && <h2 id="dialog-title" className={titleStyle}>{title}</h2>}
              {description && <p className={descStyle}>{description}</p>}
            </div>
            {hasCloseButton && (
              <button
                type="button"
                className={closeButtonStyle}
                onClick={afterClose}
                aria-label="閉じる"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {children && <div className={bodyStyle}>{children}</div>}

        {footerElements && (
          <div className={footerStyle}>
            <div>{footerElements.left}</div>
            <div className={css({ display: 'flex', gap: '8px' })}>{footerElements.right}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const overlayStyle = css({
  position: 'fixed',
  inset: '0',
  bg: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: '16px',
  zIndex: '1000',
});

const panelStyle = css({
  width: '100%',
  maxWidth: '560px',
  maxHeight: '90svh',
  display: 'flex',
  flexDirection: 'column',
  bg: 'app.bgElevated',
  borderRadius: '14px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  overflow: 'hidden',
});

const headerStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
  px: '20px',
  pt: '20px',
  pb: '12px',
  borderBottom: '1px solid token(colors.app.separator)',
});

const titleStyle = css({
  fontSize: '17px',
  fontWeight: '600',
  color: 'app.text',
  lineHeight: '1.3',
});

const descStyle = css({
  fontSize: '13px',
  color: 'app.textSecondary',
  mt: '4px',
});

const closeButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '999px',
  bg: 'app.fill',
  color: 'app.textSecondary',
  flexShrink: '0',
  transition: 'all 150ms ease',
  _hover: { bg: 'app.fillSecondary', color: 'app.text' },
  _focusVisible: { outline: '2px solid token(colors.app.borderFocused)', outlineOffset: '2px' },
});

const bodyStyle = css({
  px: '20px',
  py: '16px',
  overflowY: 'auto',
  flex: '1',
});

const footerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  px: '20px',
  py: '16px',
  borderTop: '1px solid token(colors.app.separator)',
});
