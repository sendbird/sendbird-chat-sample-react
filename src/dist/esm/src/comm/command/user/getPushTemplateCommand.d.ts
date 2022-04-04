import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { PushTemplate } from '../../../types';
import { PushTemplatePayload } from '../types';
/**
 * @internal
 */
export interface GetPushTemplateRequestCommandParams {
    userId: string;
}
interface GetPushTemplateResponseCommandPayload {
    name: PushTemplatePayload;
}
/**
 * @internal
 */
export declare class GetPushTemplateRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: GetPushTemplateRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetPushTemplateResponseCommand extends APIResponseCommand {
    name: PushTemplate;
    constructor(_iid: string, payload: GetPushTemplateResponseCommandPayload);
}
export {};
