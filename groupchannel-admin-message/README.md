# Admin message in a group channel

This sample with UI components demonstrates how to handle [Admin messages](https://sendbird.com/docs/chat/v3/platform-api/message/message-overview#2-message-types) in a group channel on Sendbird Chat SDK for Javascript. Admin messages can be sent through [Sendbird Dashboard](https://dashboard.sendbird.com) or a [Platform API request](https://sendbird.com/docs/chat/v3/platform-api/message/messaging-basics/send-a-message#1-send-a-message), not on the SDK.

![final_output](https://github.com/sendbird/sendbird-chat-sample-react/assets/104121286/af768660-7f8c-4fc9-b874-ca0b8a3543a4)

## Prerequisites

+ Node.js v10.13.0 or later

## How it works
Within messages, there is a `message.messageType` attribute, and if this value is `admin`, we can determine it as an `AdminMessage` and manipulate it accordingly.

[MessageList.js](./src/components/MessageList.js#L45-L74)
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
