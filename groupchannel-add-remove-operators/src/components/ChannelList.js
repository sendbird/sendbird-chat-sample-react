import React, {useCallback, useEffect, useRef, useState} from 'react';
import ChannelItem from './ChannelItem';
import CreateChannelModal from './CreateChannelModal';
import ConfirmationModal from "./ConfirmationModal";
import Avatar from "./Avatar";
import {ReactComponent as Channel} from "../assets/sendbird-icon-channel.svg";
import {ReactComponent as Create} from "../assets/sendbird-icon-create.svg";
import {GroupChannelHandler, MessageCollectionInitPolicy, MessageFilter} from "@sendbird/chat/groupChannel";
import '../styles/ChannelList.css';

function ChannelList({
                       sb, groupQuery, userId, channel, channelList, setChannel, setMessageCollection,
                       setChannelHeaderName, setChannelList, setMessageList, setMembers, setShowChannelInformation, loadMoreChannelList,
                     }) {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
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
    const filter = new MessageFilter();
    const limit = 20;
    const startingPoint = Date.now();
    const collection = _channel.createMessageCollection({
      filter,
      limit,
      startingPoint,
    });
    collection
      .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
      .onCacheResult((err, messages) => {
        setMessageList(messages.reverse());
      })
      .onApiResult((err, messages) => {
        setMessageList(messages.reverse());
      });

    setChannel(_channel);
    setMembers(_channel.members);
    setMessageCollection(collection);
    setChannelHeaderName(_channel.name);
    setShowChannelInformation(false);

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
      },
      onUserJoined: (channel, user) => {
        if (_channel.url === channel.url) {
          setMembers((currentMemberList) => [...currentMemberList, user]);
        }
      },
      onUserLeft: (channel, user) => {
        if (_channel.url === channel.url) {
          setMembers((currentMemberList) => currentMemberList.filter((m) => m.userId !== user.userId));
        }
      },
      onOperatorUpdated: (channel) => {
        if (_channel.url === channel.url) {
          setMembers([...channel.members]);
        }
      },
    });

    sb.groupChannel.addGroupChannelHandler(_channel.url, channelHandler);
  }, [channel, sb, setChannel, setChannelHeaderName, setMessageList, setShowChannelInformation, setMembers, setMessageCollection]);


  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [headerRef]);

  return (
    <div className="channel-list">
      <div ref={headerRef} className="header">
        <div className="userProfileButton" role='button' onClick={handleUpdatingUserProfileOpenModal}>
          <Avatar sb={sb}/>
          <div className="avatarSection">
            <div>{sb.currentUser.nickname}</div>
            <div>{sb.currentUser.userId}</div>
          </div>
        </div>
        <div className="createChannelIcon" style={{marginRight: 10}} onClick={handleCreatingChannelOpenModal}>
          <Create />
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
        {channelList.length === 0 ? (
          <div className="noChannelSection" style={{height: `calc(100vh - ${headerHeight}px)`}}>
            <Channel className="noChannelIcon"/>
            No Channels
          </div>
        ) : (
          channelList.map((channel) => (
            <ChannelItem
              key={channel.url}
              channel={channel}
              handleLoadChannel={handleLoadChannel}
              handleDeleteChannel={handleDeleteChannel}
            />
          ))
        )}
      </div>

      {groupQuery.current.hasMore && <button onClick={loadMoreChannelList}>Load More</button>}
    </div>
  );
}

export default ChannelList;