import React, { FC } from 'react';
import styled from 'styled-components';

import { flexBox, getThemeConfig } from './utils';

type Direction = 'left' | 'right';

const ControllerBtn = styled.div<{ direction: Direction, disabled?: boolean }>`
  ${flexBox('center', 'center')}
  min-width: 40px;
  height: 24px;  
  border-radius: 24px;
  border: 1px solid ${getThemeConfig('gray2')};
  transition: all 200ms ease;
  cursor: pointer;

  & svg {
    transform: ${({ direction }) => `rotate(${direction === 'left' ? 90 : -90}deg)`};
  }

  &:hover {
    border-color: ${getThemeConfig('primary2')};
  }

  ${({ disabled, theme }) => {
    if (disabled) {
      return `
        border-color: ${getThemeConfig('grya8')({ theme })};
        cursor: not-allowed;
      `;
    }
  }}
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 40px);
  grid-column-gap: 8px;
`;

export interface ControllerProps {
  direction: Direction;
  disabled?: boolean;
  onClick?: () => void;
}

export const _Controller: FC<ControllerProps> = ({ direction,
  disabled,
  onClick }) => {
  return (
    <ControllerBtn
      direction={direction}
      disabled={disabled}
      onClick={onClick}
    >
      {'-->'}
    </ControllerBtn>
  );
};

type ControllerType = FC<ControllerProps> & { Group: typeof Group };

const Controller = _Controller as ControllerType;

Controller.Group = Group;

export { Controller };
