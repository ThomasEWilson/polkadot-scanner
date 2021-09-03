import { flexBox, typography } from './utils';
import styled from 'styled-components';
import React, { FC, ReactNode } from 'react';

interface SidebarItemProps {
  icon?: ReactNode;
  content?: ReactNode;
  path?: string;
}

const Background = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ theme }) => theme.sidebar.active};
  opacity: 0;
  transition: opacity 0.2s ease-in;

  &:hover {
    opacity: 100;
  }
`;

const ActiveBar = styled.div`
  z-index: 2;
  height: 100%;
  position: absolute;
  left: 0;
  background: ${({ theme }) => theme.sidebar.activeBar};
  opacity: 0;
`;

const Root = styled.a`
  position: relative;
  width: 100%;
  height: 57.42px;
  padding: 0 30px;
  ${flexBox('flex-start', 'center')};
  color: ${({ theme }) => theme.sidebar.color} !important;
  ${typography(20, 17, 500)};

  &.active ${Background} {
    opacity: 100;
  }

  &.active ${ActiveBar} {
    opacity: 100;
  }
`;

const Icon = styled.div`
  width: 32px;
  margin-right: 14px;
`;

export const SidebarItem: FC<SidebarItemProps> = ({ content, icon, path }) => {
  const inner = (
    <>
      <Background />
      <ActiveBar />
      <Icon>{icon ?? ''}</Icon>
      {content}
    </>
  );
  
  return <Root href={path ?? ''}>{inner}</Root>
};
