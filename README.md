# Sendbird Chat SDK samples for React

This repository contains code samples in Kotlin, showcasing the key functionalities provided by Sendbird Chat SDK for Javascript. Each sample has a dedicated readme file briefing how the feature works on the code level. To learn more, see our [documentation for Javascript](https://sendbird.com/docs/chat/v4/javascript/overview).

## Prerequisites
+ Node.js v10.13.0 or later

## Sendbird Application ID

To streamline the implementation process, a sample Application ID has been provided for codes in this repository. However, you need a unique Sendbird Application ID to properly initialize the Chat SDK and enable its features in your production application. Sendbird Application ID can be found in the Overview page on [Sendbird Dashboard](https://dashbaord.sendbird.com). To learn more about how and when to use the Application ID, see our documentation on [initialization](https://sendbird.com/docs/chat/v4/android/getting-started/send-first-message#2-get-started-3-step-3-initialize-the-chat-sdk).

## Code samples

Refer to the following list of code samples and their readme files.

- [Group Channel Add Remove Operators](./groupchannel-add-remove-operators/README.md)
- [Group Channel Admin Message](./groupchannel-admin-message/README.md)
- [Group Channel Ban Unban User](./groupchannel-ban-unban-user/README.md)
- [Group Channel Categorize Channels](./groupchannel-categorize-channels/README.md)
- [Group Channel Categorize Messages](./groupchannel-categorize-messages/README.md)
- [Group Channel Dnd Snooze](./groupchannel-dnd-snooze/README.md)
- [Group Channel File Progress Cancel](./groupchannel-file-progress-cancel/README.md)
- [Group Channel Freeze Unfreeze](./groupchannel-freeze-unfreeze/README.md)
- [Group Channel Friends](./groupchannel-friends/README.md)
- [Group Channel Hide Archive](./groupchannel-hide-archive/README.md)
- ...

## Security

When a new Sendbird application is created in [Sendbird Dashboard](https://dashbaord.sendbird.com), the default security settings are set permissive to simplify running samples and implementing your first code.

When launching a production application, make sure to review the security settings beforehand in **Settings > Application > Security** on the dashbaord and set **Access token permission** to **Deny login** because **Read & Write** is not secure and will allow a new user to be automatically created in the SDK if none exists. Ensure that users are authenticated with a Sendbird generated Session Token. Also review the **Access Control** lists. Most apps will want to disable **"Allow retrieving user list"** as that could expose sensitivie information such as usage numbers.
