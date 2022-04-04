import BaseListQuery, { BaseListQueryParams } from './baseListQuery';
import User from '../model/user';
export interface FriendListQueryParams extends BaseListQueryParams {
}
export default class FriendListQuery extends BaseListQuery {
    protected _validate(): boolean;
    next(): Promise<User[]>;
}
