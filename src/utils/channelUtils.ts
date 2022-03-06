import {BaseChannel, GroupChannel, Member} from 'sendbird';

export const updateCurrentChannel = (
  updatedChannels: BaseChannel[],
  currentChannel: BaseChannel,
): BaseChannel | null => {
  const updatedChannelUrls: string[] = updatedChannels.map((channel: BaseChannel) => channel.url);
  const index = updatedChannelUrls.indexOf(currentChannel.url);
  if (index >= 0) return updatedChannels[index];
  return null;
}

export const isCurrentChannelDeleted = (deletedChannelUrls: string[], currentChannel: BaseChannel): boolean => {
  if (currentChannel && deletedChannelUrls.indexOf(currentChannel.url) >= 0) {
    return true;
  }
  return false;
}

export const getGroupChannelTitle = (groupChannel: GroupChannel): string => {
  return groupChannel.members.map((member: Member) => member.nickname).join(', ');
}