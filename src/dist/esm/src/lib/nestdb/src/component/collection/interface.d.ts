import { QueryCondition } from '../query/interface';
export declare enum CollectionState {
    INIT = "init",
    READY = "ready",
    CLOSED = "closed"
}
export interface CollectionMetadata {
    keyName: string;
    blockLevel: number;
    blockHashBase: number;
    blockHashMultiplier: number;
    blockHashConstant: number;
    indexes: string[][];
}
export interface CollectionQueryParams {
    where?: QueryCondition;
    index?: string[];
    backward?: boolean;
}
export interface CollectionUpdateParams {
    set?: object | ((item: object) => void);
}
