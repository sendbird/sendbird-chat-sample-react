import SendBird, {
  GroupChannel,
  MessageCollection,
  MessageFilter,
  SendBirdInstance,
} from 'sendbird';

export const createMessageCollection = (groupChannel: GroupChannel): MessageCollection => {
  const sb: SendBirdInstance = SendBird.getInstance();

  const messageFilter: MessageFilter = new sb.MessageFilter();
  const messageFetchLimit = 10;
  const messageCollection: MessageCollection = groupChannel.createMessageCollection()
    .setFilter(messageFilter)
    .setStartingPoint(Date.now())
    .setLimit(messageFetchLimit)
    .build();
  return messageCollection;
}