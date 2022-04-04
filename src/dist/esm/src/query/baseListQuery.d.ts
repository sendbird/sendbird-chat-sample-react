export declare const DEFAULT_LIST_QUERY_LIMIT = 20;
export interface BaseListQueryParams {
    limit?: number;
}
export default abstract class BaseListQuery {
    protected readonly _iid: string;
    readonly limit: number;
    protected _isLoading: boolean;
    protected _hasNext: boolean;
    protected _token: string;
    /**
     * @private
     */
    constructor(iid: string, params: BaseListQueryParams);
    get hasNext(): boolean;
    get isLoading(): boolean;
    protected _validate(): boolean;
}
