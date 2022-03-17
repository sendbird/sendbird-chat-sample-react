type SendbirdUserInfo = {
  appId: string,
  userId: string,
  nickname: string,
}

export const SENDBIRD_USER_INFO: SendbirdUserInfo = {
  appId: '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23',
  userId: 'SandBird',
  nickname: 'SandBird',
};

export const KEY_ENTER = 'Enter';

export const UNIDIRECTIONAL_MESSAGE_FETCH_LIMIT = 37;

export const BIDIRECTIONAL_MESSAGE_FETCH_LIMIT = UNIDIRECTIONAL_MESSAGE_FETCH_LIMIT * 2;

export const OPEN_CHANNEL_FETCH_LIMIT = 20;
