import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface GetUsersRequestCommandParams {
    limit: number;
    token: string;
    userIdsFilter?: string[];
    metaDataKeyFilter?: string;
    metaDataValuesFilter?: string[];
    nicknameStartsWithFilter?: string;
}
interface GetUsersRequestCommandPayload {
    limit: number;
    token: string;
    user_ids?: string[];
    metadatakey?: string;
    metadatavalues_in?: string[];
    nickname_startswith?: string;
}
interface GetUsersResponseCommandPayload extends APIResponseCommandPayload {
    users: UserPayload[];
    next: string;
}
/**
 * @internal
 */
export declare class GetUsersRequestCommand extends APIRequestCommand {
    params: GetUsersRequestCommandPayload;
    constructor({ limit, token, userIdsFilter, metaDataKeyFilter, metaDataValuesFilter, nicknameStartsWithFilter, }: GetUsersRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetUsersResponseCommand extends APIResponseCommand {
    users: User[];
    next: string;
    constructor(_iid: string, payload: GetUsersResponseCommandPayload);
}
export {};
