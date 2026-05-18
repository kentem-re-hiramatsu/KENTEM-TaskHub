import { css } from 'styled-system/css';
import type { ComponentProps } from 'react';

interface InputProps extends Omit<ComponentProps<'input'>, 'onChange' | 'size'> {
  value: string;
  onChange?: (value: string) => void;
  heightSize?: 'small' | 'medium' | 'large';
  widthSize?: 'parentFull' | 'fit' | 'small' | 'medium' | 'large';
}

export const Input = ({
  value,
  onChange,
  heightSize = 'medium',
  widthSize,
  className,
  ...props
}: InputProps) => {
  const heightClass = heightMap[heightSize];
  const widthClass = widthSize ? widthMap[widthSize] : '';
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${inputStyle} ${heightClass} ${widthClass} ${className ?? ''}`}
      {...props}
    />
  );
};

const inputStyle = css({
  display: 'block',
  border: '1.5px solid token(colors.app.border)',
  borderRadius: '8px',
  bg: 'app.bgElevated',
  color: 'app.text',
  fontFamily: 'inherit',
  fontSize: '15px',
  px: '10px',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  outline: 'none',
  _focus: {
    borderColor: 'app.borderFocused',
    boxShadow: '0 0 0 3px token(colors.app.info.subtle)',
  },
  _placeholder: { color: 'app.textTertiary' },
  _disabled: {
    bg: 'app.bgElevated2',
    color: 'app.textDisabled',
    cursor: 'not-allowed',
  },
});

const heightMap: Record<string, string> = {
  small: css({ height: '32px' }),
  medium: css({ height: '40px' }),
  large: css({ height: '48px' }),
};

const widthMap: Record<string, string> = {
  parentFull: css({ width: '100%' }),
  fit: css({ width: 'fit-content' }),
  small: css({ width: '80px' }),
  medium: css({ width: '160px' }),
  large: css({ width: '240px' }),
};
