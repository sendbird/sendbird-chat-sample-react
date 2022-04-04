import ReactionEvent from '../event/reactionEvent';
/**
 * @internal
 */
export interface ReactionPayload {
    'key': string;
    'user_ids': string[];
    'updated_at': number;
}
export default class Reaction {
    private _version;
    readonly key: string;
    readonly userIds: string[];
    updatedAt: number;
    /**
     * @private
     */
    constructor(payload: ReactionPayload);
    get isEmpty(): boolean;
    /**
     * @private
     */
    static payloadify(obj: Reaction): ReactionPayload;
    applyEvent(reactionEvent: ReactionEvent): void;
}
