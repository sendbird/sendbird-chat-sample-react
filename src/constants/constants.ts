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
  appId: 'C4326D35-C1B2-4A6A-BA4A-F3A4882EA501',
  userId: 'SandBird',
  nickname: 'SandBird',
};

export const SENDBIRD_OPTIONS: SendbirdOptions = {
  apiHost: 'https://api-staging.sendbird.com',
  wsHost: 'wss://ws-staging.sendbird.com',
  authKey: 'Basic MTIzNDU2Nzg5MEB0ZXN0LXNlbmRiaXJkLmNvbTpFUmM2VGt3RzdpKkxHeCEzVSFwWXFtQlF2dWQyekR3c2MtSmhYQyohNGtZd' +
    'DghYnN1WnpfZXRqbVdlb2hkQEhG=',
  secretKey: 'dlwlrma0516,imtei0528<3!!',
};

export const KEY_ENTER = 'Enter';
