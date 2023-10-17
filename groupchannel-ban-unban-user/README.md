# Ban and unban a user in a group channel

This sample with UI components demonstrates how to ban and unban a user in a group channel on Sendbird Chat SDK for JavaScript on React.
Banned users cannot send messages and exit the channel. to the channel. To learn more, see our documentation on [Ban and unban a user users](https://sendbird.com/docs/chat/sdk/v4/javascript/user/moderating-a-user/ban-and-unban-a-user).

## Prerequisites

+ Node.js v10.13.0 or later

## How it works



ChannelInformation.js
```javascript
useEffect(() => {
  const ops = members.filter(member => member.role === 'operator');
  setOperators(ops);
}, [members]);

const addOperator = async (userId) => {
  if (userId.trim() !== "") {
    await channel.addOperators([userId]);
    const updatedOperators = [...operators, members.find(m => m.userId === userId)];
    setOperators(updatedOperators);
  }
  setAddingOperatorModalOpen(false);
};

const removeOperator = async (userId) => {
  await channel.removeOperators([userId]);
  const updatedOperators = operators.filter(op => op.userId !== userId);
  setOperators(updatedOperators);
};

<ConfirmationModal
  isOpen={isAddingOperatorModalOpen}
  onRequestClose={handleAddingOperatorCloseModal}
  onConfirm={addOperator}
  title="Add a operator"
  message={""}
  isUpdateMessage={true}
/>

<AccordionItem
  Icon={Members}
  title="Operators"
  onActionBtnClick={() => setAddingOperatorModalOpen(true)}
  actionBtnLabel="Add Operator"
>
  {operators.map((operator) => (
    <div className="member-item" key={operator.userId}>
      {operator.nickname}({operator.userId})
      <Close onClick={() => removeOperator(operator.userId)} className="close-icon"/>
    </div>
  ))}
</AccordionItem>
```

When the operator status of the member is changed, channel event(`onOperatorUpdated`) handler is triggered and the `ChannelInformation` component is re-rendered.

ChannelList.js
```javascript
const channelHandler = new GroupChannelHandler({
  onOperatorUpdated: (channel) => {
    if (_channel.url === channel.url) {
      setMembers([...channel.members]);
    }
  }
});
```

## How to run
Copy and paste the following code into Terminal.

``` bash
npm install
npm start
```
