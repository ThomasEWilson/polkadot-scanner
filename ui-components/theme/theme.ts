/* eslint-disable sort-keys */

import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: 'Montserrat, sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
  },
  colors: {
    gradient1: 'linear-gradient(61.97deg, #FF4C3B -2.84%, #E40C5B 86.13%)',
    background: '#161616',
    primary1: '#FF4C3B',
    primary2: '#E40C5B',
    secondary1: '#1C1C1F',
    secondary2: '#1C1C1F',
    secondary3: '#5A81FF',
    warning: '#E9D45B',
    success: '#87DC69',
    error1: '#EB6E59',
    error2: '#F55167',
    info: '#6695F2',
    gray0: '#222222',
    gray1: '#333333',
    gray2: '#4F4F4F',
    gray3: '#828282',
    gray4: '#BDBDBD',
    gray5: '#E0E0E0',
    gray6: '#F2F2F2',
    gray7: '#FFFFFF',
    gray8: '#1c1c1c',
    gray9: '#2D2D2D',
    gray10: '#4F4F4F',
    table1: '#1c1c1f',
    radioChecked1: 'red',

    white1: '#f2f2f2',

    green1: '#97F463',

    red1: '#E40C5B',

    blue1: '#5A81FF',

    purple1: '#6A0CDC',
    purple10: '#FAF6FE'
  },
  text: {
    primary: '#ffffff',
    second: '#999999'
  },
  shadows: {
    shadow1: '0px 4px 20px 0px #E40C5B05'
  },
  modal: {
    mask: '#4f4f4f',
    background1: '#222222',
    background2: '#1c1c1f',
    border: '#333333',
    divider: '#4f4f4f'
  },
  borderRadius: 24,
  borderRadius1: 24,
  borderRadius2: 12,
  sidebar: {
    background: 'linear-gradient(165.79deg, rgba(255, 76, 59, 0.2) -25%, rgba(255, 76, 59, 0) 65.33%),  #222225',
    active: 'linear-gradient(93.96deg, rgba(255, 76, 59, 0.24) -1.01%, rgba(255, 76, 59, 0) 94.52%)',
    activeBar: 'linear-gradient(61.97deg, #FF4C3B -2.84%, #E40C5B 86.13%)',
    color: '#ffffff'
  }
};
