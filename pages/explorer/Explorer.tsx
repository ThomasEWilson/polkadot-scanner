import React, { useEffect, useRef, useState, FC, useCallback } from 'react';
import BN from 'bn.js';
import styled from 'styled-components'

import {default as BlocksByNumberRange} from './block-info/ByHash';
import { useIdleTimer } from 'react-idle-timer'
import { useDataChanger, useBestNumber, useNumberRule, useRPCRule, useIsMountedRef } from '/lib';
import { useSetTitle } from '/react-environment/state/modules/application/hooks';
import { Button, Card, FlexBox, Form, FormItem, Input } from '/ui-components'
import { flexBox, typography } from '/ui-components/utils'
import { isEmpty, isNumber } from 'lodash';
import { BlockNumber } from '@polkadot/types/interfaces';


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

interface BlockNumberProps {
  from: BlockNumber | BN;
  to: BlockNumber | BN;
}

const ExplorerPage: FC = () => {
  const setTitle = useSetTitle();
  useEffect(() => setTitle('Polkadot Block-Range Explorer'), [setTitle]);

  const currentBestNumber = useBestNumber();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm<FormData>();
  const [isSearching, setSearching] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<BlockNumberProps | null>(null);
  const mountedRef = useIsMountedRef();
  
  const initFormData: FormData = {
    rpcUrl: 'wss://rpc.polkadot.io',
    fromBlockNumber: 6829987,
    toBlockNumber: 6829988 
  };

  const { data, dataRef, update } = useDataChanger<FormData>(initFormData);
  const requiredFlag = useRef<boolean>(true);

  const fromBlockRules = useNumberRule({
    required: () => requiredFlag.current,
    requiredMessage: `Blocknumber required (+int <= toBlockNumber)`,
    min: 0,
    minMessage: 'Must be greater than zero',
    max: dataRef?.current?.toBlockNumber ?? currentBestNumber?.toNumber() ?? 6829988,
    maxMessage: 'Must be less than (<) BlockNumber (TO) - 1'
  });
  const toBlockRules = useNumberRule({
    required: () => requiredFlag.current,
    requiredMessage: `Blocknumber required (+int >= fromBlockNumber)`,
    min: dataRef?.current?.fromBlockNumber ?? 0,
    minMessage: 'Must be greater than fromBlockNumber',
    max: currentBestNumber?.toNumber() ?? 6829988,
    maxMessage: 'Must be lessthan or equal (<=) current Block Number'
  });

  const rpcRules = useRPCRule({
    required: () => requiredFlag.current
  });

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

  const handlePreCheck = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (e) {
      return false;
    }
    return true;
  }, [form]);

  //   Action on search
  const search = async () => {

      if (await handlePreCheck()
            && isNumber(data.fromBlockNumber) && isNumber(data.toBlockNumber)) {
        setErrorMessage(``);
        setSearching(true);
        const from = new BN(data.fromBlockNumber) as BlockNumber;
        const to = new BN(data.toBlockNumber) as BlockNumber;
        setSearchParams({from, to} as BlockNumberProps);
      } else
          setErrorMessage(`Search struggles.. - kindly \nuse positive integers or simply go idle for defaults.`);
  }

  const reset = () => {
    setSearchParams(null);
    setSearching(false);
    setErrorMessage(``);
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
    timeout: 1000 * 20,
    onIdle: handleOnIdle,
    onActive: handleOnActive
  })
  const idleRef = useRef<boolean>(isIdle());

  // IDLE SIDE EFFECT UPDATER
  useEffect(() => {
    const updateIdleRef = () => {
        idleRef.current = isIdle();
    }
    updateIdleRef();
  }, [isIdle, idleRef])
     // Initialize Inputs with API Values
  useEffect(() => {
    const updateFields = () => {
      if ( idleRef.current || (1000 > 100/Math.random())) {
        const _bestNumber = currentBestNumber?.toNumber() ?? 6829988;
        update({
          fromBlockNumber: _bestNumber - 1,
          toBlockNumber: _bestNumber
        });
    
        form.setFieldsValue({
          fromBlockNumber: _bestNumber - 1,
          toBlockNumber: _bestNumber
        });
      }
    }
    mountedRef.current && updateFields()
  }, [mountedRef, currentBestNumber, idleRef, update, form]);

  return (
    <>
    <CForm
      form={form}
      onValuesChange={handleValueChange}
    >
      <CCard variant='gradient-border'>
        <CFormItem
          initialValue={initFormData.rpcUrl}
          name='rpcUrl'
          // rules={rpcRules}
        >
          <Input 
            prefix={(<CPrefix>RPC URL:</CPrefix>)}
          />
        </CFormItem>

        <CFormItem
          initialValue={initFormData.fromBlockNumber}
          name='fromBlockNumber'
          rules={fromBlockRules}
        >
          <Input 
            prefix={(<CPrefix>Blocknumber (FROM):</CPrefix>)}
          />
        </CFormItem>

        <CFormItem
          initialValue={initFormData.toBlockNumber}
          name='toBlockNumber'
          rules={toBlockRules}
        >
          <Input 
            prefix={(<CPrefix>Blocknumber (TO):</CPrefix>)}
          />
        </CFormItem>
        {!isEmpty(errorMessage) && ( 
              <ErrorBtn
                disabled
              >
                {errorMessage}
              </ErrorBtn>
        )}
        <SearchBtn
          onClick={() => search()}
        >
          {'Search'}
          
        </SearchBtn>
      </CCard>
    </CForm>
        { isSearching && searchParams &&
            <BlocksByNumberRange
              // error={error}
              searchProps={searchParams}
          />
        }
    </>
  )
}

export default ExplorerPage;