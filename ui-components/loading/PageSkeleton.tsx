import { Skeleton } from 'antd';
import styled from 'styled-components';

export const PageContentSkeleton = styled(Skeleton).attrs({
  active: true,
  paragraph: { rows: 1 },
  title: false
})`
  & li {
    width: 100% !important;
    height: calc(100vh - 60px - 64px - 30px) !important;
    border-radius: 16px;
  }
`;
