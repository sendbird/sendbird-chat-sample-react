import BaseListQuery, { BaseListQueryParams } from './baseListQuery';
import User from '../model/user';
export interface BlockedUserListQueryParams extends BaseListQueryParams {
    userIdsFilter?: string[];
}
export default class BlockedUserListQuery extends BaseListQuery {
    readonly userIdsFilter: string[];
    /**
     * @private
     */
    constructor(iid: string, params: BlockedUserListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}
