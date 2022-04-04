import BaseListQuery, { BaseListQueryParams } from './baseListQuery';
import User from '../model/user';
export interface ApplicationUserListQueryParams extends BaseListQueryParams {
    userIdsFilter?: string[];
    metaDataKeyFilter?: string;
    metaDataValuesFilter?: string[];
    nicknameStartsWithFilter?: string;
}
export default class ApplicationUserListQuery extends BaseListQuery {
    readonly userIdsFilter: string[];
    readonly metaDataKeyFilter: string;
    readonly metaDataValuesFilter: string[];
    readonly nicknameStartsWithFilter: string;
    /**
     * @private
     */
    constructor(iid: string, params: ApplicationUserListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}
