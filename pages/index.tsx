import React, { useMemo, useState, useRef, useCallback, useEffect, FC } from 'react'
import { Subscription } from 'rxjs';
import styled from 'styled-components'
import {Input} from 'antd'
import Router from 'next/router';
import { GetStaticProps } from 'next';

import { Button, Card, FlexBox, Form } from '/ui-components'
import {flexBox, typography} from '/ui-components/utils'
import { useDataChanger } from '/lib'

import {StoreDispatch } from '/react-environment/state';
import { useDispatch } from 'react-redux';
import { useUser, useSetUser } from '/react-environment/state/modules/application/hooks';

import { FormItem } from '/ui-components/Form'
import { useSetTitle } from '/react-environment/state/modules/application/hooks';
import {
  naclDecrypt,
  naclEncrypt,
} from '@polkadot/util-crypto';
import {
  stringToU8a,
  u8aToString
} from '@polkadot/util';
import {fetcher as fetchJson} from '/lib';

const CForm = styled(Form)`
  margin-top: 60px;

  & .ant-form-item {
    margin-bottom: 0;
  }
`;

const LoginBtn = styled(Button)`  
margin: 32px auto 0 auto;
padding: 0 40px;
width: 320px;`

const Title = styled.div`
  ${flexBox('space-between', 'center')};
  ${typography(14, 17, 500, 'gray4')};
  margin-bottom: 20px;
`;

const ErrorBtn = styled(LoginBtn).attrs({ as: Button })``;

const CCard = styled(Card)`
  margin: 36px auto;
  width: 560px;
  padding: 36px 24px;
  background: linear-gradient(101.18deg, rgba(255, 255, 255, 0) 1.64%, rgba(255, 255, 255, 0.1) 112.71%) no-repeat border-box padding-box, linear-gradient(rgb(34, 34, 34), rgb(34, 34, 34)) padding-box, linear-gradient(50.94deg, rgba(228, 12, 91, 0) 48.71%, rgba(255, 76, 59, 0.6) 94.76%) border-box rgb(34, 34, 34);
`;

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

const Login: React.FC<LoginProps> = ({ stringu8a_Secret, stringu8a_Nonce }) => {
  // Grab User, redirect to scanner if Authorized.
  let isUserAuthenticated = useUser();
  const setUser = useSetUser();
  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    if (isUserAuthenticated) { Router.push('/explorer');}
  }, [dispatch, isUserAuthenticated]);

  const setTitle = useSetTitle();
  useEffect(() => setTitle('Login'), [setTitle]);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm<FormData>();
  const subscription = useRef<Subscription>();
  const [passwd, setPassword] = useState('communityFirst');
  
  const initData: FormData = { password: '' };

  const stringU8A_to_Uint8Array = (str) => {
    const u8a = new Uint8Array(str.split(',').map(x => +x));
    return u8a;
  }

  async function loginFn() {

      const uint8array_Secret = stringU8A_to_Uint8Array(stringu8a_Secret);
      const uint8array_Nonce = stringU8A_to_Uint8Array(stringu8a_Nonce);

      const passwordPreEncryption = stringToU8a(passwd);
      // console.log(passwordPreEncryption);
        // Encrypt the message
      const { encrypted, nonce } = naclEncrypt(passwordPreEncryption, uint8array_Secret, uint8array_Nonce)
      console.log(encrypted,nonce);
      const body = { encrypted: encrypted, nonce: nonce };

      //  Show contents of the encrypted message
      // LOGIN instead of swap, fetchJson IronSessio
      try {
        const { isLoggedIn } = await fetchJson("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        setUser(isLoggedIn)
      } catch (error) {
        console.error("Failed attempted login: ", error);
        setErrorMessage(error.message);
      }

    };

  const handleValueChange = useCallback((changed: Partial<FormData>) => {
    if (changed.password) {
      setPassword(changed.password);
    }
  }, []);


  return (
    <CForm
      form={form}
      onValuesChange={handleValueChange}
    >
      <CCard variant='gradient-border'>
        <FlexBox justifyContent='center'>
          {/* image */}
        </FlexBox>
        <Title>

        </Title>
        <FormItem
          initialValue={passwd}
          name='password'
          rules={[{ required: true, message: 'Please Input the App Password!' }]}
        >
          <Input.Password/>
        </FormItem>

        <Title>
         
        </Title>
        {
          errorMessage
            ? (
              <ErrorBtn>
                {errorMessage}
              </ErrorBtn>
            )
            : (
              <LoginBtn
                onClick={() => loginFn()}
              >
                {'Login'}
              </LoginBtn>
            )
        }
      </CCard>
    </CForm>
  );
}

export default Login
