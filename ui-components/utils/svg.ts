import { createElement, FC, FunctionComponent, ReactNode, SVGProps, useMemo } from 'react';
import styled, { AnyStyledComponent, useTheme } from 'styled-components';

import { Theme } from '../types';

export const createStyledIcon = (component: ReactNode, custom?: string): AnyStyledComponent => {
  return styled(component as any)`
    ${custom ||
      `
      path {
        stroke: var(--icon-stroke);
      }`}
  `;
};

type ThemedConfig = Record<Theme, FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined; }> >;

export const createThemedSvg = (config: ThemedConfig): FC => {
  return ((props) => {
    const theme = useTheme();

    const content = useMemo(() => {
      if (theme.theme && config[theme.theme]) return createElement(config[theme.theme] as any, { ...props });

      return null;
    }, [theme, props]);

    return content;
  }) as FC;
};
