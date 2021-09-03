import { Popover as AntPopover, PopoverProps } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { getThemeConfig, typography } from '../utils';

export const Popover = styled(({ className, ...other }: PopoverProps & { variant?: string }) => {
  return <AntPopover overlayClassName={className}
    {...other} />;
})`
  color: ${getThemeConfig('primary', 'text')};

  & .ant-popover-inner {
    max-width: 520px;
    margin-top: -1px;
    padding: 0 20px 0 20px;
    background: ${getThemeConfig('gray1')};
    border: 1px solid ${getThemeConfig('gray0')};
    border-radius: ${getThemeConfig('borderRadius2', 'root')}px;
    overflow: hidden;
  }

  & .ant-popover-title {
    padding: 0;
    padding-top: 18px;
    min-height: 0;
    border-bottom: none;
    ${typography(14, 17, 400)};
  }

  & .ant-popover-inner-content {
    padding: 24px 0;
    color: ${getThemeConfig('gray7')} !important;
  }

  & .ant-popover-arrow > .ant-popover-arrow-content {
    display: none;
    box-shadow: none;
    background: ${getThemeConfig('gray1')};
  }
`;
