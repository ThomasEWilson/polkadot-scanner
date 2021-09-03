import clsx from 'clsx';
import { debounce } from 'lodash';
import React, { cloneElement, FC, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Card, CardProps } from './Card';
import { Controller } from './Controller';
import { BareProps } from './types';
import { createBorderGradient, typography } from './utils';

export interface ScrollCardItemProps extends BareProps {
  key: string | number;
  instance: ReactElement;
}

const Item: FC<ScrollCardItemProps> = ({ className,
  instance }) => {
  return cloneElement(instance, { className: clsx('aca-scroll-card__item', className) });
};

const MIN_PAGE = 0;

const CCard = styled(Card)`
  padding: 20px 24px 30px 24px;

  ${({ theme }) => createBorderGradient(
    'custom',
    theme.colors.gray0,
    'linear-gradient(225deg, rgba(228, 12, 91, 0) 50.6%, rgba(90, 129, 255, 0.52) 76.53%)'
  )};

  overflow: hidden;
`;

const Header = styled(Card.Header)`
  ${typography(20, 24, 500)};
  padding-top: 0;
  padding-bottom: 48px;
`;

const Content = styled(Card.Content)`
  width: 0;
  display: flex;
  flex-wrap: nowrap
`;

const Track = styled.div`
  overflow-y: auto;
  padding-bottom: 8px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 4px;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(31, 45, 61, 0.14);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    height: 4px;
    color: green;
  }
`;

interface ScrollCardProps extends CardProps {
  pageSize?: number;
  children: ReactNode;
  header: ReactNode;
}

export const _ScrollCard: FC<ScrollCardProps> = ({ children, header, pageSize = 4, ...other }) => {
  const $rootRef = useRef<HTMLDivElement>(null);
  const [maxPage, setMaxPage] = useState<number>(MIN_PAGE);
  const currentPageRef = useRef<number>(MIN_PAGE);
  const [page, setPage] = useState<number>(MIN_PAGE);

  const move = useCallback((page: number): void => {
    if (!$rootRef.current) return;

    const $root = $rootRef.current;
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const $container = $rootRef.current.querySelector('.card__content')!;

    setPage(page);

    $container.scrollTo({ left: $root.clientWidth * page });
  }, [$rootRef]);

  const handlePrev = useCallback(() => {
    if (currentPageRef.current <= 0) {
      return;
    }

    currentPageRef.current -= 1;
    move(currentPageRef.current);
  }, [move]);

  const handleNext = useCallback(() => {
    if (currentPageRef.current >= maxPage) {
      return;
    }

    currentPageRef.current += 1;
    move(currentPageRef.current);
  }, [maxPage, move]);

  useEffect(() => {
    if (!$rootRef.current) return;

    const $root = $rootRef.current;
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const $container = $root.querySelector('.card__content')!;

    const inner = debounce((): void => {
      const $rootWidth = $root.clientWidth;
      const $items = $root.querySelectorAll('div');
      const $containerWidth = Array.from($items).reduce((acc, cur) => acc + (cur.clientWidth || 0), 0);
      const page = Math.floor($containerWidth / $rootWidth);

      setMaxPage(page);
    }, 200);

    const reCalculationPage = debounce((): void => {
      const $rootWidth = $root.clientWidth;
      const scrollLeft = $container.scrollLeft;

      let page = MIN_PAGE;

      page = Math.floor(scrollLeft / $rootWidth);

      if (scrollLeft > $rootWidth * Math.floor(scrollLeft / $rootWidth)) {
        page += 1;
      }

      setPage(page);
      currentPageRef.current = page;
    }, 200);

    inner();

    window.addEventListener('resize', inner);
    window.addEventListener('resize', reCalculationPage);
    $container.addEventListener('scroll', reCalculationPage);

    return (): void => {
      window.removeEventListener('resize', inner);
      window.removeEventListener('resize', reCalculationPage);
      $container.removeEventListener('resize', reCalculationPage);
    };
  }, [children, $rootRef, setMaxPage, pageSize, move]);

  return (
    <CCard
      {...other as any}
      ref={$rootRef}
    >
      <Header
        extra={
          <Controller.Group>
            <Controller
              direction='left'
              disabled={page === 0}
              onClick={handlePrev}
            />
            <Controller
              direction='right'
              disabled={page === maxPage}
              onClick={handleNext}
            />
          </Controller.Group>
        }
        title={header}
      />
      <Track className='card__content'>
        <Content>
          {children}
        </Content>
      </Track>
    </CCard>
  );
};

type ScrollCardType = FC<ScrollCardProps> & { Item: typeof Item };

const ScrollCard = _ScrollCard as ScrollCardType;

ScrollCard.Item = Item;

export { ScrollCard };
