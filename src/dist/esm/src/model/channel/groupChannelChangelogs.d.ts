import GroupChannel from './groupChannel';
export default interface GroupChannelChangelogs {
    updatedChannels: GroupChannel[];
    deletedChannelUrls: string[];
    hasMore: boolean;
    token: string;
}
