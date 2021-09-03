import React, { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

// import { SearchIcon } from './icons';
import { InnerInput } from './Input';
import { flexBox, getThemeConfig, typography } from './utils';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: any;
  onChange?: (value: any) => void;
}

export const SearchInput = styled<FC<SearchInputProps>>(({ className, ...other }) => {
  return (
    <div className={className}>
      <InnerInput {...other} />
      {/* <SearchIcon /> */}
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
