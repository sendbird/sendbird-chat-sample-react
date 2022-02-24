import React, {useEffect, useState} from 'react';
import {BaseChannel, GroupChannel, SendBirdError, User} from 'sendbird';
import {getUserList} from '../sendbird-actions/SendbirdActions';
import {createGroupChannel} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {createChannelDialogStyle, userItemStyle } from '../styles/styles';
import { CREATE_CHANNEL_DIALOG_STATE } from './MainComponent';

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
      className={userItemStyle}
      style={{ borderColor: isSelected ? 'green' : 'black' }}
      onClick={() => onUserSelect(userId)}
    >
      {userId}
    </div>
  );
};

const CreateGroupChannelDialogComponent = (props: CreateChannelDialogProps) => {
  const {
    setCurrentChannel,
    setIsDialogOpen,
  } = props;

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
  const [userIdsToInvite, setUserIdsToInvite] = useState<string[]>([]);

  useEffect(() => {
    getUserList()
      .then((users: User[]) => setUserList(users))
      .catch((error: SendBirdError) => alert('getUserList error: ' + error))
      .finally(() => setLoading(false));
  }, []);

  const onUserSelect = (selectedUserId: string) => {
    setUserIdsToInvite([...userIdsToInvite, selectedUserId]);
  }

  const createChannel = async () => {
    try {
      const groupChannel: GroupChannel = await createGroupChannel(userIdsToInvite);
      setCurrentChannel(groupChannel);
    } catch (e) {
      alert('Create open channel error: ' + e);
    } finally {
      setIsDialogOpen(false);
    }
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
        <button onClick={createChannel}>
          Create
        </button>
      </div>
  );
}

type CreateChannelDialogProps = {
  setCurrentChannel: (channel: GroupChannel) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export default CreateGroupChannelDialogComponent;