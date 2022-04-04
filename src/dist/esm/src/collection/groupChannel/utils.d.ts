import GroupChannel from '../../model/channel/groupChannel';
import { GroupChannelListOrder } from '../../model/channel/groupChannelListOrder';
export declare const indexOfChannel: (channels: GroupChannel[], channelToFind: GroupChannel) => number;
export declare const placeOfChannel: (channels: GroupChannel[], channelToFind: GroupChannel, order: GroupChannelListOrder) => {
    place: number;
    contains: boolean;
};
/**
 * @internal
 */
export declare const compareByOrder: (channel1: GroupChannel, channel2: GroupChannel, order: GroupChannelListOrder) => number;
