import React, { FC } from 'react';
import styled from 'styled-components';

import { createVariant, getThemeConfig, typography } from './utils';

export const InformationRoot = styled.div<{ size?: 'small' | 'normal', variant?: string}>`
  padding: ${({ size }) => size === 'small' ? '6px 16px' : '16px 24px'};
  border-radius: 10px;
  background: ${getThemeConfig('gray2')};

  ${
  createVariant({
    error: ({ theme }) => `
        ${InformationContent} {
          color: ${getThemeConfig('primary1')({ theme })}
        }
      `
  })
}
`;

export const InformationTitle = styled.div`
  margin-bottom: 12px;
  ${typography(18, 1.5, 500, 'gray5')}
`;

export const InformationContent = styled.div`
  ${typography(16, 1.5, 400, 'gray4')}
`;

export interface InformationProps {
  title?: string;
  content: React.ReactNode;
  size?: 'small' | 'normal';
  variant?: string;
}

export const Information: FC<InformationProps> = ({ content, size = 'normal', title, variant }) => {
  return (
    <InformationRoot size={size}
      variant={variant}>
      { title ? <InformationTitle>{title}</InformationTitle> : null }
      <InformationContent>{content}</InformationContent>
    </InformationRoot>
  );
};
