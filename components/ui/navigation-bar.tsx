import { type ReactNode } from 'react';
import { css, cva } from 'styled-system/css';
import { Icon } from './icon';

interface NavItemDef {
  text: string;
  icon: string;
  isSelected: boolean;
  renderItem: (props: { className: string; children: ReactNode }) => ReactNode;
}

interface NavigationBarProps {
  topMenu: NavItemDef[];
  bottomMenu: NavItemDef[];
}

export const NavigationBar = ({ topMenu, bottomMenu }: NavigationBarProps) => {
  return (
    <nav className={navStyle} aria-label="サイドナビゲーション">
      <div className={menuGroupStyle}>
        {topMenu.map((item) => (
          <NavItem key={item.text} item={item} />
        ))}
      </div>
      <div className={menuGroupStyle}>
        {bottomMenu.map((item) => (
          <NavItem key={item.text} item={item} />
        ))}
      </div>
    </nav>
  );
};

const NavItem = ({ item }: { item: NavItemDef }) => {
  const content = (
    <>
      <Icon
        type={item.icon}
        size="medium"
        variant={item.isSelected ? 'primary' : 'secondary'}
      />
      <span className={navLabelStyle({ selected: item.isSelected })}>{item.text}</span>
    </>
  );
  return item.renderItem({
    className: navItemStyle({ selected: item.isSelected }),
    children: content,
  });
};

const navStyle = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '64px',
  flexShrink: '0',
  bg: 'app.bgElevated',
  borderRight: '1px solid token(colors.app.separator)',
  py: '8px',
  overflowY: 'auto',
});

const menuGroupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  px: '6px',
});

const navItemStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    width: '52px',
    height: '52px',
    borderRadius: '10px',
    transition: 'all 150ms ease',
    cursor: 'pointer',
    textDecoration: 'none',
    _focusVisible: { outline: '2px solid token(colors.app.borderFocused)', outlineOffset: '2px' },
  },
  variants: {
    selected: {
      true: { bg: 'app.primary.subtle' },
      false: { _hover: { bg: 'app.fill' } },
    },
  },
  defaultVariants: { selected: false },
});

const navLabelStyle = cva({
  base: { fontSize: '9px', lineHeight: '1', textAlign: 'center', fontWeight: '500' },
  variants: {
    selected: {
      true: { color: 'app.primary' },
      false: { color: 'app.textSecondary' },
    },
  },
  defaultVariants: { selected: false },
});
