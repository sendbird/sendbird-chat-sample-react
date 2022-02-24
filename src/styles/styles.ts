import {css} from '@emotion/css';

export const appRoot = css`
  position: relative;
  text-align: center;
  display: flex;
  height: 100vh;
`;

export const homeStyle = css`
`;

export const sampleListStyle = css`
  padding: 50px 0;
  height: calc(100% - 100px);
  width: 200px;
  border-right: solid 1px;
`;

export const sampleListItemStyle = css`
  padding: 6px 0;
`;

export const sampleListCategoryStyle = css`
  margin: 0;
  padding: 10px 0;
  font-weight: 500;
`;

export const samplePageStyle = css`
  display: flex;
  width: calc(100% - 200px);
  height: 100vh;
`;

export const channelListStyle = css`
  padding: 50px 0;
  border-right: solid 1px;
  height: calc(100% - 100px);
  width: 200px;
`;

export const channelListCategoryStyle = css`
  display: flex;
  width: 200px;
  padding: 10px 0;
  margin: 0;
  font-weight: 500;
  justify-content: center;
`;

export const smallButtonStyle = css`
  display: flex;
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
`

export const channelListItemStyle = css`
  display: flex;
  padding: 6px 20px;
  max-width: 200px;
  justify-content: space-between;
`;

export const channelListItemTitleStyle = css`
  max-width: 130px;
  width: 100%;
  text-align: left;
  &:hover {
    cursor: pointer;
    div:first-child {
      color: blueviolet;
    }
  }
`;

export const channelListItemNameStyle = css`
  width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const channelListItemLastMessageStyle = css`
  width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.5;
  margin-top: 8px;
`;

export const MemberListStyle = css`
  width: 240px;
  height: calc(100% - 20px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 0;
  border-left: black solid 1px;
`;

export const MemberListItemStyle = css`
  text-align: left;
  width: calc(100% - 40px);
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 20px;
`;

export const MemberListCategoryStyle = css`
  text-align: left;
  width: calc(100% - 40px);
  padding: 4px  20px 14px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid black;
  margin-bottom: 6px;
`;

export const UserListCategoryStyle = css`
  text-align: left;
  width: calc(100% - 40px);
  padding: 14px  20px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid black;
  margin-bottom: 6px;
`;

export const DialogButtonContainer = css`
  display: flex;
  border-top: 1px solid black;
  padding: 14px 20px;
  align-items: center;
  justify-content: center;
`;

export const UserListStyle = css`
  text-align: left;
  max-height: 400px;
  overflow-y: auto;
`;

export const userItemStyle = css`
  padding: 6px 20px;
  max-width: 180px;
  &:hover {
    cursor: pointer;
    color: blueviolet;
  }
`;
export const createChannelDialogStyle = css`
  margin: 0 auto;
  border: solid 1px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 400px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  background-color: white;
`;

export const chatStyle = css`
  height: 100vh;
  width: 100%;
`;

export const chatHeaderStyle = css`
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border-bottom: black solid 1px;
`;

export const chatHeaderMenuStyle = css`
  display: flex;
`;

export const ChatBodyStyle = css`
  display: flex;
  height: calc(100% - 61px);
  width: 100%;
`;

export const messageListStyle = css`
  display: flex;
  flex-direction: column;
  height: calc(100% - 101px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 0;
`;

export const messageRootStyle = css`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  margin-bottom: 8px;
  border: 1px solid transparent;
`;

export const messageNickNameStyle = css`
  font-weight: 600;
  color: #673AB7;
  cursor: initial;
  align-items: center;
  display: inline;
  justify-content: flex-start;
  flex-direction: column;
`;

export const messageContentStyle = css`
  text-align: left;
  max-width: 860px;
  word-break: break-all;
`;

export const imageStyle = css`
  margin-top: 12px;
  display: block;
  max-width: 300px;
`;

export const messageSentTimeStyle = css`
  display: inline;
  margin-left: 6px;
  font-size: 12px;
  padding: 2px;
`;

export const messageButtonStyle = css`
  display: inline;
  cursor: pointer;
  opacity: 1;
  fontWeight: 600;
  margin-left: 6px;
  font-size: 12px;
  padding: 2px;
`

export const messageUnreadCountStyle = css`
  vertical-align: middle;
  text-align: center;
  width: 18px;
  height: 18px;
  line-height: 17px;
  margin-left: 8px;
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  -o-border-radius: 50%;
  background: #DC5960;
`;

export const messageInputStyle = css`
  display: flex;
  padding: 20px;
  border-top: 1px solid #e0e2e5;
  background-color: #fff;
  height: 38px;
`;

export const textInputStyle = css`
  display: flex;
  font-size: 15px;
  width: 100%;
  height: 100%;
  padding: 7px 8px 6px 8px;
  box-sizing: border-box;
  border: 1px solid #e0e2e5;
  background-color: #fff;
`;

export const textInputAreaStyle = css`
  width: 100%;
  outline: none;
  border: 0;
  resize: none;
  line-height: 1.4;
  background-color: #fff;
  overflow: hidden;
`;

export const fileInputStyle = css`
  display: flex;
  width: 36px;
  height: 36px;
  border: 1px solid #e0e2e5;
  border-left: 0;
  background-color: #fff;
  cursor: pointer;
  background-image: url(https://dxstmhyqfqr1o.cloudfront.net/web-basic/icon-attach-file-normal.png);
  background-position: center;
  background-size: 20px;
  background-repeat: no-repeat;
`;