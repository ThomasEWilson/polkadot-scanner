import styled from 'styled-components';
import React, { FC, memo } from 'react';

import { SidebarItem } from './SidebarItem';
import { ProductItem as IProductItem } from './types';

interface ProductItemProps {
  config: IProductItem;
}

interface ProductsProps {
  config: IProductItem[];
}

const ProductItem: FC<ProductItemProps> = memo(({ config }) => {
  return (
    <SidebarItem
      content={config.name}
      icon={config.icon}
      path={config.path ?? '__unset__path'}
    />
  );
});

ProductItem.displayName = 'ProductItem';

const ProductList = styled.div`
  width: 100%;
  flex: 1;
`;

export const Products: FC<ProductsProps> = memo(({ config }) => {
  return (
    <ProductList>
      {
        config.map((item) => (
          <ProductItem
            config={item}
            key={`product-${item.name}`}
          />
        ))
      }
    </ProductList>
  );
});

Products.displayName = 'Products';
