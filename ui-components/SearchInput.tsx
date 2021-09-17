import React, { FC, InputHTMLAttributes,HTMLAttributes } from 'react';
import styled from 'styled-components';
import Image from 'next/image'

import { InnerSearchInput } from './Input';
import { flexBox, getThemeConfig, typography } from './utils';

const searchIconPath = './icons/search.svg'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: any;
  onChange?: (value: any) => void;
}
interface QueryRangeProps extends HTMLAttributes<HTMLDivElement> {
  providerProps: SearchInputProps;
  blockFromProps: SearchInputProps;
  blockToProps: SearchInputProps;
}

export const SearchInput = styled<FC<QueryRangeProps>>(({ className, providerProps, blockFromProps, blockToProps }) => {
  return (
    <div className={className}>
      <InnerSearchInput {...providerProps} />
      <InnerSearchInput {...blockFromProps} />
      <InnerSearchInput {...blockToProps} />
      <Image src={searchIconPath} alt='Search Icon'/>
    </div>
  );
})`
  ${flexBox('flex-start', 'center')};

  background: ${getThemeConfig('gray0')};
  height: 96px;
  width: 270px;
  border-radius: 16px;
  padding: 20px;
  ${typography(13, 16, 500)};

  & input::placholder {
    ${typography(13, 16, 500, 'gray2')};
  }
`;
