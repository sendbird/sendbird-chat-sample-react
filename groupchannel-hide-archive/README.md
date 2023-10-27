# Hide a group channel

This code sample with UI components demonstrates how to hide a group channel on Sendbird Chat SDK. The SDK provides an additional set of functionalities such as unhide, auto-unhide,
and archive. To learn more, see [our documentation](https://sendbird.com/docs/chat/sdk/v4/javascript/channel/managing-channels/hide-or-archive-a-group-channel-from-a-list-of-channels) on the feature.

## Prerequisites

+ Node.js v10.13.0 or later

## How it works
You can set a filter to control which channels are displayed in the channel list. `hiddenChannelFilter` in GroupChannelFilter is a filter that allows you to display only unhidden/hidden/archived channels in the channel list.
When you set it with `HiddenChannelFilter.UNHIDDEN`, only UNHIDDEN channels are displayed in the channel list.
When you set it with `HiddenChannelFilter.HIDDEN_PREVENT_AUTO_UNHIDE`, only archived channels are displayed in the channel list.
When you set it with `HiddenChannelFilter.HIDDEN_ALLOW_AUTO_UNHIDE`, only hidden channels are displayed in the channel list.

Chat.js
``` javascript
const handleAddingCustomTypeChannel = async (filterType) => {
  if (filterType === 'ARCHIVED') {
    setChannelFilter(HiddenChannelFilter.HIDDEN_PREVENT_AUTO_UNHIDE);
  } else if (filterType === 'HIDDEN') {
    setChannelFilter(HiddenChannelFilter.HIDDEN_ALLOW_AUTO_UNHIDE);
  } else {
    setChannelFilter(HiddenChannelFilter.UNHIDDEN);
  }
  handleChannelFilterCloseModal();
};

...

const groupChannelFilter = new GroupChannelFilter();
groupChannelFilter.includeEmpty = true;
groupChannelFilter.hiddenChannelFilter = channelFilter;

const localGroupQuery = sb.groupChannel.createGroupChannelCollection({
  filter: groupChannelFilter,
  order: GroupChannelListOrder.CHRONOLOGICAL,
  limit: 10,
});
```

Hide a channel

ChannelInformation.js
``` javascript
await channel.hide({
  hidePreviousMessages: false,
  allowAutoUnhide: true,
})
```

Archive a channel

ChannelInformation.js
``` javascript
await channel.hide({
  hidePreviousMessages: false,
  allowAutoUnhide: false,
})
```

Unhide a channel

ChannelInformation.js
``` javascript
await channel.unhide();
```

## How to run

Copy and paste the following code into Terminal.

``` bash
npm install
npm start
```
