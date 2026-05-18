'use client';

import { signOut } from 'next-auth/react';
import { useAppSession } from '@/features/auth/hooks/use-app-session';
import { useRouter } from 'next/navigation';
import { Flex } from 'styled-system/jsx';
import { PAGE_INFO } from '@/constants/url';
import { Dropdown } from '@/components/ui/dropdown';
import { IconButton } from '@/components/ui/icon-button';
import { useTheme } from '@/components/providers/theme-provider';
import { Moon, Sun } from 'lucide-react';
import { css } from 'styled-system/css';

export const HeaderMenu = () => {
  const { data } = useAppSession();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const userName = data?.user?.name?.trim() || 'ユーザー';

  return (
    <Flex alignItems="center" gap="8px">
      <IconButton
        size="small"
        variant="tertiaryNoFrame"
        ariaLabel="通知"
        mainIcon={{ category: 'mask', type: 'bell' }}
        onClick={() => {}}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'}
        className={themeToggleStyle}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <Dropdown
        button={{
          size: 'small',
          text: userName,
          leftIcon: { category: 'mask', type: 'accountCircle' },
        }}
        isRightAligned={true}
        menuSize="small"
        menuList={{
          items: [
            {
              text: '個人設定',
              leftIcon: { category: 'mask', type: 'account', variant: 'secondary' },
              onClick: () => router.push(PAGE_INFO.personalSettings.url),
            },
            {
              text: 'ログアウト',
              leftIcon: { category: 'mask', type: 'output', variant: 'secondary' },
              onClick: () => void signOut({ callbackUrl: '/login' }),
            },
            {
              text: 'ヘルプ',
              leftIcon: { category: 'mask', type: 'helpCircle', variant: 'secondary' },
              onClick: () => {},
            },
          ],
        }}
        ariaLabel="メニューリスト"
      />
    </Flex>
  );
};

const themeToggleStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '8px',
  color: 'app.textSecondary',
  transition: 'all 150ms ease',
  _hover: { bg: 'app.fill', color: 'app.text' },
  _focusVisible: { outline: '2px solid token(colors.app.borderFocused)', outlineOffset: '2px' },
});
