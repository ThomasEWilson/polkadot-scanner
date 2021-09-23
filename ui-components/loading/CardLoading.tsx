import React from 'react';
import styled from 'styled-components';

import { Loading } from './Loading';

export const CardLoading = styled(({ className, height, status }) => {
  return (
    <div
      className={className}
      style={{ height }}
    >
      <Loading 
        status={status}
      />
    </div>
  );
})`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 480px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
`;
