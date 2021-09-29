import type { NextPage } from 'next'
import React from 'react';
import { default as ExplorerPage } from './Explorer';
import withSession from '/lib/session'


export const getServerSideProps = withSession(async function ({ req, res }) {
  // Get the user's session based on the request
  const user = req.session.get('user')

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { user },
  }
})

const Explorer: NextPage = ({ }) => {   

  return (<ExplorerPage/>)
}

export default Explorer;