# Admin message in a group channel

This sample with UI components demonstrates how to handle [Admin messages](https://sendbird.com/docs/chat/v3/platform-api/message/message-overview#2-message-types) in a group channel on Sendbird Chat SDK for Javascript. Admin messages can be sent through [Sendbird Dashboard](https://dashboard.sendbird.com) or a [Platform API request](https://sendbird.com/docs/chat/v3/platform-api/message/messaging-basics/send-a-message#1-send-a-message), not on the SDK.

## Prerequisites

+ Node.js v10.13.0 or later

## How it works
We can obtain the latest messages through `const messages = await PreviousMessageListQuery.load()` or message manipulation events in `GroupChannelHandler` (`onMessageReceived`, `onMessageUpdated`, `onMessageDeleted`, ...).

ChannelList.js
``` javascript
const PreviousMessageListQueryParams = {};
const PreviousMessageListQuery = _channel.createPreviousMessageListQuery(PreviousMessageListQueryParams);
const messages = await PreviousMessageListQuery.load();
setMessageList(messages);

const channelHandler = new GroupChannelHandler({
  onMessageReceived: (newChannel, message) => {
    if (_channel.url === newChannel.url) {
      setMessageList((currentMessageList) => [...currentMessageList, message]);
    }
  },
  onMessageUpdated: (channel, message) => {
    if (_channel.url === channel.url) {
      setMessageList((currentMessageList) => {
        const index = currentMessageList.findIndex((m) => m.messageId === message.messageId);
        const list = [...currentMessageList];
        list[index] = message;
        return list;
      });
    }
  },
  onMessageDeleted: (channel, messageId) => {
    if (_channel.url === channel.url) {
      setMessageList((currentMessageList) => currentMessageList.filter((m) => m.messageId !== messageId));
    }
  }
});
```

Within messages, there is a `message.messageType` attribute, and if this value is `admin`, we can determine it as an `AdminMessage` and manipulate it accordingly.

MessageList.js
``` javascript
const renderMessageList = messageList.map((msg) => {
    const messageSentByMe = msg.sender?.userId === sb.currentUser.userId;
    const isAdminMessage = msg.messageType === "admin";

    return (
      <div key={msg.messageId} className={`message-item ${isAdminMessage ? 'message-admin' : messageSentByMe ? 'message-from-you' : ''}`}>
        <div className={`message ${isAdminMessage ? 'message-admin' : messageSentByMe ? 'message-from-you' : ''}`}>
          ...
          {(msg.messageType === "user" || isAdminMessage ) && (
            <div>{msg.message}</div>
          )}
          ...          
        </div>
        ...
      </div>
    );
  });
```

## How to run

Copy and paste the following code into Terminal.

``` bash
npm install
npm start
```
