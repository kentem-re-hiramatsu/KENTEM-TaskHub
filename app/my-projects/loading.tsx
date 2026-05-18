import { css } from 'styled-system/css';

const PANEL_WIDTH = '220px';

const Loading = () => {
  return (
    <div className={layoutStyle}>
      <aside className={panelStyle}>
        <div className={panelHeaderSkeletonStyle} />
        <div className={listSkeletonStyle}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`item-${i}`} className={itemSkeletonStyle} />
          ))}
        </div>
      </aside>
      <div className={mainStyle}>
        <div className={detailSkeletonStyle}>
          <div className={cardRowSkeletonStyle}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`card-${i}`} className={cardSkeletonStyle} />
            ))}
          </div>
          <div className={blockSkeletonStyle} />
          <div className={blockSkeletonStyle} style={{ height: '320px' }} />
        </div>
      </div>
    </div>
  );
};

export default Loading;

const layoutStyle = css({
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
});

const panelStyle = css({
  width: PANEL_WIDTH,
  flexShrink: '0',
  borderRight: '1px solid token(colors.app.separator)',
  bg: 'app.bgElevated',
  display: 'flex',
  flexDirection: 'column',
  p: '8px',
  gap: '8px',
});

const panelHeaderSkeletonStyle = css({
  height: '16px',
  width: '120px',
  borderRadius: '6px',
  background: 'linear-gradient(90deg, #f0f2f5 0%, #e7eaee 45%, #f0f2f5 100%)',
  backgroundSize: '200% 100%',
  animation: 'projectCardSkeletonShimmer 1.4s ease-in-out infinite',
  mb: '4px',
});

const listSkeletonStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const itemSkeletonStyle = css({
  height: '40px',
  borderRadius: '8px',
  background: 'linear-gradient(90deg, #f0f2f5 0%, #e7eaee 45%, #f0f2f5 100%)',
  backgroundSize: '200% 100%',
  animation: 'projectCardSkeletonShimmer 1.4s ease-in-out infinite',
});

const mainStyle = css({
  flex: '1',
  minWidth: '0',
  overflowY: 'auto',
  p: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const detailSkeletonStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const cardRowSkeletonStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
});

const cardSkeletonStyle = css({
  height: '120px',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #f0f2f5 0%, #e7eaee 45%, #f0f2f5 100%)',
  backgroundSize: '200% 100%',
  animation: 'projectCardSkeletonShimmer 1.4s ease-in-out infinite',
});

const blockSkeletonStyle = css({
  height: '200px',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #f0f2f5 0%, #e7eaee 45%, #f0f2f5 100%)',
  backgroundSize: '200% 100%',
  animation: 'projectCardSkeletonShimmer 1.4s ease-in-out infinite',
});
