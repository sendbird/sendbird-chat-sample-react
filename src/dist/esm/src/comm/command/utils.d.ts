import { ChannelType } from '../../model/channel/types';
import { MentionType } from '../../model/message/types';
/**
 * @internal
 */
export declare const getChannelApiPathByType: (channelType: ChannelType) => string;
/**
 * @internal
 */
export declare const getReportApiPathByType: (channelType: ChannelType) => string;
/**
 * @internal
 */
export declare const checkIfMentioned: (mentionType: MentionType, mentionedUserIds: string[], userId: string) => boolean;
interface MentionInfo {
    mentionType: MentionType;
    mentionedUserIds: string[];
}
/**
 * @internal
 */
export declare const calculateMentionCountChange: (prev: MentionInfo, curr: MentionInfo, userId: string) => number;
export {};
