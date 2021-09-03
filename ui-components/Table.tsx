import styled from 'styled-components';

import { createVariant, getThemeConfig, typography } from './utils';

export const TableRow = styled.tr<{disabled?: boolean}>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray1};

  &:last-child {
    border-bottom: none;
  }

  & span, div{
    color: ${({ disabled }) => disabled && getThemeConfig('second', 'text')} !important;
  }
`;

export const TableCell = styled.td<{ align?: string }>`
  padding: 14px 0;
  text-align: ${({ align }) => align ?? 'right'};
`;

export const TableBody = styled.tbody`
  padding: 10px 40px 0 40px;
`;

export const TableHeader = styled.thead`
  padding: 6px 40px;
  background: ${getThemeConfig('gray9')};

  & ${TableRow} {
    // clear table header border
    border-bottom: none;
  }

  & ${TableCell} {
    ${typography(13, 16, 400, 'gray4')};
  }
`;

const _Table = styled.table<{ variant?: string }>`
    width: 100%;

    & ${TableHeader} {
      padding: 0;
      background: transparent;
      border-bottom: 1px solid ${getThemeConfig('gray1')};
    }

    & ${TableRow} {
      padding: 24px 0;
    }

    ${createVariant({
    card: ({ theme }) => `
      border: 1px solid ${theme.colors.gray1};
      border-radius: ${theme.borderRadius}px;
      overflow: hidden;

      ${TableHeader} {
        ${TableRow} {
          background: ${theme.colors.gray1};
        }
      }

      ${TableRow} {
        background: ${theme.colors.gray0};
        border-bottom: 1px solid ${theme.colors.gray1};

        &:last-child {
          border: none;
        }
      }

      ${TableCell} {

      }
    `
  })
}
`;

const ColGroup = styled.colgroup``;

const Col = styled.col``;

export const Table = _Table as (typeof _Table) & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
  ColGroup: typeof ColGroup;
  Col: typeof Col;
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.ColGroup = ColGroup;
Table.Col = Col;
