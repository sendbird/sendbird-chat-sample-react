import SendBird, {ApplicationUserListQuery, SendBirdInstance, User} from 'sendbird';
import {SENDBIRD_USER_INFO} from '../constants/constants';

export const createSendbird = (localCacheEnabled: boolean = false) => {
  const sb: SendBirdInstance = new SendBird({
    appId: SENDBIRD_USER_INFO.appId,
    localCacheEnabled,
  });
  return sb;
}

/**
 * Documentation: https://sendbird.com/docs/chat/v3/javascript/guides/logger#2-how-to-configure-the-log-level
 * You can call this before/after creating SendBird instance.
 */
export const setErrorLogLevel = () => {
  SendBird.setLogLevel(SendBird.LogLevel.ERROR);
}

export const connectSendbird = async (): Promise<User> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  return await sb.connect(
    SENDBIRD_USER_INFO.userId,
  );
}

export const setupDefaultSendbirdSettings = async (): Promise<User> => {
  setErrorLogLevel();
  const sb: SendBirdInstance = SendBird.getInstance();
  // You only need to set this once.
  await sb.setChannelInvitationPreference(true);
  const sendbirdUser: User = await sb.updateCurrentUserInfo(
    decodeURIComponent(SENDBIRD_USER_INFO.nickname), ''
  );
  return sendbirdUser;
}

export const createUserListQuery = (limit: number = 15): ApplicationUserListQuery => {
  const sb: SendBirdInstance = SendBird.getInstance();

  const userQuery = sb.createApplicationUserListQuery();
  userQuery.limit = limit;
  return userQuery;
}