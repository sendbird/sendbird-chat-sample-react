import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../../core/command/api/apiResponseCommand';
import User, { UserPayload } from '../../../../model/user';
interface LoadParticipantListRequestCommandParams {
    channelUrl: string;
    token: string;
    limit: number;
}
interface LoadParticipantListRequestCommandPayload {
    token: string;
    limit: number;
}
interface LoadParticipantListResponseCommandPayload extends APIResponseCommandPayload {
    next: string;
    participants: UserPayload[];
}
/**
 * @internal
 */
export declare class LoadParticipantListRequestCommand extends APIRequestCommand {
    params: LoadParticipantListRequestCommandPayload;
    constructor(params: LoadParticipantListRequestCommandParams);
}
/**
 * @internal
 */
export declare class LoadParticipantListResponseCommand extends APIResponseCommand {
    token: string;
    participants: User[];
    constructor(_iid: string, payload: LoadParticipantListResponseCommandPayload);
}
export {};
