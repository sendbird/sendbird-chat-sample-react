import {useCallback, useState} from 'react';
import ChannelItem from './ChannelItem';
import CreateChannelModal from './CreateChannelModal';
import ConfirmationModal from "./ConfirmationModal";
import {MdOutlineCreateNewFolder, MdOutlineManageAccounts} from 'react-icons/md';
import {GroupChannelHandler} from "@sendbird/chat/groupChannel";

function ChannelList({
                       sb,
                       groupQuery,
                       userId,
                       channel,
                       channelList,
                       setChannel,
                       setChannelHeaderName,
                       setChannelList,
                       setMessageList,
                       setMembers,
                       loadMoreChannelList,
                     }) {
  const [isCreatingChannelModalOpen, setCreatingChannelModalOpen] = useState(false);
  const [isUpdatingUserProfileModalOpen, setUpdatingUserProfileModalOpen] = useState(false);
  const [userNickname, setUserNickname] = useState(sb.currentUser.nickname);

  const handleCreatingChannelOpenModal = () => {
    setCreatingChannelModalOpen(true);
  };

  const handleCreatingChannelCloseModal = () => {
    setCreatingChannelModalOpen(false);
  };

  const handleUpdatingUserProfileOpenModal = () => {
    setUpdatingUserProfileModalOpen(true);
  };

  const handleUpdatingUserProfileCloseModal = () => {
    setUpdatingUserProfileModalOpen(false);
  };

  const handleUpdateNickName = async (nickName) => {
    await sb.updateCurrentUserInfo({nickname: nickName});
    setUserNickname(nickName);
    handleUpdatingUserProfileCloseModal();
  };

  const handleCreateChannel = useCallback(async (channelName, invitedUserIds) => {
    const groupChannelCreateParams = {
      name: channelName ? channelName : 'Group Channel',
      invitedUserIds: invitedUserIds,
      operatorUserIds: [userId]
    };
    await sb.groupChannel.createChannel(groupChannelCreateParams);
  }, [sb, userId]);

  const handleDeleteChannel = useCallback(async (_channel) => {
    await _channel.delete();
    setChannelList(channelList.filter(item => item.url !== _channel.url));
  }, [channelList, setChannelList]);


  const handleLoadChannel = useCallback(async (_channel) => {
    channel && sb.groupChannel.removeGroupChannelHandler(channel.url);
    const PreviousMessageListQueryParams = {};
    const PreviousMessageListQuery = _channel.createPreviousMessageListQuery(PreviousMessageListQueryParams);
    const messages = await PreviousMessageListQuery.load();
    setChannel(_channel);
    setMessageList(messages);
    setMembers(_channel.members);
    setChannelHeaderName(_channel.name);

    const channelHandler = new GroupChannelHandler({
      onMessageReceived: (newChannel, message) => {
        if (_channel.url === newChannel.url) {
          setMessageList((currentMessageList) => [...currentMessageList, message]);
        }
      },
      onMessageUpdated: (channel, message) => {
        if (_channel.url === channel.url) {
          setMessageList((currentMessageList) => {
            const index = currentMessageList.findIndex((m) => m.messageId === message.messageId);
            const list = [...currentMessageList];
            list[index] = message;
            return list;
          });
        }
      },
      onMessageDeleted: (channel, messageId) => {
        if (_channel.url === channel.url) {
          setMessageList((currentMessageList) => currentMessageList.filter((m) => m.messageId !== messageId));
        }
      }
    });

    sb.groupChannel.addGroupChannelHandler(_channel.url, channelHandler);
  }, [channel, sb, setChannel, setChannelHeaderName, setMessageList, setMembers]);

  return (
    <div className="channel-list">
      <div className="header-container"
           style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <h1 className="channel-type">Channel List</h1>
        <div>
          <MdOutlineManageAccounts onClick={handleUpdatingUserProfileOpenModal} size="2em"/>
          <MdOutlineCreateNewFolder onClick={handleCreatingChannelOpenModal} size="2em" style={{marginRight: '16px'}}/>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isUpdatingUserProfileModalOpen}
        onRequestClose={handleUpdatingUserProfileCloseModal}
        onConfirm={handleUpdateNickName}
        title="Update User Nickname"
        message={userNickname}
        isUpdateMessage={true}
      />
      <CreateChannelModal
        sb={sb}
        isOpen={isCreatingChannelModalOpen}
        handleCloseModal={handleCreatingChannelCloseModal}
        handleCreateChannel={handleCreateChannel}
      />
      <div>
        {channelList.map((channel) => (
          <ChannelItem
            key={channel.url}
            channel={channel}
            handleLoadChannel={handleLoadChannel}
            handleDeleteChannel={handleDeleteChannel}
          />
        ))}
      </div>
      {groupQuery.current.hasMore && <button onClick={loadMoreChannelList}>Load More</button>}
    </div>
  );
}

export default ChannelList;