import { DefaultTheme } from 'styled-components';

export function getThemeConfig<T extends { theme: DefaultTheme } > (name: string, namespace = 'colors') {
  return ({ theme }: T): string => {
    if (namespace === 'root') return theme[name];

    return theme[namespace][name];
  };
}
