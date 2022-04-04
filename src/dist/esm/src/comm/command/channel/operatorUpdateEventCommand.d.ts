import User, { UserPayload } from '../../../model/user';
import { ChannelEventCommand, ChannelEventCommandPayload } from './channelEventCommand';
/**
 * @internal
 */
export interface OperatorUpdateEventParams extends ChannelEventCommandPayload {
    data: {
        operators: UserPayload[];
    };
}
/**
 * @internal
 */
export declare class OperatorUpdateEventCommand extends ChannelEventCommand {
    readonly operators: User[];
    constructor(_iid: string, code: string, payload: OperatorUpdateEventParams);
}
