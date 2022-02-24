type SendbirdUserInfo = {
  appId: string,
  userId: string,
  nickname: string,
}

type SendbirdOptions = {
  apiHost: string,
  wsHost: string,
  authKey?: string,
  secretKey?: string,
}

export const SENDBIRD_USER_INFO: SendbirdUserInfo = {
  appId: '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23',
  userId: 'SandBird',
  nickname: 'SandBird',
};

export const KEY_ENTER = 'Enter';
