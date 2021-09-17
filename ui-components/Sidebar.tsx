import React, { FC } from 'react';
import styled from 'styled-components';
import { flexBox } from './utils';
import { Products } from './Products';
import { SidebarConfig } from './types';
import Image from 'next/image'

import polkaLogotype from '/public/polkaLogotypeC.png';

interface SidebarProps {
  showAccount?: boolean;
  config: SidebarConfig;
}

const SidebarRoot = styled.div`
  ${flexBox('flex-start', 'flex-start', 'column')};
  flex: 0 0 240px;
  background: ${({ theme }) => theme.sidebar.background};
  overflow: hidden;
`;

const CPolkaLogo = styled.img`
  width: 180px;
  height: 160px;
`

const CpolkadotContainer = styled.div`
    padding: 0px 24px;
    margin-bottom: 32px;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row-reverse;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  border-radius: 6px;
  padding: 4px 22px;
  font-size: 14px;
  font-weight: 400;
  line-height: 13px;
  color: rgb(189, 189, 189);
  border: 1px solid rgb(51, 51, 51);
  text-transform: uppercase;
  background: rgb(28, 28, 31);
  column-gap: 4px;
`;

// const CMargin = styled.div`
//   flex: 1 1 0;
//   height: 1px;
//   margin: 116px auto 24px 25px;

// `

export const Sidebar: FC<SidebarProps> = ({ config }) => {
  return (
    <SidebarRoot>
      <Image alt='Polkadot Logotype' src={polkaLogotype}/>
      <CpolkadotContainer>
        <Inner><span>POLKADOT</span></Inner>
      </CpolkadotContainer> 
      {<Products config={config.products} />}

    </SidebarRoot>
  );
};
