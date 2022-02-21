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
        const lc1 = channel1.createdAt;
        const lc2 = channel2.createdAt;
        let compared = lc2 - lc1;
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

export const upsertGroupChannel = (channels: GroupChannel[], channel: GroupChannel, order: string): void => {
  const showingChannelUrls = channels.map((channel: GroupChannel) => channel.url);
  const index = showingChannelUrls.indexOf(channel.url);
  let insertAt = insertGroupChannelAt(channels, channel, order);

  if (index < 0) { // new channel
    channels.splice(insertAt, 0, channel);
  } else { // existing channel
    if (insertAt === index) {
      channels[insertAt] = channel;
    } else {
      if (index < insertAt) insertAt--;
      channels.splice(index, 1);
      channels.splice(insertAt, 0, channel);
    }
  }
}