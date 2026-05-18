import { type ReactNode } from 'react';
import { css } from 'styled-system/css';

interface HeaderContainerProps {
  logo?: ReactNode;
  items?: ReactNode;
}

export const HeaderContainer = ({ logo, items }: HeaderContainerProps) => {
  return (
    <header className={headerStyle}>
      <div className={logoStyle}>{logo}</div>
      <div className={itemsStyle}>{items}</div>
    </header>
  );
};

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: '16px',
  height: '52px',
  bg: 'app.bgElevated',
  borderBottom: '1px solid token(colors.app.separator)',
  backdropFilter: 'blur(12px)',
});

const logoStyle = css({
  fontSize: '16px',
  fontWeight: '700',
  color: 'app.primary',
  letterSpacing: '-0.01em',
});

const itemsStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});
