import SendBird, {SendBirdInstance, User} from 'sendbird';
import {SENDBIRD_USER_INFO} from '../constants/constants';

export const createSendbird = (localCacheEnabled: boolean = false) => {
  const sb: SendBirdInstance = new SendBird({
    appId: SENDBIRD_USER_INFO.appId,
    localCacheEnabled,
  });
  return sb;
}

export const connectSendbird = async (): Promise<User> => {
  const sb: SendBirdInstance = SendBird.getInstance();

  await sb.connect(
    SENDBIRD_USER_INFO.userId,
  );
  const sendbirdUser: User = await sb.updateCurrentUserInfo(
    decodeURIComponent(SENDBIRD_USER_INFO.nickname), ''
  );
  return sendbirdUser;
}

export const setupDefaultSendbirdSettings = async (): Promise<void> => {
  const sb: SendBirdInstance = SendBird.getInstance();

  // sb.setErrorFirstCallback(true);
  await sb.updateCurrentUserInfo(SENDBIRD_USER_INFO.nickname, '');
  await sb.setChannelInvitationPreference(true);
}

export const getUserList = async () => {
  const sb: SendBirdInstance = SendBird.getInstance();

  const userQuery = sb.createApplicationUserListQuery();
  userQuery.limit = 15;

  let users: User[] = [];
  if (userQuery.hasNext && !userQuery.isLoading) {
    users = await userQuery.next();
  }
  return users;
}