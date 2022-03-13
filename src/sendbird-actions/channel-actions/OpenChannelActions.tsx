import SendBird, {
  OpenChannel,
  SendBirdInstance,
} from 'sendbird';

export const createOpenChannel = async (channelName: string): Promise<OpenChannel> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const openChannelParams = new sb.OpenChannelParams();
  openChannelParams.name = channelName;
  // FIXME: operatorUserIds should be a property not a function.
  // @ts-ignore
  openChannelParams.operatorUserIds = [sb.currentUser.userId];
  const openChannel: OpenChannel = await sb.OpenChannel.createChannel(openChannelParams);
  return openChannel;
}

export const getOpenChannel = async (channelUrl: string): Promise<OpenChannel> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const openChannel: OpenChannel = await sb.OpenChannel.getChannel(channelUrl);
  return openChannel;
}

export const updateOpenChannelName = async (channel: OpenChannel, channelName: string): Promise<OpenChannel> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const openChannelParams = new sb.OpenChannelParams();
  openChannelParams.name = channelName;
  // FIXME: operatorUserIds should be a property not a function.
  // @ts-ignore
  openChannelParams.operatorUserIds = [sb.currentUser.userId];
  const openChannel: OpenChannel = await channel.updateChannel(openChannelParams);
  return openChannel;
}

export const deleteOpenChannel = async (channel: OpenChannel): Promise<Object> => {
  return await channel.delete();
}

export const enterOpenChannel = async (channel: OpenChannel, accessCode?: string): Promise<null> => {
  return await channel.enter();
}

// FIXME: Return type should be void?
export const exitOpenChannel = async (channel: OpenChannel): Promise<null> => {
  return await channel.exit();
}

export const getMyOpenChannels = (limit: number = 20, isInit: boolean = false, urlKeyword: string = ''): Promise<OpenChannel[]> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const openChannelQuery = sb.OpenChannel.createOpenChannelListQuery();
  openChannelQuery.limit = limit;
  openChannelQuery.urlKeyword = urlKeyword;
  return openChannelQuery.next();
}