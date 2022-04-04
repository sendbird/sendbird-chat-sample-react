/**
 * @internal
 */
export interface ReactionEventPayload {
    'msg_id': string | number;
    'user_id': string;
    'operation': string;
    'reaction': string;
    'updated_at': number;
}
export declare enum ReactionEventOperation {
    ADD = "add",
    DELETE = "delete"
}
export default class ReactionEvent {
    readonly messageId: number;
    readonly userId: string;
    readonly key: string;
    readonly operation: ReactionEventOperation;
    readonly updatedAt: number;
    /**
     * @private
     */
    constructor(payload: ReactionEventPayload);
}
