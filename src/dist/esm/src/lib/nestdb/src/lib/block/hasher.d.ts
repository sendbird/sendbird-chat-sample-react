import { BlockKeyHash } from '../../type';
interface HashParams {
    hashFunction: BlockKeyHash;
    base: number;
    multiplier: number;
    constant: number;
}
export declare const hash: (key: string, level: number, params: HashParams) => number;
export {};
