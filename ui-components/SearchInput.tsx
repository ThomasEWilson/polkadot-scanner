import React, { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import Image from 'next/image'

import { InnerInput } from './Input';
import { flexBox, getThemeConfig, typography } from './utils';

const searchIconPath = './icons/search.svg'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: any;
  onChange?: (value: any) => void;
}

export const SearchInput = styled<FC<SearchInputProps>>(({ className, [providerProps, blockFromProps, blockToProps] }) => {
  return (
    <div className={className}>
      <InnerInput {...other} />
      <InnerInput {...other} />
      <InnerInput {...other} />
      <Image src={searchIconPath} alt='Search Icon'/>
    </div>
  );
})`
  ${flexBox('flex-start', 'center')};

  background: ${getThemeConfig('gray0')};
  height: 32px;
  width: 270px;
  border-radius: 16px;
  padding: 0 20px;
  ${typography(13, 16, 500)};

  & input::placholder {
    ${typography(13, 16, 500, 'gray2')};
  }
`;
