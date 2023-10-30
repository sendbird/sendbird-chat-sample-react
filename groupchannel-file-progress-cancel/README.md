# Cancel an in-progress file upload in a group channel

This sample with UI components demonstrates how to cancel an in-progress file upload in a group channel on Sendbird Chat SDK.

## Prerequisites

+ Node.js v10.13.0 or later

## How it works

You can cancel an in-progress file upload by calling `channel.cancelUploadingFileMessage(reqId)`.

When the file uploading status is `pending`, we can get the message instance including the `reqId`.

[MessageInput.js](./src/components/MessageInput.js#L30-L38)
```javascript
channel.sendFileMessage(fileMessageParams)
  .onPending((message) => {
    console.log("pending: ", message);
    setSendFileMessage(message);
  })
  .onSucceeded((message) => {
    setMessageList([...messageList, message]);
    setSendFileMessage(null);
  })  
```

So by using `reqId`, we can cancel the file upload.

[MessageInput.js](./src/components/MessageInput.js#L9-L17)
```javascript
async function handleCancel() {
  const isCanceled = await channel.cancelUploadingFileMessage(sendFileMessage.reqId)
  if (isCanceled) {
    console.log("canceled");
  } else {
    console.log("File already sent");
  }
  setSendFileMessage(null);
}
```

## How to run

Copy and paste the following code into Terminal.

``` bash
npm install
npm start
```
