import { useApiIsReady, useResolveSubscanUrl } from '@acala-dapp/react-environment/state';
import { useBlockNumber } from '@acala-dapp/react-hooks/common/useBlockNumber';
import { getThemeConfig, styled, typography } from '@acala-dapp/ui-components';
import { Paragraph } from '@acala-dapp/ui-components/Paragraph';
import React, { memo } from 'react';

const Root = styled(Paragraph.Section)`
  margin-bottom: 24px;
  padding: 0 24px;

  ${Paragraph.Title} {
    ${typography(14, 1.5, 400, 'gray4')};
  }

  ${Paragraph.Content} {
    position: relative;
    margin-top: 8;
    padding-left: 28px;
    ${typography(16, 1.5, 500)};

    &::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      top: 50%;
      left: 0;
      transform: translate3d(0, -4px, 0);
      background: ${getThemeConfig('gray3')};
    }

    &.error {
      &::before {
        background: ${getThemeConfig('green3')};
      }

      > a {
        color: ${getThemeConfig('gray4')} !important;
      }
    }

    &.normal {
      &::before {
        background: ${getThemeConfig('green1')};
      }

      > a {
        color: ${getThemeConfig('green1')} !important;
      }
    }
  }
`;

export const BlockNumber = memo(() => {
  const blockNumber = useBlockNumber();
  const isReady = useApiIsReady();
  const resolveUrl = useResolveSubscanUrl();

  return (
    <Root>
      <Paragraph.Title>Current Block</Paragraph.Title>
      <Paragraph.Content className={isReady ? 'normal' : 'error'}>
        <a href={resolveUrl(`block/${blockNumber}`)}
          rel='noreferrer'
          target='_blank'>
          {blockNumber}
        </a>
      </Paragraph.Content>
    </Root>
  );
});

BlockNumber.displayName = 'BlockNumber';
