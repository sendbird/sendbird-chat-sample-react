import {OpenChannel} from 'sendbird';

export const insertOpenChannelAt = (channels: OpenChannel[], channel: OpenChannel): number => {
  if (channels.length > 0) {
    let start = 0,
      end = channels.length - 1,
      pivot = Math.floor((start + end) / 2);
    while (start < end) {
      const compared = compareOpenChannels(channels[pivot], channel);
      if (compared > 0) {
        end = pivot;
        pivot = Math.floor((start + end) / 2);
      } else if (compared < 0) {
        start = pivot + 1;
        pivot = Math.floor((start + end) / 2);
      } else return pivot;
    }
    return compareOpenChannels(channels[pivot], channel) > 0 ? pivot : pivot + 1;
  }
  return channels.length;
};

export const compareOpenChannels = (channel1: OpenChannel, channel2: OpenChannel): number => {
  let compared: number = channel2.createdAt - channel1.createdAt;
  return compared;
};

export const upsertOpenChannel = (channels: OpenChannel[], channel: OpenChannel): OpenChannel[] => {
  const channelsCopy: OpenChannel[] = [...channels];
  const showingChannelUrls = channelsCopy.map((channel: OpenChannel) => channel.url);
  const index = showingChannelUrls.indexOf(channel.url);
  let insertAt = insertOpenChannelAt(channelsCopy, channel);

  if (index < 0) { // new channel
    channelsCopy.splice(insertAt, 0, channel);
  } else { // existing channel
    if (insertAt === index) {
      channelsCopy[insertAt] = channel;
    } else {
      channelsCopy.splice(index, 1);
      if (index < insertAt) insertAt--;
      channelsCopy.splice(insertAt, 0, channel);
    }
  }
  return channelsCopy;
}

export const deleteOpenChannel = (showingChannels: OpenChannel[], channelToDelete: OpenChannel): OpenChannel[] => {
  const channelsCopy: OpenChannel[] = [...showingChannels];
  const foundAt = channelsCopy.map((channel: OpenChannel) => channel.url).indexOf(channelToDelete.url);
  if (foundAt >= 0) channelsCopy.splice(foundAt, 1);
  return channelsCopy;
}

