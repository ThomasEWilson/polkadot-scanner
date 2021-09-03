import React, { FC, memo, ReactNode, useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { BareProps } from './types';
import { createTextGradient, createVariant, flexBox, getThemeConfig, typography } from './utils';

interface BaseButtonProps extends BareProps {
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  size?: 'large' | 'small';
  minWidth?: number;
}

const BaseButtonRoot = styled.div<BaseButtonProps>`
  position: relative;
  ${flexBox('center', 'center')}
  height: ${({ size }) => size === 'large' ? 56 : 38}px;
  padding: 0 18px;
  padding: ${({ size }) => `0 ${size === 'small' ? 34 : 48}px`};
  color: ${getThemeConfig('gray7')};
  border-radius: ${({ size }) => size === 'large' ? 16 : 12}px;
  transition: all .4s ease;
  filter: brightness(${({ disabled }) => disabled ? 0.8 : 1});
  cursor: pointer;
  user-select: none;
  min-width: ${({ minWidth }) => minWidth || 0}px;
  ${({ size, theme }) => size === 'large' ? typography(18, 22, 600)({ theme }) : ''};

  ${({ disabled }) => {
    if (disabled) {
      return `
        opacity: 0.3;
        cursor: not-allowed;
      `;
    }
  }}

  background-image:
  ${({ theme }) => `
    linear-gradient(
      61.97deg,
      ${theme.colors.primary1} -2.84%,
      ${theme.colors.primary2} 86.13%
    )
  `};
  background-repeat: no-repeat;

  &:hover {
    filter: ${({ disabled }) => disabled ? 'opacity: 0.3; cursor: not-allowed;' : 'brightness(1.2)'};
  }

  & > svg {
    margin-right: 8px;
  }

  a {
    color: inherit !important;
  }
`;

const ContainerButtonRoot = styled(BaseButtonRoot)`
  background-clip: padding-box;
`;

const OutlineButtonRoot = styled(BaseButtonRoot)`
  border: 1px solid ${getThemeConfig('primary2')};
  background: transparent;

  &:hover {
    box-shadow: inset 0 0 1px 1px ${getThemeConfig('primary2')};
  }
`;

const TextButtonRoot = styled(BaseButtonRoot)`
  background: none;

  ${createVariant({
    primary: ({ theme }) => `
      ${createTextGradient('primary')({ theme })};
    `
  })}
`;

export const ContainedButton: FC<BaseButtonProps> = memo(({ children, className, icon, ...other }) => {
  return (
    <ContainerButtonRoot className={className}
      {...other}>
      {icon}
      {children}
    </ContainerButtonRoot>
  );
});

ContainedButton.displayName = 'ContainedButton';

export const OutlineButton: FC<BaseButtonProps> = memo(({ children, className, icon, ...other }) => {
  return (
    <OutlineButtonRoot className={className}
      {...other}>
      {icon}
      {children}
    </OutlineButtonRoot>
  );
});

OutlineButton.displayName = 'OutlineButton';

export const TextButton: FC<BaseButtonProps> = memo(({ children, className, icon, ...other }) => {
  return (
    <TextButtonRoot className={className}
      {...other}>
      {icon}
      {children}
    </TextButtonRoot>
  );
});

TextButton.displayName = 'TextButton';

export interface ButtonProps extends BaseButtonProps {
  variant?: string;
}

export const Button = styled<FC<ButtonProps>>(({ disabled, onClick, ...other }) => {
  const _onClick = useCallback(() => {
    if (disabled) return;

    if (onClick) onClick();
  }, [disabled, onClick]);

  const _other = useMemo(() => ({ ...other, disabled: disabled, onClick: _onClick }), [other, _onClick, disabled]);

  if (_other.variant === 'containerd') return <ContainedButton {..._other} />;

  if (_other.variant === 'outline') return <OutlineButton {..._other} />;

  if (_other.variant?.includes('text')) return <TextButton {..._other } />;

  return <ContainedButton {..._other} />;
})``;
