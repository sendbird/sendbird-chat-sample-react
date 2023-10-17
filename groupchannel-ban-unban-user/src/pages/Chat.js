import React, {useEffect, useState, useCallback, useRef} from 'react';
import {GroupChannelFilter, GroupChannelListOrder} from '@sendbird/chat/groupChannel';
import ChannelList from '../components/ChannelList';
import ChannelHeader from '../components/ChannelHeader';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import ChannelInformation from '../components/ChannelInformation';
import '../styles/Chat.css';

export default function Chat({sb, userId}) {
  const [channelList, setChannelList] = useState([]);
  const [channel, setChannel] = useState(null);
  const [members, setMembers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [channelHeaderName, setChannelHeaderName] = useState('Channel Name');
  const [messageList, setMessageList] = useState([]);
  const [showChannelInformation, setShowChannelInformation] = useState(false);

  const groupChannelFilter = new GroupChannelFilter();
  groupChannelFilter.includeEmpty = true;

  const groupQuery = useRef(sb.groupChannel.createGroupChannelCollection({
    filter: groupChannelFilter,
    order: GroupChannelListOrder.CHRONOLOGICAL,
    limit: 10
  }));

  const channelRetrieveHandler = {
    onChannelsUpdated: (context, channels) => {
      for (let i = 0; i < channels.length; i++) {
        if (channel && channels[i].url === channel.url) {
          setChannelHeaderName(channels[i].name);
        }
      }
    },
    onChannelsAdded: (context, channels) => {
      setChannelList((currentChannelList) => [...channels, ...currentChannelList]);
    },
    onChannelsDeleted: (context, channels) => {
      setChannelList((currentChannelList) => currentChannelList.filter((channel) => !channels.includes(channel)));
    }
  };

  groupQuery.current.setGroupChannelCollectionHandler(channelRetrieveHandler);

  const retrieveChannelList = useCallback(async () => {
    if (groupQuery.current.hasMore) {
      return await groupQuery.current.loadMore();
    }else{
      return [];
    }
  }, [groupQuery]);

  const loadMoreChannelList = useCallback(async () => {
    const newChannels = await retrieveChannelList();
    setChannelList(prevChannels => [...prevChannels, ...newChannels]);
  }, [retrieveChannelList, setChannelList]);

  useEffect(() => {
    retrieveChannelList().then((channels) => {
      setChannelList(channels);
    });
  }, [retrieveChannelList, setChannelList]);

  return (
    <div className='container'>
      <ChannelList
        sb={sb}
        groupQuery={groupQuery}
        userId={userId}
        channel={channel}
        channelList={channelList}
        setChannel={setChannel}
        setChannelHeaderName={setChannelHeaderName}
        setChannelList={setChannelList}
        setMessageList={setMessageList}
        setMembers={setMembers}
        setBannedUsers={setBannedUsers}
        setShowChannelInformation={setShowChannelInformation}
        loadMoreChannelList={loadMoreChannelList}
      />
      {channel && (
        <div className="channel">
          <ChannelHeader
            channelHeaderName={channelHeaderName}
            showChannelInformation={showChannelInformation}
            setShowChannelInformation={setShowChannelInformation}
          />
          <MessageList
            sb={sb}
            channel={channel}
            messageList={messageList}
            setMessageList={setMessageList}
          />
          <MessageInput
            sb={sb}
            channel={channel}
            messageList={messageList}
            setMessageList={setMessageList}
          />
        </div>
      )}
      {(channel && showChannelInformation ) && (
        <ChannelInformation
          sb={sb}
          channel={channel}
          channelList={channelList}
          channelHeaderName={channelHeaderName}
          members={members}
          bannedUsers={bannedUsers}
          setChannel={setChannel}
          setChannelList={setChannelList}
          setMembers={setMembers}
          setMessageList={setMessageList}
          setShowChannelInformation={setShowChannelInformation}
        />
      )}
    </div>
  );
}
