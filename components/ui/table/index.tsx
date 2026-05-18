'use client';

import { createContext, useContext } from 'react';
import { css } from 'styled-system/css';

interface TableContextValue {
  gridTemplateColumns: string;
  scrollable: boolean;
}

const TableContext = createContext<TableContextValue>({ gridTemplateColumns: '1fr', scrollable: false });

interface TableProps {
  headers: string[];
  gridTemplateColumns: string;
  children: React.ReactNode;
  scrollable?: boolean;
}

const TableComponent = ({ headers, gridTemplateColumns, children, scrollable = false }: TableProps) => {
  const rowStyle = scrollable ? { gridTemplateColumns, minWidth: 'max-content' } : { gridTemplateColumns };
  return (
    <TableContext.Provider value={{ gridTemplateColumns, scrollable }}>
      <div className={containerStyle}>
        <div className={headerRowStyle} style={rowStyle}>
          {headers.map((h) => <div key={h} className={headerCellStyle}>{h}</div>)}
        </div>
        {children}
      </div>
    </TableContext.Provider>
  );
};

interface RowProps {
  children: React.ReactNode;
}

const TableRow = ({ children }: RowProps) => {
  const { gridTemplateColumns, scrollable } = useContext(TableContext);
  const rowStyle = scrollable ? { gridTemplateColumns, minWidth: 'max-content' } : { gridTemplateColumns };
  return (
    <div className={dataRowStyle} style={rowStyle}>
      {children}
    </div>
  );
};

export const Table = Object.assign(TableComponent, { Row: TableRow });

const containerStyle = css({
  border: '1px solid token(colors.app.separator)',
  borderRadius: '12px',
  overflowX: 'auto',
  background: 'token(colors.ksTheme.background.white)',
});

const headerCellStyle = css({ whiteSpace: 'nowrap' });

const headerRowStyle = css({
  display: 'grid',
  gap: '8px',
  px: '16px',
  py: '8px',
  background: 'token(colors.ksTheme.background.canvas)',
  borderBottom: '1px solid token(colors.app.separator)',
  fontSize: '12px',
  fontWeight: '500',
  color: 'token(colors.app.textSecondary)',
  alignItems: 'center',
});

const dataRowStyle = css({
  display: 'grid',
  gap: '8px',
  px: '16px',
  py: '12px',
  minHeight: '52px',
  alignItems: 'center',
  borderTop: '1px solid token(colors.app.separator)',
  background: 'token(colors.ksTheme.background.white)',
});
