import type { NextPage } from 'next'
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components'
import BlockInfo from './block-info';
import BestHash from './BestHash';
import Query from './Query'
import { useSetTitle } from '/react-environment/state/modules/application/hooks';

const CH3 = styled.h3`text-align: center; padding: 20px 5px; color: white;`;

const CBestHash = styled(BestHash)``;

const Explorer: NextPage = ({ }) => {
  // Authorization Required for Scanner Access
  // POLKASCANNER Scanner Feature.
  const setTitle = useSetTitle();
  useEffect(() => setTitle('Polkadot Block-Range Explorer'), [setTitle]);


  return (
    <>
      <CH3>EXPLORER TEST</CH3>
      <CBestHash/>

      {/* <Query /> */}
      {/* Will loop over Blocks gathered from query to map out BlockInfo blocks. */}
      {/* Devise new component BlockRangeInfo expanding ByHash:
          Props: from query. 
          Ensure Progress Bar silliness goes up and back down.
          Build out one large table spanning blocks
          provide filter options: name, by event type.

          BlockRangeInfo expand ByHash
          1. Modify ByHash to BlockRange Extrinsics in a single table, IDed by blockNumber.
           - Ignore SystemEvents,Logs,Justifications
          2. Loop over gathered blocks:
           - Modify Extrinsics to return Rows for the BlockRangeExtrinsics
             - make a table, map Extrinsics sets into them.
          3. Filter the big table with onFilter(handler).

      */}
      <BlockInfo />
    </>
  )
}

export default Explorer;