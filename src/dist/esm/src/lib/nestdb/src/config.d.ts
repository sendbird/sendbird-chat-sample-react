interface ConfigParams {
    dbname: string;
    cacheLimit?: number;
    itemSizeLimit?: number;
    blockHashBase?: number;
    blockHashMultiplier?: number;
    blockHashConstant?: number;
    transactionApplyDelay?: number;
    disableLogger?: boolean;
}
export default class Config {
    readonly cacheLimit: number;
    /** @ignore */
    readonly itemSizeLimit: number;
    /** @ignore */
    readonly blockHashBase: number;
    /** @ignore */
    readonly blockHashMultiplier: number;
    /** @ignore */
    readonly blockHashConstant: number;
    /** @ignore */
    readonly transactionApplyDelay: number;
    /** @ignore */
    readonly disableLogger: boolean;
    constructor({ dbname, itemSizeLimit, cacheLimit, blockHashBase, blockHashMultiplier, blockHashConstant, transactionApplyDelay, disableLogger, }: ConfigParams);
    /** @ignore */
    static get(dbname: string): Config;
}
export {};
