import {css} from '@emotion/css';

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

export const channelListItemStyle = css`
  display: flex;
  padding: 6px 20px;
  max-width: 200px;
  justify-content: space-between;
`;

export const channelListItemNameStyle = css`
  max-width: 130px;
  width: 100%;
  text-align: left;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    cursor: pointer;
    color: blueviolet;
  }
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
  padding: 10px 0;
  border: solid 1px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

export const chatStyle = css`
  width: calc(100% - 200px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

export const chatBodyStyle = css`
  
`;

export const chatHeaderStyle = css`
  display: flex;
  justify-content: space-between;
`;

export const chatHeaderMenuStyle = css`
  display: flex;
`;

export const messageListStyle = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 0;
`;

export const messageRootStyle = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
  display: inline;
`;

export const messageSentTimeStyle = css`
  cursor: pointer;
  display: inline;
  margin-left: 6px;
  font-size: 12px;
  padding: 2px;

  &:hover {
    color: red;
    opacity: 1;
    fontWeight: 600;
  }
`;

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

export const fileMessageStyle = css`
  display: flex;
`;

export const messageInputStyle = css`
  display: flex;
  padding: 20px;
  border-top: 1px solid #e0e2e5;
  background-color: #fff;
`;

export const textInputStyle = css`
  display: flex;
  font-size: 15px;
  width: 100%;
  height: 38px;
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