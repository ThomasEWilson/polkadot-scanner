import React from 'react';
import styled from 'styled-components';

// import loadingAnimation from '../assets/loading-animation.svg';
import { getThemeConfig } from '../utils';

export const PageLoading = styled(({ className }) => {
  return (
    <div className={className}>
      
    </div>
  );
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${getThemeConfig('background')};

  & > img {
    width: 60px;
    height: 60px;
  }
`;

{/* <img src={loadingAnimation} /> */}
