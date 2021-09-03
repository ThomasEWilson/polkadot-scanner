import React from 'react';

import { OverwriteDividerStyle } from './Divider';
import { OverwriteFormStyle } from './Form';
export {PageContent as PageContent} from './PageContent';
export {PageCenterContent as PageCenterContent} from './PageContent';
export {Page as Page} from './Page';
export {PageTitle as PageTitle} from './PageTitle';

export * from './Popover';
export * from './Menu';

export const Restyled = () => {
  return (
    <>
      <OverwriteFormStyle />
      <OverwriteDividerStyle />
    </>
  );
};

