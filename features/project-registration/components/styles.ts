import { css } from 'styled-system/css';

export const pageStyle = css({
  p: { base: '16px', md: '24px' },
  pb: '96px',
  maxWidth: '960px',
  mx: 'auto',
  background: 'token(colors.ksTheme.background.canvas)',
});

export const titleStyle = css({
  fontSize: '24px',
  fontWeight: '700',
  color: 'token(colors.ksTheme.text.active)',
});

export const stepIndicatorWrapStyle = css({
  p: '12px',
  border: '1px solid token(colors.ksTheme.border.disabled)',
  borderRadius: '8px',
  background: 'token(colors.ksTheme.background.white)',
});

export const sectionStyle = css({
  border: '1px solid token(colors.ksTheme.border.disabled)',
  borderRadius: '8px',
  p: '16px',
  background: 'token(colors.ksTheme.background.white)',
});

export const sectionTitleStyle = css({
  fontSize: '18px',
  fontWeight: '700',
  mb: '12px',
  color: 'token(colors.ksTheme.text.active)',
});

export const grid2Style = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
  gap: '12px',
});

export const fieldStyle = css({
  display: 'grid',
  gap: '6px',
  fontSize: '13px',
  color: 'token(colors.ksTheme.text.active)',
});

export const inputStyle = css({
  height: '40px',
  border: '1px solid token(colors.ksTheme.border.disabled)',
  borderRadius: '6px',
  px: '10px',
  fontSize: '14px',
});


export const workingDaysTableHeaderRowStyle = css({
  display: 'grid',
  gridTemplateColumns: '1.4fr repeat(4, minmax(110px, 1fr))',
  gap: '8px',
  px: '16px',
  py: '8px',
  background: 'token(colors.ksTheme.background.canvas)',
  borderBottom: '1px solid token(colors.app.separator)',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  fontSize: '12px',
  fontWeight: '500',
  color: 'token(colors.app.textSecondary)',
  alignItems: 'center',
});

export const workingDaysTableDataRowStyle = css({
  display: 'grid',
  gridTemplateColumns: '1.4fr repeat(4, minmax(110px, 1fr))',
  gap: '8px',
  px: '16px',
  py: '12px',
  minHeight: '52px',
  alignItems: 'center',
  borderTop: '1px solid token(colors.app.separator)',
  background: 'token(colors.ksTheme.background.white)',
  '&:last-child': {
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  },
});

export const memberNameCellStyle = css({
  fontSize: '13px',
  color: 'token(colors.ksTheme.text.active)',
});

export const mappingGridStyle = css({
  border: '1px solid token(colors.app.separator)',
  borderRadius: '12px',
  overflow: 'hidden',
  background: 'token(colors.ksTheme.background.white)',
});

export const tableGridStyle = css({
  border: '1px solid token(colors.app.separator)',
  borderRadius: '12px',
  background: 'token(colors.ksTheme.background.white)',
});

export const mappingHeaderRowStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '180px 1fr' },
  gap: '12px',
  px: '16px',
  py: '8px',
  background: 'token(colors.ksTheme.background.canvas)',
  borderBottom: '1px solid token(colors.app.separator)',
  fontSize: '12px',
  fontWeight: '500',
  color: 'token(colors.app.textSecondary)',
});

export const mappingDataRowStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '180px 1fr' },
  gap: '12px',
  pl: '16px',
  pr: '16px',
  py: '12px',
  minHeight: '52px',
  alignItems: 'center',
  borderTop: '1px solid token(colors.app.separator)',
  background: 'token(colors.ksTheme.background.white)',
});

export const mappingLabelStyle = css({
  fontSize: '15px',
  fontWeight: '400',
  color: 'token(colors.ksTheme.text.active)',
});

export const chipsWrapStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const chipStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  border: '1px solid token(colors.ksTheme.border.disabled)',
  borderRadius: '16px',
  px: '8px',
  py: '4px',
  fontSize: '12px',
});

export const bottomNavWrapStyle = css({
  position: 'fixed',
  right: { base: '16px', md: '24px' },
  bottom: { base: '16px', md: '24px' },
  zIndex: '10',
});

export const apiCheckAreaStyle = css({
  mt: '12px',
  display: 'grid',
  gap: '8px',
  justifyItems: 'start',
});

export const errorTextStyle = css({
  fontSize: '13px',
  color: 'token(colors.red.600)',
});

export const previewBoxStyle = css({
  border: '1px solid token(colors.ksTheme.border.disabled)',
  borderRadius: '8px',
  p: '10px',
  background: 'token(colors.ksTheme.background.canvas)',
});

export const previewTitleStyle = css({
  fontSize: '13px',
  fontWeight: '600',
  color: 'token(colors.ksTheme.text.active)',
  mb: '6px',
});

export const previewListStyle = css({
  display: 'grid',
  gap: '4px',
  pl: '16px',
});

export const previewItemStyle = css({
  fontSize: '13px',
  color: 'token(colors.ksTheme.text.active)',
});

export const mappingSubSectionStyle = css({
  display: 'grid',
  gap: '6px',
});

export const mappingSubSectionTitleStyle = css({
  fontSize: '13px',
  fontWeight: '400',
  color: 'token(colors.app.textSecondary)',
  paddingLeft: '4px',
});

export const mappingTableWrapStyle = css({
  overflowX: 'auto',
});

export const mappingTableStyle = css({
  borderCollapse: 'collapse',
  width: '100%',
  fontSize: '13px',
  '& th, & td': {
    border: '1px solid token(colors.ksTheme.border.disabled)',
    px: '12px',
    py: '8px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  '& th': {
    background: 'token(colors.ksTheme.background.canvas)',
    fontWeight: '600',
    color: 'token(colors.ksTheme.text.subtle)',
  },
  '& td:first-child': {
    fontWeight: '600',
    color: 'token(colors.ksTheme.text.active)',
    textAlign: 'left',
    background: 'token(colors.ksTheme.background.canvas)',
    minWidth: '100px',
  },
  '& td': {
    background: 'token(colors.ksTheme.background.white)',
  },
});
