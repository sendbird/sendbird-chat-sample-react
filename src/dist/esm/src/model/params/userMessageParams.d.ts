import UserMessage from '../message/userMessage';
import { BaseMessageParamsProperties } from './baseMessageParams';
export declare class UserMessageParamsProperties extends BaseMessageParamsProperties {
    message: string;
    translationTargetLanguages?: string[];
}
export default class UserMessageParams extends UserMessageParamsProperties {
    constructor(props?: UserMessageParamsProperties);
    static fromFailedUserMessage(failedMessage: UserMessage): UserMessageParams;
    validate(): boolean;
}
