import { css } from 'styled-system/css';

interface ProgressBarProps {
  value: number;
  plannedValue: number;
  max: number;
  'aria-label'?: string;
}

export const ProgressBar = ({
  value,
  plannedValue,
  max,
  'aria-label': ariaLabel = '進捗',
}: ProgressBarProps) => {
  const safeMax = max > 0 ? max : 1;
  const clamp = (n: number) => Math.min(Math.max(n, 0), safeMax);
  const valuePercent = (clamp(value) / safeMax) * 100;
  const plannedPercent = (clamp(plannedValue) / safeMax) * 100;

  return (
    <div
      className={trackStyle}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={clamp(value)}
      aria-valuemin={0}
      aria-valuemax={safeMax}
    >
      <div className={fillStyle} style={{ width: `${valuePercent}%` }} />
      <div
        className={plannedMarkerStyle}
        style={{ left: `${plannedPercent}%` }}
        aria-hidden="true"
      />
    </div>
  );
};

const trackStyle = css({
  position: 'relative',
  width: '100%',
  height: '16px',
  bgColor: '#e0e0e0',
  rounded: '999px',
  overflow: 'visible',
});

const fillStyle = css({
  height: '100%',
  bgColor: '#34C759',
  roundedLeft: '999px',
  transition: 'width 200ms ease-out',
});

const plannedMarkerStyle = css({
  position: 'absolute',
  top: '-4px',
  bottom: '-4px',
  width: '4px',
  bgColor: '#007AFF',
  rounded: '2px',
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
});
