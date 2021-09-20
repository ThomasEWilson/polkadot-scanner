import type { NextPage } from 'next'
import React, { useEffect, useRef, useState, FC, useCallback } from 'react';
import styled from 'styled-components'

import BlockByNumber from './block-info/ByNumber';

import { useIdleTimer } from 'react-idle-timer'
import { useDataChanger, useBestNumber } from '/lib';
import { useSetTitle } from '/react-environment/state/modules/application/hooks';
import { Button, Card, FlexBox, Form, FormItem, Input } from '/ui-components'
import { flexBox, typography } from '/ui-components/utils'

// import { Input } from 'antd'


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

const ErrorBtn = styled(SearchBtn).attrs({ as: Button })``;

const CCard = styled(Card)`
  margin: 36px auto;
  width: 560px;
  padding: 36px 24px;
  background: linear-gradient(101.18deg, rgba(255, 255, 255, 0) 1.64%, rgba(255, 255, 255, 0.1) 112.71%) no-repeat border-box padding-box, linear-gradient(rgb(34, 34, 34), rgb(34, 34, 34)) padding-box, linear-gradient(50.94deg, rgba(228, 12, 91, 0) 48.71%, rgba(255, 76, 59, 0.6) 94.76%) border-box rgb(34, 34, 34);`;

const CFormItem = styled(FormItem)`
    margin: 0.5rem 0;`

const CPrefix = styled.span`
  font-weight: 500
`
interface FormData { 
  rpcUrl?: string; 
  fromBlockNumber: number;
  toBlockNumber?: number;
}

const ExplorerPage: FC = () => {
  const setTitle = useSetTitle();
  useEffect(() => setTitle('Polkadot Block-Range Explorer'), [setTitle]);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm<FormData>();
  const currentBestNumber = useBestNumber();
  const [hasBestNumberInit, setBestNumberInit] = useState<boolean>(false);

  const initFormData: FormData = {
    rpcUrl: 'wss://rpc.polkadot.io',
    fromBlockNumber: 6829987,
    toBlockNumber: 6829988  //(default to useBlockNumber, hardcoding for DEV)
  };

  const { data, dataRef, update } = useDataChanger<FormData>(initFormData);
  const requiredFlag = useRef<boolean>(true);

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

  const setRPCValue = useCallback((rpcVal?: string) => {
    const _data = { rpcUrl: dataRef.current.rpcUrl };

    _data.rpcUrl = rpcVal?.toString() || '';

    update(_data);
    form.setFieldsValue(_data);
  }, [dataRef, form, update]);

  const setFromBlockValue = useCallback((num?: number) => {
    const _data = { fromBlockNumber: dataRef.current.fromBlockNumber };

    _data.fromBlockNumber = num || 0;

    update(_data);
    form.setFieldsValue(_data);
  }, [dataRef, form, update]);

  const setToBlockValue = useCallback((num?: number) => {
    const _data = { toBlockNumber: dataRef.current.toBlockNumber };

    _data.toBlockNumber = num || 0;

    update(_data);
    form.setFieldsValue(_data);
  }, [dataRef, form, update]);

  const handleValueChange = useCallback((changed: Partial<FormData>) => {
    if (changed.rpcUrl) {
        setRPCValue(changed.rpcUrl);
    }
    if (changed.fromBlockNumber) {
        setFromBlockValue(changed.fromBlockNumber);
    }
    if (changed.toBlockNumber) {
        setToBlockValue(changed.toBlockNumber);
    }
    update(changed);
  }, [update, setRPCValue, setFromBlockValue, setToBlockValue]);

//   Action on search
  const search = () => {
      console.log('Searching BITCH')
      console.log(data);
  }

  const handleOnIdle = event => {
    console.log('user is idle', event)
    idleRef.current = true;
  }

  const handleOnActive = event => {
    console.log('user is active', event)
    idleRef.current = false;
  }

  const { isIdle } = useIdleTimer({
    timeout: 1000 * 10,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
  })
  const idleRef = useRef<boolean>(isIdle());

     // Initialize Inputs with API Values
  useEffect(() => {
    if ( !currentBestNumber ) return;
    if ( idleRef.current || !hasBestNumberInit) {
        const _bestNumber = currentBestNumber.toNumber()
        update({
          fromBlockNumber: _bestNumber - 1,
          toBlockNumber: _bestNumber
        });
    
        form.setFieldsValue({
          fromBlockNumber: _bestNumber - 1,
          toBlockNumber: _bestNumber
        });
        if ( !hasBestNumberInit ) setBestNumberInit(true);
    }
  }, [currentBestNumber, hasBestNumberInit, idleRef, update, form]);

  return (
    <>
    <CForm
      form={form}
      onValuesChange={handleValueChange}
    >
      <CCard variant='gradient-border'>
        <FlexBox className='login-logo' justifyContent='center'>
          {/* <Image src={polkaLogo} alt='Polkadot Logo'></Image> */}
        </FlexBox>
        <CFormItem
          initialValue={initFormData.rpcUrl}
          name='rpcUrl'
          rules={[{ required: true, message: 'Any Polkadot Node RPC' }]}
        >
          <Input 
            prefix={(<CPrefix>RPC URL:</CPrefix>)}
          />
        </CFormItem>

        <CFormItem
          initialValue={initFormData.fromBlockNumber}
          name='fromBlockNumber'
          rules={[{ required: true, message: 'Blocknumber required (<= toBlockNumber)' }]}
        >
          <Input 
            prefix={(<CPrefix>Blocknumber (FROM):</CPrefix>)}
          />
        </CFormItem>

        <CFormItem
          initialValue={initFormData.toBlockNumber}
          name='toBlockNumber'
          rules={[{ required: true, message: 'Blocknumber required (>= fromBlockNumber)' }]}
        >
          <Input 
            prefix={(<CPrefix>Blocknumber (TO):</CPrefix>)}
          />
        </CFormItem>
        {/* {!isEmpty(errorMessage) && ( 
              <ErrorBtn
                disabled
              >
                {errorMessage}
              </ErrorBtn>
        )} */}
        <SearchBtn
          onClick={() => search()}
        >
          {'Search'}
        </SearchBtn>
      </CCard>
    </CForm>


      {/* <BlockByNumber
        value={initData.toBlockNumber}
      /> */}
      {/* Will loop over Blocks gathered from query to map out BlockInfo blocks. */}
      {/* Ensure Progress Bar silliness goes up and back down.
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
    </>
  )
}

export default ExplorerPage;