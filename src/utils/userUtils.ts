import SendBird, {SendBirdInstance, User} from 'sendbird';

export const isCurrentUser = (user: User) => {
  const sb: SendBirdInstance = SendBird.getInstance();
  return user.userId === sb.currentUser.userId;
}