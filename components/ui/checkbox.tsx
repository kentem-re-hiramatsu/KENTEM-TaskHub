import { Check } from 'lucide-react';
import { cva, css } from 'styled-system/css';
import type { ChangeEvent, ComponentProps } from 'react';

interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'onChange'> {
  label?: string;
  checked: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({ label, checked, onChange, id, disabled, ...props }: CheckboxProps) => {
  return (
    <label className={wrapStyle({ disabled: !!disabled })}>
      <div className={boxStyle({ checked, disabled: !!disabled })}>
        {checked && <Check size={12} strokeWidth={3} color="white" />}
      </div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={css({ srOnly: true })}
        {...props}
      />
      {label && <span className={labelStyle}>{label}</span>}
    </label>
  );
};

const wrapStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  variants: {
    disabled: {
      true: { cursor: 'not-allowed', opacity: '0.38' },
      false: {},
    },
  },
  defaultVariants: { disabled: false },
});

const boxStyle = cva({
  base: {
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    border: '1.5px solid token(colors.app.border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    transition: 'all 150ms ease',
  },
  variants: {
    checked: {
      true: { bg: 'app.primary', borderColor: 'app.primary' },
      false: { bg: 'app.bgElevated' },
    },
    disabled: {
      true: {},
      false: {},
    },
  },
  defaultVariants: { checked: false, disabled: false },
});

const labelStyle = css({ fontSize: '14px', color: 'app.text', lineHeight: '1.4' });
