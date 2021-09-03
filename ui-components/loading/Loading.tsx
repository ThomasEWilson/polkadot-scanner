import React, { FC, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import BareProps from '../types'


interface LoadingProps extends BareProps {
  width?: number;
  size?: string;
}

const ringAnimation = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingRoot = styled.div<{ width: number, size?: string }>`
  --border-color: ${({ theme }) => theme.colors.primary1};

  position: relative;
  width: 40px;
  height: 40px;

  ${({ size }): string => size === 'sm'
    ? `
    width: 24px;
    height: 24px;
  `
    : ''};
  
  > div {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: ${({ width }): number => width}px solid var(--border-color);
    animation: ${ringAnimation} 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }

  > div:nth-child(1) {
    border-color: var(--border-color) transparent transparent transparent;
    animation-delay: -0.45s;
  }

  > div:nth-child(2) {
    border-color: transparent var(--border-color) transparent transparent;
    animation-delay: -0.3s;
  }

  > div:nth-child(3) {
    border-color: transparent transparent var(--border-color) transparent;
    animation-delay: -0.15s;
  }

  > div:nth-child(4) {
    border-color: transparent transparent transparent var(--border-color);
  }
`;

export const Loading: FC<LoadingProps> = memo(({ className, size, width }) => {
  return (
    <LoadingRoot
      className={className}
      size={size}
      width={width ?? 4 }
    >
      <div />
      <div />
      <div />
      <div />
    </LoadingRoot>
  );
});

Loading.displayName = 'Loading';
