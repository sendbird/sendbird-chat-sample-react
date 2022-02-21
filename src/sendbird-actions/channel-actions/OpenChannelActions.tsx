import SendBird, {
  OpenChannel,
  OpenChannelParams,
  SendBirdInstance,
} from 'sendbird';

export const createOpenChannel = async (channelName: string): Promise<OpenChannel> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const openChannelParams = new sb.OpenChannelParams();
  openChannelParams.name = channelName;

  const openChannel: OpenChannel = await sb.OpenChannel.createChannel(openChannelParams);
  return openChannel;
}

export const getOpenChannel = async (channelUrl: string): Promise<OpenChannel> => {
  const sb: SendBirdInstance = SendBird.getInstance();

  const openChannel: OpenChannel = await sb.OpenChannel.getChannel(channelUrl);
  return openChannel;
}

export const updateOpenChannel = async (
  channel: OpenChannel,
  openChannelParams: OpenChannelParams
): Promise<OpenChannel> => {
  const openChannel: OpenChannel = await channel.updateChannel(openChannelParams);
  return openChannel;
}

// FIXME: Return type should be specific.
export const deleteOpenChannel = async (channel: OpenChannel): Promise<Object> => {
  return await channel.delete();
}

// FIXME: Group channel is join() and returns groupChannel.
export const enterOpenChannel = async (channel: OpenChannel, accessCode?: string): Promise<null> => {
  return await channel.enter();
}

// FIXME: Return type should be void?
export const exitOpenChannel = async (channel: OpenChannel): Promise<null> => {
  return await channel.exit();
}