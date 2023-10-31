# Categorize messages in a group channel

This code sample with UI components demonstrates how to categorize messages in a group channel using customType on Sendbird Chat SDK for React. You can use the customType value as a filter when getting messages.

![final_output](https://github.com/sendbird/sendbird-chat-sample-react/assets/104121286/89751c04-26a3-4081-8f7b-4dc971a24312)

## Prerequisites

+ Node.js v10.13.0 or later

## How it works

By using `customTypesFilter` property of `MessageFilter`, we can categorize group channel messages.

When the user adds a new `customTypeFilter`, reset the messageCollection with updated `customTypeFilter` and messageCollection will update the filtered messages.

[Chat.js](./src/pages/Chat.js#L33-L51)
```javascript
const filter = new MessageFilter();
filter.customTypesFilter = [...customTypesFilter, customType]
const limit = 20;
const startingPoint = Date.now();
const collection = channel.createMessageCollection({
  filter,
  limit,
  startingPoint,
});
collection
  .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
  .onCacheResult((err, messages) => {
    setMessageList(messages.reverse());
  })
  .onApiResult((err, messages) => {
    setMessageList(messages.reverse());
  });

setMessageCollection(collection);
```

User can update the message's `customType` by using `updateUserMessage` or `updateFileMessage` method.

[MessageList.js](./src/components/MessageList.js#L34-L39)
```javascript
const confirmUpdate = async (newMessage, newCustomType) => {
  await channel.updateUserMessage(currentMsg.messageId, { message: newMessage, customType: newCustomType });
  setModalOpen(false);
  currentMsg.message = newMessage;
  currentMsg.customType = newCustomType;
};
```

## How to run
Copy and paste the following code into Terminal.

``` bash
npm install
npm start
```
