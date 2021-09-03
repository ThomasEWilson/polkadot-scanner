import type { Header, AccountId } from '@polkadot/types/interfaces';

export interface HeaderExtended extends Header {
    readonly author: AccountId | undefined;
    readonly validators: AccountId[] | undefined;
}