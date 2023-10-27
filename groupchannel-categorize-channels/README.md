# Categorize group channels

This sample app demonstrates how to categorize group channels in Sendbird Chat SDK using `customType`.

## Prerequisites

+ Node.js v10.13.0 or later

## How it works

By using `customType` property of `GroupChannelParams`, we can categorize group channels.

[Chat.js](./src/pages/Chat.js#L33-L57)
```javascript
const groupQuery = useRef(null);

...

const groupChannelFilter = new GroupChannelFilter();
groupChannelFilter.includeEmpty = true;
groupChannelFilter.customTypesFilter = customTypeChannelList;

const localGroupQuery = sb.groupChannel.createGroupChannelCollection({
  filter: groupChannelFilter,
  order: GroupChannelListOrder.CHRONOLOGICAL,
  limit: 10
});

groupQuery.current = localGroupQuery;

...

const retrieveChannelList = useCallback(async () => {
  if (groupQuery.current && groupQuery.current.hasMore) {
    return await groupQuery.current.loadMore();
  } else {
    return [];
  }
}, [groupQuery]);

```

## How to run

Copy and paste the following code into Terminal.

``` bash
npm install
npm start
```
