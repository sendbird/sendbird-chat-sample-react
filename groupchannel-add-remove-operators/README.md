# Basic in a group channel

This sample with UI components demonstrates how to basic in a group channel on Sendbird Chat SDK for JavaScript on React.
Operators are users who can moderate channels by muting or banning users as well as freezing channels. To learn more, see our documentation on operators

## Prerequisites

+ Node.js v10.13.0 or later

## How it works

`channel.addOperators` and `channel.removeOperators` are used to add and remove operators in a group channel. 

`switchOperatorStatus` is a function that checks if the member is an operator.
If the member is already an operator, remove them(`channel.removeOperators`). Otherwise, add them(`channel.addOperators`) as an operator.

And Render the operator status of the member in the `MemberList` component.

MemberList.js
```javascript
const switchOperatorStatus = async (member) => {
  if (isOperator(member)) {
    // If the member is already an operator, remove them
    await channel.removeOperators([member.userId]);
  } else {
    // Otherwise, add them as an operator
    await channel.addOperators([member.userId]);
  }
};

const isOperator = (member) => {
  return member.role === 'operator';
};

<div className="members-list">
  {members.map((member) => (
    <div
      className="member-item"
      key={member.userId}
      onClick={() => toggleOperatorStatus(member)}
    >
      {isOperator(member) ? <GrUserAdmin style={{paddingRight: 10}}/> : ''} {member.nickname}({member.userId})
    </div>
  ))}
</div>
```

When the operator status of the member is changed, channel event(`onOperatorUpdated`) handler is triggered and the `MemberList` component is re-rendered.

ChannelList.js
```javascript
const channelHandler = new GroupChannelHandler({
  ...
  onOperatorUpdated: (channel) => {
    if (_channel.url === channel.url) {
      setMembers([...channel.members]);
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
