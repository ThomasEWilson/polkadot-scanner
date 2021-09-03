import styled from 'styled-components';

import { flexBox } from '../utils/flex';

export const Page = styled.main`
  ${flexBox('flex-start', 'stretch', 'row')}
  height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.background};
`;
