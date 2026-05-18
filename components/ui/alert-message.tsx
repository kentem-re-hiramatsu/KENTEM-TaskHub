import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cva, css } from 'styled-system/css';

type Variant = 'error' | 'warning' | 'success' | 'info';
type Size = 'small' | 'medium' | 'large';

interface AlertMessageProps {
  text: string;
  variant?: Variant;
  size?: Size;
  horizontal?: 'fit' | 'full';
}

const icons = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

export const AlertMessage = ({ text, variant = 'info', size = 'medium', horizontal = 'fit' }: AlertMessageProps) => {
  const IconComp = icons[variant];
  return (
    <div className={alertStyle({ variant, size, full: horizontal === 'full' })} role="alert">
      <IconComp size={size === 'small' ? 14 : 16} className={css({ flexShrink: '0' })} />
      <span>{text}</span>
    </div>
  );
};

const alertStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'flex-start',
    gap: '8px',
    borderRadius: '10px',
    lineHeight: '1.5',
  },
  variants: {
    variant: {
      error: {
        bg: 'app.error.subtle',
        color: 'app.error.DEFAULT',
        border: '1px solid token(colors.app.error.DEFAULT)',
      },
      warning: {
        bg: 'app.warning.subtle',
        color: 'app.warning.DEFAULT',
        border: '1px solid token(colors.app.warning.DEFAULT)',
      },
      success: {
        bg: 'app.success.subtle',
        color: 'app.success.DEFAULT',
        border: '1px solid token(colors.app.success.DEFAULT)',
      },
      info: {
        bg: 'app.info.subtle',
        color: 'app.info.DEFAULT',
        border: '1px solid token(colors.app.info.DEFAULT)',
      },
    },
    size: {
      small: { fontSize: '12px', px: '10px', py: '7px' },
      medium: { fontSize: '14px', px: '12px', py: '10px' },
      large: { fontSize: '15px', px: '14px', py: '12px' },
    },
    full: {
      true: { width: '100%' },
      false: {},
    },
  },
  defaultVariants: { variant: 'info', size: 'medium', full: false },
});
