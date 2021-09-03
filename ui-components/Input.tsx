import React, { FC, forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { FormInputRoot, InputSize } from './BasicFormComponents';
import { Button } from './Button';
import { typography } from './utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  suffix?: ReactNode;
  prefix?: ReactNode;
  showMaxBtn?: boolean;
  size?: InputSize;
  onMax?: () => void;
}

const MaxBtn = styled(Button)`
  min-width: 0 !important;
  height: auto;
  padding: 0;
  ${typography(16, 19, 500)};
`;

export const InnerInput = styled.input`
  flex: 1;
  // clear border
  border: none !important;
  appearance: none !important;
  outline: none !important;
  box-shadow: none !important;

  background: transparent;
  line-height: 26px;

  transition: all 200ms
`;

const Prefix = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const Suffix = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
`;

export const Input: FC<InputProps> = forwardRef<HTMLDivElement, InputProps>(({ onMax,
  prefix,
  showMaxBtn = false,
  size,
  suffix,
  ...other }, ref) => {
  return (
    <FormInputRoot size={size} >
      {prefix ? <Prefix>{prefix}</Prefix> : null}
      <InnerInput
        ref={ref as any}
        {...other}
      />
      {showMaxBtn
        ? (
          <MaxBtn
            onClick={onMax}
            variant='text'
          >
          MAX
          </MaxBtn>
        )
        : null}
      {suffix ? <Suffix>{suffix}</Suffix> : null}
    </FormInputRoot>
  );
});

Input.displayName = 'Input';
