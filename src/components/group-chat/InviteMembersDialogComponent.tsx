import React, {useEffect, useState} from 'react';
import {SendBirdError, User} from 'sendbird';
import {getUserList} from '../../sendbird-actions/SendbirdActions';
import {
  DialogStyle, DialogButtonContainer,
  DialogItemStyle,
  DialogItemListCategoryStyle, DialogItemListStyle
} from '../../styles/styles';
import {DialogState} from '../../constants/enums';

type UserItemProps = {
  userId: string,
  isSelected: boolean,
  onUserSelect: (userId: string) => void,
};

const UserItemComponent = (props: UserItemProps) => {
  const {
    userId,
    isSelected,
    onUserSelect,
  } = props;

  return (
    <div
      style={{ color: isSelected ? 'green' : 'black' }}
      className={DialogItemStyle}
      onClick={() => onUserSelect(userId)}
    >
      {userId}
    </div>
  );
};

const InviteMembersDialogComponent = (props: CreateChannelDialogProps) => {
  const {
    dialogState,
    createChannel,
    inviteUsers,
    closeDialog,
  } = props;

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
  const [userIdsToInvite, setUserIdsToInvite] = useState<string[]>([]);

  useEffect(() => {
    if (dialogState !== DialogState.CLOSED) {
      if (userIdsToInvite.length > 0) setUserIdsToInvite([]);
      getUserList()
        .then((users: User[]) => setUserList(users))
        .catch((error: SendBirdError) => alert('getUserList error: ' + error))
        .finally(() => setLoading(false));
    }
  }, [dialogState]);

  const onUserSelect = (selectedUserId: string) => {
    const selectedUsers: string[] = [...userIdsToInvite];
    const foundAt = selectedUsers.indexOf(selectedUserId);
    if (foundAt >= 0) {
      selectedUsers.splice(foundAt, 1);
    } else {
      selectedUsers.push(selectedUserId);
    }
    setUserIdsToInvite(selectedUsers);
  }

  const onDialogSubmit = () => {
    switch (dialogState) {
      case DialogState.CREATE:
        createChannel(userIdsToInvite);
        break;
      case DialogState.INVITE:
        inviteUsers(userIdsToInvite);
        break;
      default:
        return;
    }
  }

  return (
    loading
      ? null
      : <div className={DialogStyle}>
        <div className={DialogItemListCategoryStyle}>
          User List
        </div>
      <div className={DialogItemListStyle}>
        {userList.map((user: User, i: number) => (
          <UserItemComponent
            userId={user.userId}
            isSelected={userIdsToInvite.indexOf(user.userId) >= 0}
            onUserSelect={onUserSelect}
            key={i}
          />
        ))}
      </div>
        <div className={DialogButtonContainer}>
          <button
            style={{ marginRight: '10px' }}
            onClick={onDialogSubmit}
          >
            Submit
          </button>
          <button onClick={closeDialog}>
            Close
          </button>
        </div>
      </div>
  );
}

type CreateChannelDialogProps = {
  dialogState: DialogState,
  createChannel: (userIdsToInvite: string[]) => void;
  inviteUsers: (userIdsToInvite: string[]) => void;
  closeDialog: () => void;
}

export default InviteMembersDialogComponent;