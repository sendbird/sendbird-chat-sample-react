import SendBird, {GroupChannel, SendBirdInstance} from 'sendbird';

export const insertGroupChannelAt = (channels: GroupChannel[], channel: GroupChannel, order: string): number => {
  if (channels.length > 0) {
    let start = 0,
      end = channels.length - 1,
      pivot = Math.floor((start + end) / 2);

    while (start < end) {
      const compared = compareGroupChannelByOrder(channels[pivot], channel, order);
      if (compared > 0) {
        end = pivot;
        pivot = Math.floor((start + end) / 2);
      } else if (compared < 0) {
        start = pivot + 1;
        pivot = Math.floor((start + end) / 2);
      } else return pivot;
    }
    return compareGroupChannelByOrder(channels[pivot], channel, order) > 0 ? pivot : pivot + 1;
  }
  return channels.length;
};

export const compareGroupChannelByOrder = (channel1: GroupChannel, channel2: GroupChannel, order: string): number => {
  const sb: SendBirdInstance = SendBird.getInstance();
  let compared: number = channel2.createdAt - channel1.createdAt;

  switch (order) {
    case sb.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE: {
      if (channel1.lastMessage && !channel2.lastMessage) {
        return -1;
      } else if (!channel1.lastMessage && channel2.lastMessage) {
        return 1;
      } else if (channel1.lastMessage && channel2.lastMessage) {
        const lc1 = channel1.lastMessage.createdAt;
        const lc2 = channel2.lastMessage.createdAt;
        compared = lc2 - lc1;
        if (compared === 0) {
          const ca1 = channel1.createdAt;
          const ca2 = channel2.createdAt;
          compared = ca2 - ca1;
        }
        return compared;
      } else {
        return compared;
      }
    }

    case sb.GroupChannelCollection.GroupChannelOrder.CHANNEL_NAME_ALPHABETICAL: {
      compared = channel1.name.localeCompare(channel2.name);
      return compared;
    }

    case sb.GroupChannelCollection.GroupChannelOrder.CHRONOLOGICAL:
    default:
      return compared;
  }
};

export const upsertGroupChannels = (showingChannels: GroupChannel[], channelsToUpsert: GroupChannel[], order: string): GroupChannel[] => {
  const channelsCopy: GroupChannel[] = [...showingChannels];
  for (let i = 0; i < channelsToUpsert.length; i++) {
    const channel = channelsToUpsert[i];
    upsertGroupChannel(channelsCopy, channel as GroupChannel, order);
  }
  return channelsCopy;
}

export const upsertGroupChannel = (channels: GroupChannel[], channel: GroupChannel, order: string): void => {
  const showingChannelUrls = channels.map((channel: GroupChannel) => channel.url);
  const index = showingChannelUrls.indexOf(channel.url);
  if (index >= 0) channels.splice(index, 1);
  let insertAt = insertGroupChannelAt(channels, channel, order);
  channels.splice(insertAt, 0, channel);
}

export const deleteGroupChannels = (showingChannels: GroupChannel[], channelUrls: string[]): GroupChannel[] => {
  const channelUrlsToDelete: string[] = [...channelUrls];
  let updatedChannelList: GroupChannel[] = [];
  const numChannels = showingChannels.length;

  let i = 0;
  while (channelUrlsToDelete.length > 0 && i < numChannels) {
    const currentChannel: GroupChannel = showingChannels[i];
    const foundAt = channelUrlsToDelete.indexOf(currentChannel.url);
    if (foundAt >= 0) {
      channelUrlsToDelete.splice(foundAt, 1);
    } else {
      updatedChannelList.push(currentChannel);
    }
    i++;
  }
  if (i < showingChannels.length) updatedChannelList = updatedChannelList.concat(showingChannels.slice(i));
  return updatedChannelList;
}
