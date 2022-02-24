import SendBird, {
  AdminMessage,
  BaseMessageInstance, FileMessage,
  GroupChannel,
  GroupChannelParams,
  SendBirdInstance,
  User, UserMessage,
} from 'sendbird';
import {SENDBIRD_USER_INFO} from '../../constants/constants';
import {isCurrentUser} from '../../utils/userUtils';

export const createGroupChannel = async (userIdsToInvite: string[], accessCode?: string): Promise<GroupChannel> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const groupChannelParams = new sb.GroupChannelParams();
  groupChannelParams.addUserIds(userIdsToInvite);
  groupChannelParams.operatorUserIds = [SENDBIRD_USER_INFO.userId];
  groupChannelParams.accessCode = accessCode ?? '';

  const groupChannel: GroupChannel = await sb.GroupChannel.createChannel(groupChannelParams);
  return groupChannel;
}

export const getGroupChannel = async (channelUrl: string): Promise<GroupChannel> => {
  const sb: SendBirdInstance = SendBird.getInstance();

  const groupChannel: GroupChannel = await sb.GroupChannel.getChannel(channelUrl);
  return groupChannel;
}

export const updateGroupChannel = async (
  channel: GroupChannel,
  groupChannelParams: GroupChannelParams
): Promise<GroupChannel> => {
  const groupChannel: GroupChannel = await channel.updateChannel(groupChannelParams);
  return groupChannel;
}

// FIXME: Return type should be specific.
export const deleteGroupChannel = async (channel: GroupChannel): Promise<Object> => {
  return await channel.delete();
}

export const joinGroupChannel = async (channel: GroupChannel, accessCode?: string): Promise<GroupChannel> => {
  return await channel.join(accessCode);
}

// FIXME: Return type should be void?
export const leaveGroupChannel = async (channel: GroupChannel): Promise<null> => {
  return await channel.leave();
}

export const inviteUsersToGroupChannel = async (channel: GroupChannel, users: User[]): Promise<GroupChannel> => {
  return await channel.invite(users);
}

export const inviteUserIdsToGroupChannel = async (channel: GroupChannel, userIds: string[]): Promise<GroupChannel> => {
  return await channel.inviteWithUserIds(userIds);
}

export const markChannelAsRead = async (channel: GroupChannel): Promise<void> => {
  return await channel.markAsRead();
}

export const getReadReceipt = (channel: GroupChannel, message: UserMessage | FileMessage): number => {
  console.log('## sender: ', message.sender);
  if (message.sender && isCurrentUser(message.sender)) {
    return channel.getUnreadMemberCount(message);
  }
  return 0;
}

