import { css } from 'styled-system/css';
import type { ComponentProps } from 'react';

interface NumericInputProps extends Omit<ComponentProps<'input'>, 'onChange' | 'type' | 'value'> {
  value: string;
  onChange?: (value: string) => void;
  widthSize?: 'small' | 'medium' | 'large' | 'parentFull';
  heightSize?: 'small' | 'medium' | 'large';
  useMinus?: boolean;
  useFloat?: boolean;
  ariaLabel?: string;
}

export const NumericInput = ({
  value,
  onChange,
  widthSize = 'medium',
  heightSize = 'medium',
  useMinus = true,
  useFloat = true,
  ariaLabel,
  className,
  ...props
}: NumericInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const pattern = useFloat
      ? useMinus ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/
      : useMinus ? /^-?\d*$/ : /^\d*$/;
    if (raw === '' || raw === '-' || pattern.test(raw)) {
      onChange?.(raw);
    }
  };

  return (
    <input
      type="text"
      inputMode={useFloat ? 'decimal' : 'numeric'}
      value={value}
      onChange={handleChange}
      aria-label={ariaLabel}
      className={`${inputStyle} ${heightMap[heightSize]} ${widthMap[widthSize]} ${className ?? ''}`}
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
  textAlign: 'right',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  outline: 'none',
  _focus: {
    borderColor: 'app.borderFocused',
    boxShadow: '0 0 0 3px token(colors.app.info.subtle)',
  },
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
  small: css({ width: '72px' }),
  medium: css({ width: '120px' }),
  large: css({ width: '180px' }),
  parentFull: css({ width: '100%' }),
};
