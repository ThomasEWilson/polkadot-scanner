import React, { FC, ReactNode } from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

import { flexBox, getThemeConfig, typography } from '../utils';

const PageTitleContent = styled.div`
    flex: 1;
`;

export const PageTitle = styled.h2`
  z-index: 99;
  ${flexBox('space-between', 'center', 'row')};
  width: calc(100% + 88px);
  margin: 0 -44px;
  position: sticky;
  padding: 36px 44px 38px 44px;
  top: 0;
  ${typography(24, 29, 500, 'primary')};
  background: ${getThemeConfig('background')};

  > .primary {
  }
` as StyledComponent<'h2', DefaultTheme, any, never> & { Content: typeof PageTitleContent };

PageTitle.Content = PageTitleContent;

interface SubTitleProps extends BareProps {
  extra?: ReactNode;
  onClick?: () => void;
}

export const SubTitle = styled<FC<SubTitleProps>>(({ children, className, extra, onClick }) => {
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <div className='primary'>{children}</div>
      {extra}
    </div>
  );
})`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: ${({ extra }): string => extra ? 'space-between' : 'flex-start'};
  font-size: 16px;
  line-height: 21px;
  font-weight: 500;
  color: ${getThemeConfig('priamry', 'text')}

  .primary {
    flex: 1;
  }
`;
