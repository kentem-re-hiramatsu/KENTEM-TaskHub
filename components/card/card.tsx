import type { KeyboardEvent, ReactNode } from 'react';
import { cva } from 'styled-system/css';
import { HStack, VStack } from 'styled-system/jsx';

interface CardProps {
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
}

export const Card = ({ header, children, footer, onClick }: CardProps) => {
  const interactive = typeof onClick === 'function';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <VStack
      className={containerStyle({ interactive })}
      alignItems="stretch"
      gap="12px"
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? handleKeyDown : undefined}
    >
      {header && (
        <VStack alignItems="flex-start" gap="4px">
          {header}
        </VStack>
      )}
      {children !== undefined && children !== null && (
        <div className={bodyStyle}>{children}</div>
      )}
      {footer && (
        <HStack justifyContent="flex-end" gap="8px" pt="4px">
          {footer}
        </HStack>
      )}
    </VStack>
  );
};

const containerStyle = cva({
  base: {
    boxSizing: 'border-box',
    p: '16px',
    bgColor: 'app.bgElevated',
    rounded: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'app.separator',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
    transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
  },
  variants: {
    interactive: {
      true: {
        cursor: 'pointer',
        userSelect: 'none',
        _hover: {
          boxShadow:
            '0 10px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
        },
        _active: {
          transform: 'scale(0.98)',
        },
        _focusVisible: {
          outline: '2px solid token(colors.ksTheme.border.focused)',
          outlineOffset: '2px',
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

const bodyStyle = cva({
  base: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'ksTheme.text.active',
  },
})();
