import {useCallback, useEffect, useRef, useState} from 'react';
import ChannelItem from './ChannelItem';
import {OpenChannelHandler} from "@sendbird/chat/openChannel";
import CreateChannelModal from './CreateChannelModal';
import ConfirmationModal from "./ConfirmationModal";
import Avatar from "./Avatar";
import {ReactComponent as Channel} from "../assets/sendbird-icon-channel.svg";
import {ReactComponent as Create} from "../assets/sendbird-icon-create.svg";
import '../styles/ChannelList.css';

function ChannelList({
                       sb,
                       channel,
                       userId,
                       channelList,
                       setChannel,
                       setChannelHeaderName,
                       setMessageList,
                       setChannelList,
                       isLoading,
                       openQuery,
                       setOpenQuery,
                       retrieveChannelList
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

  const handleScroll = async (event) => {
    const {scrollTop, scrollHeight, clientHeight} = event.currentTarget;

    const tolerance = 5;

    if (scrollTop + clientHeight + tolerance >= scrollHeight) {
      if (openQuery.hasNext && !isLoading) {
        const newChannels = await retrieveChannelList();
        if (newChannels !== undefined) {
          setChannelList(prevChannels => [...prevChannels, ...newChannels]);
        }
      }
    }
  }

  const handleCreateChannel = useCallback(async (channelName) => {
    const openChannelCreateParams = {
      name: channelName ? channelName : 'Open Channel',
      operatorUserIds: [userId]
    };
    await sb.openChannel.createChannel(openChannelCreateParams);
    setOpenQuery(sb.openChannel.createOpenChannelListQuery());
    retrieveChannelList().then((channels) => {
      setChannelList(channels);
    });
  }, [sb, userId, retrieveChannelList, setOpenQuery, setChannelList]);

  const handleDeleteChannel = useCallback(async (_channel) => {
    await _channel.delete();
    setChannelList(channelList.filter(item => item.url !== _channel.url));
  }, [channelList, setChannelList]);

  const handleLoadChannel = useCallback(async (_channel) => {
    channel && sb.openChannel.removeOpenChannelHandler(channel.url);
    await _channel.enter();
    const PreviousMessageListQueryParams = {};
    const PreviousMessageListQuery = _channel.createPreviousMessageListQuery(PreviousMessageListQueryParams);
    const messages = await PreviousMessageListQuery.load();
    setMessageList(messages);
    setChannel(_channel);
    setChannelHeaderName(_channel.name);

    const channelHandler = new OpenChannelHandler({
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

    sb.openChannel.addOpenChannelHandler(_channel.url, channelHandler);
  }, [channel, sb, setChannel, setChannelHeaderName, setMessageList]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [headerRef]);

  return (
    <div className="channel-list" onScroll={handleScroll}>
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
            userId={userId}
          />))
        )}
      </div>
    </div>
  );
}

export default ChannelList;
