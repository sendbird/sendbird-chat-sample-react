# Add and remove an operator in a group channel

This sample with UI components demonstrates how to add and remove an operator in a group channel on Sendbird Chat SDK for JavaScript on React.
Operators are users who can moderate channels by muting or banning users as well as freezing channels. To learn more, see our documentation on operators

## Prerequisites

+ Node.js v10.13.0 or later

## How it works

By using `banUser`/`banUserWithUserId` and `unbanUser`/`unbanUserWithUserId` methods of `GroupChannel`, we can ban and unban a user in a group channel. 

ChannelInformation.js
```javascript
const banUser = async (userId) => {
  if (userId.trim() !== "") {
    await channel.banUserWithUserId(userId);
  }
  setBanUserModalModalOpen(false);
};

const unbanUser = async (userId) => {
  await channel.unbanUserWithUserId(userId);
};

<ConfirmationModal
  isOpen={isBanUserModalOpen}
  onRequestClose={handleBanUserCloseModal}
  onConfirm={banUser}
  title="Ban user"
  message={""}
  isUpdateMessage={true}
/>

<AccordionItem
  Icon={Members}
  title="Ban Users"
  onActionBtnClick={() => setBanUserModalModalOpen(true)}
  actionBtnLabel="Ban User"
>
  {bannedUsers.map((ban) => (
    <div className="member-item" key={ban.userId}>
      {ban.nickname}({ban.userId})
      <Close onClick={() => unbanUser(ban.userId)} className="close-icon"/>
    </div>
  ))}
</AccordionItem>
```

When the user is banned or unbanned, channel event(`onUserBanned`, `onUserUnbanned`) handler is triggered and the `ChannelInformation` component is re-rendered.

ChannelList.js
```javascript
const channelHandler = new GroupChannelHandler({
  onUserBanned: (channel, user) => {
    if (user.userId === sb.currentUser.userId) {
      setChannel(null);
      setChannelHeaderName('');
      setMessageList([]);
      setMembers([]);
    }else if (_channel.url === channel.url) {
      setMembers((currentMemberList) => currentMemberList.filter((m) => m.userId !== user.userId));
      retrieveBannedUsers(_channel).then((bannedUsers) => {
        setBannedUsers(bannedUsers);
      });
    }
  },
  onUserUnbanned: (channel, user) => {
    if (_channel.url === channel.url) {
      retrieveBannedUsers(_channel).then((bannedUsers) => {
        setBannedUsers(bannedUsers);
      });
    }
  },
});
```

## How to run
Copy and paste the following code into Terminal.

``` bash
npm install
npm start
```