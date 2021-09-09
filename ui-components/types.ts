
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

export type LinkTypes = 'address' | 'block' | 'bounty' | 'council' | 'extrinsic' | 'proposal' | 'referendum' | 'techcomm' | 'tip' | 'treasury';

export interface ExternalDef {
  chains: Record<string, string>;
  isActive: boolean;
  logo: string;
  paths: Partial<Record<LinkTypes, string>>;
  url: string;
  create: (chain: string, path: string, data: number | string, hash?: string) => string;
}