import type { NextPage } from 'next'
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components'
import useUser from '../../lib/useUser';

const CH3 = styled.h3`text-align: center; padding: 20px 5px;`

const Explorer: NextPage = () => {
  // Authorization Required for Scanner Access

  // Requesting User from client, if not present redirect to Login.
  const { user } = useUser({ redirectTo: '/login', redirectIfFound: false })

  // LOADING...if not Authorized yet
  if (!user || user.isLoggedIn === false) {
    return (<h1>loading...</h1>)
  }

  // POLKASCANNER Scanner Feature.
  return (
    <CH3>EXPLORER</CH3>
  )
}

export default Explorer;