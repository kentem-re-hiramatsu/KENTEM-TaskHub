import { cva } from 'styled-system/css';
import { Icon } from './icon';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'tertiaryNoFrame';
type Size = 'xSmall' | 'small' | 'medium' | 'large';

interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  mainIcon: { category?: 'mask' | 'fill'; type: string };
  variant?: Variant;
  size?: Size;
  ariaLabel: string;
}

export const IconButton = ({
  mainIcon,
  variant = 'secondary',
  size = 'medium',
  ariaLabel,
  className,
  ...props
}: IconButtonProps) => {
  const iconSize = size === 'xSmall' ? 'small' : size === 'large' ? 'large' : 'medium';
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`${buttonStyle({ variant, size })} ${className ?? ''}`}
      {...props}
    >
      <Icon
        type={mainIcon.type}
        category={mainIcon.category}
        size={iconSize}
        variant={variant === 'primary' ? 'primary' : 'secondary'}
      />
    </button>
  );
};

const buttonStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 150ms ease',
    cursor: 'pointer',
    flexShrink: '0',
    _focusVisible: { outline: '2px solid token(colors.app.borderFocused)', outlineOffset: '2px' },
    _disabled: { opacity: '0.38', cursor: 'not-allowed' },
  },
  variants: {
    variant: {
      primary: { bg: 'app.primary', color: 'white', _hover: { bg: 'app.primary.pressed' } },
      secondary: { bg: 'app.fill', color: 'app.text', _hover: { bg: 'app.fillSecondary' } },
      tertiary: { bg: 'transparent', color: 'app.text', border: '1px solid token(colors.app.border)', _hover: { bg: 'app.fill' } },
      tertiaryNoFrame: { bg: 'transparent', color: 'app.textSecondary', _hover: { bg: 'app.fill', color: 'app.text' } },
    },
    size: {
      xSmall: { width: '24px', height: '24px' },
      small: { width: '30px', height: '30px' },
      medium: { width: '36px', height: '36px' },
      large: { width: '44px', height: '44px' },
    },
  },
  defaultVariants: { variant: 'secondary', size: 'medium' },
});
