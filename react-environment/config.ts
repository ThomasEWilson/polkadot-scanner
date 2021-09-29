import { SidebarConfig } from '/ui-components/types';
import ApplicationConfig from '../react-environment/types'


export const config: ApplicationConfig = {
  endpoints: {
    'url': 'wss://rpc.polkadot.io',
  },
  name: 'Polkascanner Challenge',
  subscanBaseUrl: 'https://polkadot.subscan.io/',
};
// 

export const sidebarConfig: SidebarConfig = {
  //   logo: <LogoContainer><Logo /></LogoContainer>,
  products: [
    {
      icon: '',
      name: 'Login',
      path: '/'
    },
    {
      icon: '',
      name: 'Explorer',
      path: 'explorer'
    }
  ]
};