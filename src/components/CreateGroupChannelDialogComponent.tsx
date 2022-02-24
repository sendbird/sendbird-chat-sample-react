import React, {useEffect, useState} from 'react';
import {GroupChannel, SendBirdError, User} from 'sendbird';
import {getUserList} from '../sendbird-actions/SendbirdActions';
import {createGroupChannel} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {createChannelDialogStyle, userItemStyle } from '../styles/styles';

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
      className={userItemStyle}
      onClick={() => onUserSelect(userId)}
    >
      {userId}
    </div>
  );
};

const CreateGroupChannelDialogComponent = (props: CreateChannelDialogProps) => {
  const {
    isDialogOpen,
    createChannel,
  } = props;

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
  const [userIdsToInvite, setUserIdsToInvite] = useState<string[]>([]);

  useEffect(() => {
    if (isDialogOpen) {
      getUserList()
        .then((users: User[]) => setUserList(users))
        .catch((error: SendBirdError) => alert('getUserList error: ' + error))
        .finally(() => setLoading(false));
    }
  }, [isDialogOpen]);

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

  return (
    loading
      ? null
      : <div className={createChannelDialogStyle}>
        {userList.map((user: User, i: number) => (
          <UserItemComponent
            userId={user.userId}
            isSelected={userIdsToInvite.indexOf(user.userId) >= 0}
            onUserSelect={onUserSelect}
            key={i}
          />
        ))}
        <button
          style={{ margin: '10px 20px' }}
          onClick={() => createChannel(userIdsToInvite)}
        >
          Create
        </button>
      </div>
  );
}

type CreateChannelDialogProps = {
  isDialogOpen: boolean,
  createChannel: (userIdsToInvite: string[]) => void;
}

export default CreateGroupChannelDialogComponent;