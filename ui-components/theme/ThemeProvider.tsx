import 'antd/dist/antd.dark.css';

import React, { FC } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { Restyled } from '../restyled';
import { BareProps } from '../types';
import { GlobalStyle } from './globalStyle';
import { theme } from './theme';

interface ThemeProviderProps extends BareProps {
  colorModal?: string
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      <Restyled />
      {children}
    </StyledThemeProvider>
  );
};
export default ThemeProvider;

