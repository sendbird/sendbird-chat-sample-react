import BaseCommand from '../../../core/command/baseCommand';
/**
 * @internal
 */
export interface SubscribedUnreadMessageCountUpdateCommandPayload {
    all: number;
    custom_types: {
        [customType: string]: number;
    };
    ts: number;
}
/**
 * @internal
 */
export default class SubscribedUnreadMessageCountUpdateCommand extends BaseCommand {
    readonly all: number;
    readonly customTypes: {
        [customType: string]: number;
    };
    readonly ts: number;
    constructor({ all, custom_types, ts }: SubscribedUnreadMessageCountUpdateCommandPayload);
}
