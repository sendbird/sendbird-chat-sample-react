import BaseCommand from '../../../core/command/baseCommand';
import { ConnectionStateType } from '../../connectionManager/stateType';
/**
 * @internal
 */
export default class ConnectionStateChangeCommand extends BaseCommand {
    readonly stateType: ConnectionStateType;
    constructor({ stateType }: {
        stateType: any;
    });
}
