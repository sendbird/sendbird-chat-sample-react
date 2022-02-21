import SendBird, {
  GroupChannel,
  GroupChannelCollection, GroupChannelFilter,
  SendBirdInstance,
} from 'sendbird';

export const createGroupChannelCollection = (): GroupChannelCollection => {
  const sb: SendBirdInstance = SendBird.getInstance();

  // FIXME: enum is not exported in d.ts.
  const channelFetchOrder = sb.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE;
  const groupChannelFilter: GroupChannelFilter = new sb.GroupChannelFilter();
  groupChannelFilter.includeEmpty = true;
  const groupChannelCollection: GroupChannelCollection = sb.GroupChannel.createGroupChannelCollection()
    .setOrder(channelFetchOrder)
    .setLimit(8)
    .setFilter(groupChannelFilter)
    .build();
  return groupChannelCollection;
}

export const fetchChannels = (groupChannelCollection: GroupChannelCollection): Promise<GroupChannel[]> => {
  return groupChannelCollection.loadMore();
}