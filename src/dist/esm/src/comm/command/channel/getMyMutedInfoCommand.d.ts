import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface GetMyMutedInfoRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    userId: string;
}
interface GetMyMutedInfoRequestCommandPayload {
    user_id: string;
}
interface GetMyMutedInfoResponseCommandPayload {
    is_muted: boolean;
    start_at: number;
    end_at: number;
    remaining_duration: number;
    description: string;
}
/**
 * @internal
 */
export declare class GetMyMutedInfoRequestCommand extends APIRequestCommand {
    params: GetMyMutedInfoRequestCommandPayload;
    constructor(params: GetMyMutedInfoRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetMyMutedInfoResponseCommand extends APIResponseCommand {
    isMuted: boolean;
    startAt: number;
    endAt: number;
    remainingDuration: number;
    description: string;
    constructor(_iid: string, payload: GetMyMutedInfoResponseCommandPayload);
}
export {};
