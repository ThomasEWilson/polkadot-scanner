export interface BareProps {
    className?: string;
}

export interface SidebarConfig {
    logo?: Element,
    products: ProductItem[],
}

export interface ProductItem {
    icon?: any,
    name: any,
    path: string,
}