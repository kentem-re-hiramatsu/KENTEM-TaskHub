import { css } from 'styled-system/css';
import type { ComponentProps } from 'react';

export const Label = ({ className, children, ...props }: ComponentProps<'label'>) => {
  return (
    <label className={`${labelStyle} ${className ?? ''}`} {...props}>
      {children}
    </label>
  );
};

const labelStyle = css({
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: 'app.textSecondary',
  lineHeight: '1.4',
});
