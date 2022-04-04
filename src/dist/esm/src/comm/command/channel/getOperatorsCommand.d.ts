import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
import User, { UserPayload } from '../../../model/user';
/**
 * @internal
 */
export interface GetOperatorsRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    token: string;
    limit: number;
}
interface GetOperatorsRequestCommandPayload {
    token: string;
    limit: number;
}
interface GetOperatorsResponseCommandPayload extends APIResponseCommandPayload {
    operators: UserPayload[];
    next: string;
}
/**
 * @internal
 */
export declare class GetOperatorsRequestCommand extends APIRequestCommand {
    params: GetOperatorsRequestCommandPayload;
    constructor({ channelUrl, channelType, token, limit }: GetOperatorsRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetOperatorsResponseCommand extends APIResponseCommand {
    operators: User[];
    token: string;
    constructor(_iid: string, payload: GetOperatorsResponseCommandPayload);
}
export {};
