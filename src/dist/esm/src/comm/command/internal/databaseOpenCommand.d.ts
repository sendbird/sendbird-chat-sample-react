import BaseCommand from '../../../core/command/baseCommand';
/**
 * @internal
 */
export default class DatabaseOpenCommand extends BaseCommand {
    readonly _iid: string;
    readonly userId: string;
    constructor(_iid: string, { userId }: {
        userId: any;
    });
}
