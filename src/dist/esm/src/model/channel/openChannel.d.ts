import User, { UserPayload } from '../user';
import BaseChannel, { BaseChannelPayload } from './baseChannel';
import { FileCompat } from '../../types';
import OpenChannelUpdateParams from '../params/openChannelUpdateParams';
import ParticipantListQuery, { ParticipantListQueryParams } from '../../query/participantListQuery';
/**
 * @internal
 */
export interface OpenChannelPayload extends BaseChannelPayload {
    'participant_count'?: number;
    'operators'?: UserPayload[];
}
export default class OpenChannel extends BaseChannel {
    private _lastParticipantCountUpdated;
    participantCount: number;
    operators: User[];
    /**
     * @private
     */
    constructor(_iid: string, payload: OpenChannelPayload);
    /**
     * @private
     */
    static payloadify(obj: OpenChannel): OpenChannelPayload;
    serialize(): object;
    isOperator(userOrUserId: string | User): boolean;
    /**
     * @private
     */
    _updateParticipantCount(count: number, updatedAt: number): boolean;
    createParticipantListQuery(params: ParticipantListQueryParams): ParticipantListQuery;
    refresh(): Promise<OpenChannel>;
    enter(): Promise<void>;
    exit(): Promise<void>;
    updateChannel(params: OpenChannelUpdateParams): Promise<OpenChannel>;
    updateChannelWithOperatorUserIds(name: string, coverUrlOrImageFile: FileCompat | string, data: string, operatorUserIds: string[], customType: string): Promise<OpenChannel>;
    delete(): Promise<void>;
}
