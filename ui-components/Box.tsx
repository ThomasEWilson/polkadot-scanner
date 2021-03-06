import { FC } from 'react';
import styled from 'styled-components';

import { BareProps } from './types';

export const InlineBlockBox = styled.div<{ margin?: number | number[] }>`
  display: inline-block;
  margin: ${({ margin }): string => {
    if (Array.isArray(margin)) {
      return margin.map((i) => i + 'px').join(' ');
    }

    return margin + 'px';
  }};
`;

interface FlexBoxProps extends BareProps {
  direction?: 'column' | 'row';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'center';
  justifyContent?: 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | 'center';
  wrap?: 'nowrap' | 'wrap'
  width?: string;
  rowGap?: number;
  columnGap?: number;
}

export const FlexBox = styled.div<FlexBoxProps>`
  display: flex;
  flex-direction: ${({ direction }): string => direction || 'rows'};
  width: ${({ width }): string => width || 'auto'};
  justify-content: ${({ justifyContent }: FlexBoxProps): string => justifyContent || 'flex-start'};
  align-items: ${({ alignItems }: FlexBoxProps): string => alignItems || 'center'};
  row-gap: ${({ rowGap }): number => rowGap || 0}px;
  column-gap: ${({ columnGap }): number => columnGap || 0}px;
  flex-wrap: ${({ wrap }): string => wrap || 'wrap'};
`;

interface PaddingBoxProps extends BareProps {
  inline?: boolean;
  padding: number | string;
}

export const PaddingBox: FC<PaddingBoxProps> = styled.div`
  display: ${({ inline }: PaddingBoxProps): string => inline ? 'inline-block' : 'block'};
  padding: ${({ padding }: PaddingBoxProps): string => typeof padding === 'number' ? padding + 'px' : padding};
`;

interface GridBoxProps extends BareProps {
  column: number;
  row: number | 'auto';
  padding?: number;
}

export const GridBox = styled.div<GridBoxProps>`
  display: grid;
  grid-gap: ${({ padding }): string => padding + 'px'};
  grid-template-columns: ${({ column }): string => `repeat(${column}, 1fr)`};
  grid-template-rows: ${({ row }): string => row === 'auto' ? 'auto' : `repeat(${row}) 1fr`};
`;

export const SpaceBox = styled.div<{ height: number}>`
  width: 100%;
  height: ${({ height }): number => height}px;
`;
