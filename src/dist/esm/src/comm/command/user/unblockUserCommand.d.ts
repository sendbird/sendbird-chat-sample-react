import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface UnblockUserRequestCommandParams {
    userId: string;
    unblockedUserId: string;
}
/**
 * @internal
 */
export declare class UnblockUserRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId, unblockedUserId }: UnblockUserRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnblockUserResponseCommand extends APIResponseCommand {
}
