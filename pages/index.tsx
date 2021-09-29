import React, { useMemo, useState, useRef, useCallback, useEffect, FC } from 'react'
import styled from 'styled-components'
import Router from 'next/router';
import Image from 'next/image'
import { Input } from 'antd'
import { GetStaticProps } from 'next';
import { isEmpty } from 'lodash'

import { FormItem, Button, Card, FlexBox, Form } from '/ui-components'
import { flexBox, typography } from '/ui-components/utils'

import { fetcher as fetchJson, useDataChanger } from '/lib';
import { useUserAuth } from '/lib';

import { useSetTitle } from '/react-environment/state/modules/application/hooks';
import { naclEncrypt } from '@polkadot/util-crypto';
import { stringToU8a } from '@polkadot/util';
import { getThemeConfig } from 'ui-components/utils';


import polkaLogo from '/public/polkaLogoC.png';


const CForm = styled(Form)`
  & .ant-form-item {
    margin-bottom: 0;
  }
`;

const CInput = styled(Input.Password)`
display: flex;
align-items: center;
padding: 0 24px;
height: ${({ size }) => size === 'large' ? 58 : 32}px;
background: ${getThemeConfig('gray1')};
border: 1px solid ${getThemeConfig('gray1')};
transition: all .2s cubic-bezier(0.0, 0, 0.2, 1);
border-radius: 8px;
background: transparent !important;


input {
  background: transparent !important;
  outline: none;
  box-shadow: none;
  color: ${getThemeConfig('primary', 'text')}
}

${'.ant-form-item-has-error'} & {
  border-color: ${getThemeConfig('error2')};
}

&.focused {
  border-color: ${getThemeConfig('blue1')};
}
`;

const LoginBtn = styled(Button)`  
  margin: 32px auto 0 auto;
  padding: 0 40px;
  width: 320px;`


const ErrorBtn = styled(LoginBtn).attrs({ as: Button })`
  opacity: 0.7;
`;

const CCard = styled(Card)`
  margin: 36px auto;
  width: 560px;
  padding: 36px 24px;
  background: linear-gradient(101.18deg, rgba(255, 255, 255, 0) 1.64%, rgba(255, 255, 255, 0.1) 112.71%) no-repeat border-box padding-box, linear-gradient(rgb(34, 34, 34), rgb(34, 34, 34)) padding-box, linear-gradient(50.94deg, rgba(228, 12, 91, 0) 48.71%, rgba(255, 76, 59, 0.6) 94.76%) border-box rgb(34, 34, 34);`;

interface FormData { password: string; }
interface LoginProps {
  stringu8a_Secret: string;
  stringu8a_Nonce: string;
}

// Called SERVER-SIDE, not client-side! process.env.$VAR is replaced with server logic under the hood. 
export const getStaticProps: GetStaticProps = (context) => {
  const stringu8a_Secret = process.env.SECRET_u8a;
  const stringu8a_Nonce = process.env.NONCE;
  return {
    props: {
      stringu8a_Secret,
      stringu8a_Nonce
    },
  }
}

const envStringU8A_toU8A = (str) => {
  const u8a = new Uint8Array(str.split(',').map(x => +x));
  return u8a;
}

const Login: React.FC<LoginProps> = ({ stringu8a_Secret, stringu8a_Nonce }) => {
  // Grab User, redirect to scanner if Authorized.
  const { isLoggedIn, mutateUser } = useUserAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const setTitle = useSetTitle();
  
  useEffect(() => setTitle('Login'), [setTitle]);
  useEffect(() => {
    if (isLoggedIn) { Router.push('/explorer'); }
  }, [isLoggedIn]);
  
  const [form] = Form.useForm<FormData>();
  const initFormData: FormData = { password: 'communityFirst' };
  const { data, dataRef, update } = useDataChanger<FormData>(initFormData);
  
  const setPasswordValue = useCallback((pass?: string) => {
    const _data = { password: dataRef.current.password };

    _data.password = pass?.toString() || '';

    update(_data);
    form.setFieldsValue(_data);
  }, [dataRef, form, update]);

  async function loginFn() {

    const uint8array_Secret = envStringU8A_toU8A(stringu8a_Secret);
    const uint8array_Nonce = envStringU8A_toU8A(stringu8a_Nonce);

    const passwordPreEncryption = stringToU8a(data.password);
    // Encrypt the password.
    const { encrypted, nonce } = naclEncrypt(passwordPreEncryption, uint8array_Secret, uint8array_Nonce)
    const body = { encrypted: encrypted, nonce: nonce };

    try {
      const { isLoggedIn } = await fetchJson(["/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }]);
      mutateUser(isLoggedIn)
    } catch (error: any) {
      console.error("Failed attempted login: ", error);
      setErrorMessage('Invalid Password. Please try again.');
      setTimeout(() => setErrorMessage(''), 9000)
    }

  };

  const handleValueChange = useCallback((changed: Partial<FormData>) => {
    if (changed.password) {
      setPasswordValue(changed.password);
    }
    update(changed);
  }, [update, setPasswordValue]);

  return (
    <CForm
      form={form}
      onValuesChange={handleValueChange}
    >
      <CCard variant='gradient-border'>
        <FlexBox className='login-logo' justifyContent='center'>
          <Image src={polkaLogo} alt='Polkadot Logo'></Image>
        </FlexBox>
        <FormItem
          initialValue={initFormData.password}
          name='password'
          rules={[{ required: true, message: 'Please Input the App Password!' }]}
        >
          <CInput
            onKeyDownCapture={ (e) => {
              if (e.code.includes('Enter'))
                loginFn();
            }}
          />
        </FormItem>
        {!isEmpty(errorMessage) && ( 
              <ErrorBtn
                disabled
              >
                {errorMessage}
              </ErrorBtn>
        )}
        <LoginBtn
          onClick={() => loginFn()}
        >
          {'Login'}
        </LoginBtn>
      </CCard>
    </CForm>
  );
}

export default Login
