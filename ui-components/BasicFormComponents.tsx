import clsx from 'clsx';
import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';

import { Form } from './Form';
import { BareProps } from './types';
import { getThemeConfig } from './utils';

export type InputSize = 'small' | 'normal' | 'large';

interface FormInputRootProps extends BareProps {
  error?: boolean;
  focus?: boolean;
  size?: InputSize;
  onBlur?: (e) => void;
  onFocus?: (e) => void;
}

const InputRoot = styled.div<{ size?: InputSize }>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: ${({ size }) => size === 'large' ? 58 : 32}px;
  background: ${getThemeConfig('gray1')};
  border: 1px solid ${getThemeConfig('gray1')};
  transition: all .2s cubic-bezier(0.0, 0, 0.2, 1);
  border-radius: 8px;

  input {
    background: transparent;
    outline: none;
    box-shadow: none;
    color: ${getThemeConfig('primary', 'text')}
  }

  ${'.ant-form-item-has-error'} & {
    border-color: ${getThemeConfig('error2')};
  }

  &.focused {
    border-color: ${getThemeConfig('blue1')};
  }
`;

export const FormInputRoot: FC<FormInputRootProps> = ({ children,
  className,
  error,
  focus,
  onBlur,
  onFocus,
  size = 'large',
  ...props }) => {
  const [focused, setFocused] = useState<boolean>(false);

  const handleFocuse = useCallback((event): void => {
    if (onFocus) {
      onFocus(event);
    }

    setFocused(true);
  }, [setFocused, onFocus]);

  const handleBlur = useCallback((event): void => {
    if (onBlur) {
      onBlur(event);
    }

    setFocused(false);
  }, [setFocused, onBlur]);

  return (
    <InputRoot
      className={clsx(className, { error, focused: focus || focused })}
      onBlur={handleBlur}
      onFocus={handleFocuse}
      size={size}
      {...props as any}
    >
      {children}
    </InputRoot>
  );
};

export const AcaForm = styled(Form)`
  & .ant-form-item-required:before {
    display: none !important;
  }

  & .ant-form-item-label label {
    width: 100%;
  }
`;
