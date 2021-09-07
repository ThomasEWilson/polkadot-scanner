import type { NextPage } from 'next'
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components'
import { useUser } from '/react-environment/state/modules/application/hooks';

const CH3 = styled.h3`text-align: center; padding: 20px 5px; color: white; font-size: 10rem;`

const Explorer: NextPage = ({}) => {
  // Authorization Required for Scanner Access

  // Requesting User from client, if not present redirect to Login.
  const isLoggedIn = useUser();


  // POLKASCANNER Scanner Feature.
  return (
    <CH3>EXPLORER</CH3>
  )
}

export default Explorer;