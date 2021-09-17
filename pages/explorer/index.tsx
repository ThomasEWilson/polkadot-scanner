import type { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import BlockByNumber from './block-info/ByNumber';
import BestHash from './BestHash';
import { useSetTitle } from '/react-environment/state/modules/application/hooks';
import { Button, Card, FlexBox, Form } from '/ui-components'
import { flexBox, typography } from '/ui-components/utils'


const CH3 = styled.h3`text-align: center; padding: 20px 5px; color: white;`;

const CForm = styled(Form)`
  margin-top: 60px;

  & .ant-form-item {
    margin-bottom: 0;
  }
`;

const SearchBtn = styled(Button)`  
  margin: 32px auto 0 auto;
  padding: 0 40px;
  width: 320px;`

const Title = styled.div`
  ${flexBox('space-between', 'center')};
  ${typography(14, 17, 500, 'gray4')};
  margin-bottom: 20px;`;

const ErrorBtn = styled(SearchBtn).attrs({ as: Button })``;

const CCard = styled(Card)`
  margin: 36px auto;
  width: 560px;
  padding: 36px 24px;
  background: linear-gradient(101.18deg, rgba(255, 255, 255, 0) 1.64%, rgba(255, 255, 255, 0.1) 112.71%) no-repeat border-box padding-box, linear-gradient(rgb(34, 34, 34), rgb(34, 34, 34)) padding-box, linear-gradient(50.94deg, rgba(228, 12, 91, 0) 48.71%, rgba(255, 76, 59, 0.6) 94.76%) border-box rgb(34, 34, 34);`;

interface FormData { 
  rpcUrl?: string; 
  fromBlockNumber: number;
  toBlockNumber?: number;
}

const CBestHash = styled(BestHash)``;

const Explorer: NextPage = ({ }) => {
  // Authorization Required for Scanner Access
  // POLKASCANNER Scanner Feature.
  const setTitle = useSetTitle();
  useEffect(() => setTitle('Polkadot Block-Range Explorer'), [setTitle]);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm<FormData>();

  const initData: FormData = {
    rpcUrl: 'wss://rpc.polkadot.io',
    fromBlockNumber: 6829987,
    toBlockNumber: 6829988  //(default to useBlockNumber, hardcoding for DEV)
  };

  // const { data, dataRef, update } = useDataChanger<FormData>(initData);

  // const requiredFlag = useRef<boolean>(true);

  // const outputRules = useNumberRule({
  //   required: () => requiredFlag.current,
  //   transferCheck: {
  //     account: current,
  //     amount: new FixedPointNumber(data.output?.amount || 0, (data.output?.token as any as Token).decimal),
  //     currency: data?.output?.token,
  //     direction: 'to',
  //     message: 'The account balance will be too low and removed. Read more on Existential Deposit.'
  //   }
  // });

   


  return (
    <>
      <CH3>EXPLORER TEST</CH3>
      {/* <CBestHash/> */}

      <BlockByNumber
        value={initData.toBlockNumber}
      />

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
      {/* <BlockInfo /> */}
    </>
  )
}

export default Explorer;