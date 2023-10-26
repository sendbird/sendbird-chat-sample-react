# Friends in a group channel

This code sample with UI components demonstrates how to add, retrieve, or remove friends in a group channel on Sendbird Chat SDK. In a group channel, the `friend` functionality serves as a tool for the current user to mark other channel members as their favorite.

![final_output](https://github.com/sendbird/sendbird-chat-sample-react/assets/104121286/6506bb97-7904-440a-895f-9b83270dbca8)

## Prerequisites

+ Node.js v10.13.0 or later

## How it works

`sb.createFriendListQuery()` creates a query instance for retrieving the list of friends in a group channel. 
``` javascript
const queryParams = { limit: 20 };
const newQuery = sb.createFriendListQuery(queryParams);
const userList = await newQuery.next();
```

and add/delete friends in a group channel by calling the `sb.addFriends()` and `sb.deleteFriends()` methods.
```javascript
await sb.addFriends([userId]);
await sb.deleteFriend(userId);
```

## How to run

Copy and paste the following code into Terminal.

``` bash
npm install
npm start
```
