import { DefaultTheme } from 'styled-components';

export function typography (fontSize: number, lineHeight: number, fontWeight: number, color?: string) {
  return ({ theme }: { theme: DefaultTheme }) => `
    font-size: ${fontSize}px;
    font-weight: ${fontWeight};
    line-height: ${lineHeight < 10 ? lineHeight : `${lineHeight}px`};
    color: #ffffff;
  `;
}
