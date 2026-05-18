import { cva } from 'styled-system/css';
import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
type Size = 'small' | 'medium' | 'large';

const iconSizeMap: Record<Size, number> = { small: 14, medium: 16, large: 18 };

interface ButtonProps extends Omit<ComponentProps<'button'>, 'size'> {
  variant?: Variant;
  size?: Size;
  horizontalSize?: 'parentFull' | 'fit';
  leftIcon?: LucideIcon;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  horizontalSize,
  leftIcon: LeftIcon,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={buttonStyle({ variant, size, full: horizontalSize === 'parentFull' }) + (className ? ` ${className}` : '')}
      {...props}
    >
      {LeftIcon ? <LeftIcon size={iconSizeMap[size]} aria-hidden="true" /> : null}
      {children}
    </button>
  );
};

const buttonStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontWeight: '600',
    borderRadius: '10px',
    border: '1.5px solid transparent',
    transition: 'all 150ms ease',
    cursor: 'pointer',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    _focusVisible: {
      outline: '2px solid token(colors.app.borderFocused)',
      outlineOffset: '2px',
    },
    _disabled: {
      opacity: '0.38',
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      primary: {
        bg: 'app.primary',
        color: 'app.primary.text',
        _hover: { bg: 'app.primary.pressed' },
        _active: { bg: 'app.primary.pressed' },
      },
      secondary: {
        bg: 'app.bgElevated',
        color: 'app.primary',
        borderColor: 'app.primary',
        _hover: { bg: 'app.primary.subtle' },
        _active: { bg: 'app.primary.subtle' },
      },
      tertiary: {
        bg: 'transparent',
        color: 'app.primary',
        _hover: { bg: 'app.primary.subtle' },
        _active: { bg: 'app.primary.subtle' },
      },
      ghost: {
        bg: 'transparent',
        color: 'app.textSecondary',
        _hover: { bg: 'app.fill' },
        _active: { bg: 'app.fillSecondary' },
      },
      danger: {
        bg: 'app.error.DEFAULT',
        color: '#FFFFFF',
        _hover: { opacity: '0.9' },
        _active: { opacity: '0.8' },
      },
    },
    size: {
      small: { fontSize: '13px', px: '12px', py: '6px', minH: '30px' },
      medium: { fontSize: '15px', px: '16px', py: '9px', minH: '36px' },
      large: { fontSize: '17px', px: '20px', py: '12px', minH: '44px' },
    },
    full: {
      true: { width: '100%' },
      false: {},
    },
  },
  defaultVariants: { variant: 'primary', size: 'medium', full: false },
});
