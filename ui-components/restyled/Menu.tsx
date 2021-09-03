import { Menu as AntMenu } from 'antd';
import styled from 'styled-components';

import { getThemeConfig, typography } from '../utils';

export const Menu = styled(AntMenu)`
  min-width: 198px;
  background: ${getThemeConfig('gray0')};
  padding: 10px 0;

  ${typography(14, 17, 400)};

  & .ant-menu-item {
    height: auto;
    margin: 0 !important;
    line-height: 1;
    padding: 14px 30px;
    background: ${getThemeConfig('gray0')};
    color: ${getThemeConfig('primary', 'text')} !important;
    user-selector: none;

    &:hover {
      background: ${getThemeConfig('gray1')} !important;
    }
  }

  &.ant-menu .ant-menu-item-selected {
    background: ${getThemeConfig('gray0')};
  }
`;
