import { Check } from 'lucide-react';
import { cva, css } from 'styled-system/css';

interface StepIndicatorProps {
  labelList: string[];
  currentStep: number;
}

export const StepIndicator = ({ labelList, currentStep }: StepIndicatorProps) => {
  return (
    <div className={wrapStyle}>
      {labelList.map((label, index) => {
        const state = index < currentStep ? 'done' : index === currentStep ? 'active' : 'pending';
        return (
          <div key={label} className={stepStyle}>
            <div className={circleStyle({ state })}>
              {state === 'done' ? <Check size={12} strokeWidth={3} /> : <span>{index + 1}</span>}
            </div>
            <span className={labelStyle({ state })}>{label}</span>
            {index < labelList.length - 1 && (
              <div className={lineStyle({ done: state === 'done' })} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const wrapStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0',
  overflowX: 'auto',
});

const stepStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexShrink: '0',
});

const circleStyle = cva({
  base: {
    width: '24px',
    height: '24px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: '0',
    transition: 'all 200ms ease',
  },
  variants: {
    state: {
      done: { bg: 'app.primary', color: 'white' },
      active: { bg: 'app.primary', color: 'white', boxShadow: '0 0 0 3px token(colors.app.primary.subtle)' },
      pending: { bg: 'app.fill', color: 'app.textSecondary' },
    },
  },
  defaultVariants: { state: 'pending' },
});

const labelStyle = cva({
  base: { fontSize: '12px', whiteSpace: 'nowrap' },
  variants: {
    state: {
      done: { color: 'app.textSecondary' },
      active: { color: 'app.primary', fontWeight: '600' },
      pending: { color: 'app.textTertiary' },
    },
  },
  defaultVariants: { state: 'pending' },
});

const lineStyle = cva({
  base: { height: '1px', width: '24px', mx: '4px', transition: 'background 200ms ease' },
  variants: {
    done: {
      true: { bg: 'app.primary' },
      false: { bg: 'app.border' },
    },
  },
  defaultVariants: { done: false },
});
