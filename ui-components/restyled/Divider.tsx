import { createGlobalStyle } from 'styled-components';

import { getThemeConfig } from '../utils';

export const OverwriteDividerStyle = createGlobalStyle`
  .ant-divider-horizontal {
    height: 1px;
    background: ${getThemeConfig('gray1')}
  }
`;
