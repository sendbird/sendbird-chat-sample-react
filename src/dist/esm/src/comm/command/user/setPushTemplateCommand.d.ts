import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { PushTemplate } from '../../../types';
import { PushTemplatePayload } from '../types';
/**
 * @internal
 */
export interface SetPushTemplateRequestCommandParams {
    userId: string;
    templateName: PushTemplate;
}
interface SetPushTemplateRequestCommandPayload {
    name: PushTemplatePayload;
}
interface SetPushTemplateResponseCommandPayload {
    name: PushTemplatePayload;
}
/**
 * @internal
 */
export declare class SetPushTemplateRequestCommand extends APIRequestCommand {
    params: SetPushTemplateRequestCommandPayload;
    constructor({ userId, templateName }: SetPushTemplateRequestCommandParams);
}
/**
 * @internal
 */
export declare class SetPushTemplateResponseCommand extends APIResponseCommand {
    name: PushTemplate;
    constructor(_iid: string, payload: SetPushTemplateResponseCommandPayload);
}
export {};
