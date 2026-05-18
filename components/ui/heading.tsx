import { cva } from 'styled-system/css';

type Level = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type Size = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
type Weight = 'normal' | 'medium' | 'bold';

interface HeadingProps {
  level?: Level;
  size?: Size;
  weight?: Weight;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Heading = ({
  level = 'h2',
  size = 'medium',
  weight = 'bold',
  text,
  children,
  className,
}: HeadingProps) => {
  const Tag = level;
  return (
    <Tag className={`${headingStyle({ size, weight })} ${className ?? ''}`}>
      {text ?? children}
    </Tag>
  );
};

const headingStyle = cva({
  base: {
    color: 'app.text',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
  },
  variants: {
    size: {
      xSmall: { fontSize: '13px' },
      small: { fontSize: '15px' },
      medium: { fontSize: '17px' },
      large: { fontSize: '20px' },
      xLarge: { fontSize: '26px' },
    },
    weight: {
      normal: { fontWeight: '400' },
      medium: { fontWeight: '500' },
      bold: { fontWeight: '700' },
    },
  },
  defaultVariants: { size: 'medium', weight: 'bold' },
});
