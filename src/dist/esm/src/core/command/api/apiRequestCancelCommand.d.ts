import BaseCommand from '../baseCommand';
/**
 * @internal
 */
export default class APIRequestCancelCommand extends BaseCommand {
    readonly requestId: string;
    constructor(requestId: string);
}
