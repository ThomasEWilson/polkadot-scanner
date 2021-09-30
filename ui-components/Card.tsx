import { rgba } from 'polished';
import React, { FC, forwardRef, memo, ReactNode } from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

import { BareProps } from './types';
import { createBorderGradient, createVariant, flexBox, getThemeConfig, typography } from './utils';

export interface CardHeaderProps extends BareProps {
  title?: ReactNode;
  extra?: ReactNode;
  divider?: boolean;
}

export interface CardContentProps extends BareProps {
  padding?: string
}

export interface CardProps extends BareProps {
  width?: number;
  maxWidth?: number;
  shadow?: boolean;
  variant?: string;
  padding?: boolean | string;
}

const createPadding = (padding?: boolean | string) => {
  if (!padding) return '0 24px';

  if (typeof padding === 'string') return padding;

  if (typeof padding === 'boolean') {
    return padding ? '24px' : '0';
  }
};

export const CardRoot = styled.div<{ maxWidth?: number, padding?: boolean | string, width?: number, shadow?: boolean, variant?: string }>`
  margin: auto;
  width: ${({ width }) => width ? width + 'px' : '100%'};
  max-width: ${({ maxWidth }) => maxWidth ? maxWidth + 'px' : '100%'};
  position: relative;
  background: ${({ theme }) => theme.colors.gray0};
  padding: ${({ padding }) => createPadding(padding)};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  color: ${({ theme }) => theme.text.primary};
  box-shadow: ${({ shadow, theme }) => shadow ? `10px 20px 25px ${rgba(theme.colors.primary1, 0.02)}, 1px 1px 1px ${rgba(theme.colors.primary2, 0.05)}` : 'unset'};
  border: 1px solid ${getThemeConfig('gray1')};

  ${createVariant({
    'gradient-border': createBorderGradient('card'),
    'gradient-border-primary': createBorderGradient('primary'),
    'no-padding': () => `
      padding: 0;
    `
  })}
`;

const _Card: FC<CardProps> = forwardRef(({ children, ...other }, ref) => {
  return (
    <CardRoot {...other}
      ref={ref as any}
    >
      {children}
    </CardRoot>
  );
});

const CardHeaderRoot = styled.div<CardHeaderProps>`
  ${flexBox('space-between', 'center')};
  width: 100%;
  padding: 20px 0;
  border-bottom: ${({ divider, theme }) => divider ? '1px solid ' + rgba(theme.colors.gray5, 0.1) : 'none'};
  ${typography(16, 20, 500)};
`;

export const CardHeader: FC<CardHeaderProps> = memo(({ children, extra, title, ...other }) => {
  return (
    <CardHeaderRoot {...other}>
      {title || children}
      {extra}
    </CardHeaderRoot>
  );
});

export const CardContent = styled.div<CardContentProps>`
  padding: ${({ padding }) => padding || '0'};
  border-radius: 8px;
`;

CardHeader.displayName = 'CardHeader';
_Card.displayName = 'Card';

export const Card = _Card as typeof _Card & {
  Header: StyledComponent<FC<CardHeaderProps>, DefaultTheme, any, never>;
  Content: StyledComponent<FC<CardContentProps>, DefaultTheme, any, never>;
};

Card.Header = styled(CardHeader)``;
Card.Content = styled(CardContent)``;
