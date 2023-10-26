import React, {useCallback, useEffect, useRef, useState} from 'react';
import ChannelItem from './ChannelItem';
import CreateChannelModal from './CreateChannelModal';
import ConfirmationModal from "./ConfirmationModal";
import FriendsModal from './FriendsModal';
import Avatar from "./Avatar";
import {ReactComponent as Channel} from "../assets/sendbird-icon-channel.svg";
import {ReactComponent as Create} from "../assets/sendbird-icon-create.svg";
import {ReactComponent as Friends} from "../assets/sendbird-icon-friends.svg";
import {GroupChannelHandler, MessageCollectionInitPolicy, MessageFilter} from "@sendbird/chat/groupChannel";
import '../styles/ChannelList.css';

function ChannelList({
                       sb, groupQuery, userId, channel, channelList, setChannel, setMessageCollection,
                       setChannelHeaderName, setChannelList, setMessageList, setMembers, setShowChannelInformation, loadMoreChannelList,
                     }) {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isCreatingChannelModalOpen, setCreatingChannelModalOpen] = useState(false);
  const [isFriendsModalOpen, setFriendsModalOpen] = useState(false);
  const [isUpdatingUserProfileModalOpen, setUpdatingUserProfileModalOpen] = useState(false);
  const [userNickname, setUserNickname] = useState(sb.currentUser.nickname);

  const handleFriendsOpenModal = () => {
    setFriendsModalOpen(true);
  };

  const handleFriendsCloseModal = () => {
    setFriendsModalOpen(false);
  };

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

  const handleFriends = useCallback(async () => {
    const friends = await sb.createFriendListQuery().next();
    console.log(friends);
  }, [sb]);

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
      }
    });

    sb.groupChannel.addGroupChannelHandler(_channel.url, channelHandler);
  }, [channel, sb, setChannel, setMessageCollection, setChannelHeaderName, setMessageList, setShowChannelInformation, setMembers]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [headerRef]);

  return (
    <div className="left-bar">
      <div ref={headerRef} className="header">
        <div className="userProfileButton" role='button' onClick={handleUpdatingUserProfileOpenModal}>
          <Avatar sb={sb}/>
          <div className="avatarSection">
            <div>{sb.currentUser.nickname}</div>
            <div>{sb.currentUser.userId}</div>
          </div>
        </div>
        <div className="createChannelIcon" style={{marginRight: 10}}>
          <Create onClick={handleCreatingChannelOpenModal} style={{marginRight: 10}}/>
          <Friends onClick={handleFriendsOpenModal}/>
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

      <FriendsModal
        sb={sb}
        isOpen={isFriendsModalOpen}
        handleCloseModal={handleFriendsCloseModal}
        handleCreateChannel={handleFriends}
      />

      <CreateChannelModal
        sb={sb}
        isOpen={isCreatingChannelModalOpen}
        handleCloseModal={handleCreatingChannelCloseModal}
        handleCreateChannel={handleCreateChannel}
      />

      <div className="channel-list" style={{height: `calc(98vh - ${headerHeight}px)`}}>
        {channelList.length === 0 ? (
          <div className="noChannelSection" >
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