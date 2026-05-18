import { cva } from 'styled-system/css';

type Size = 'small' | 'medium' | 'large';
type FontColor = 'active' | 'inActive' | 'disabled' | 'link';

interface TypographyProps {
  text: string;
  size?: Size;
  fontColor?: FontColor;
  className?: string;
}

export const Typography = ({ text, size = 'medium', fontColor = 'active', className }: TypographyProps) => {
  return <span className={`${typographyStyle({ size, fontColor })} ${className ?? ''}`}>{text}</span>;
};

const typographyStyle = cva({
  base: { lineHeight: '1.5' },
  variants: {
    size: {
      small: { fontSize: '12px' },
      medium: { fontSize: '14px' },
      large: { fontSize: '16px' },
    },
    fontColor: {
      active: { color: 'app.text' },
      inActive: { color: 'app.textSecondary' },
      disabled: { color: 'app.textDisabled' },
      link: { color: 'app.textLink' },
    },
  },
  defaultVariants: { size: 'medium', fontColor: 'active' },
});
