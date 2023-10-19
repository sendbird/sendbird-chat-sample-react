import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  GroupChannelFilter,
  GroupChannelListOrder,
  MessageCollectionInitPolicy,
  MessageFilter
} from '@sendbird/chat/groupChannel';
import ChannelList from '../components/ChannelList';
import ChannelHeader from '../components/ChannelHeader';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import ChannelInformation from '../components/ChannelInformation';
import ConfirmationModal from "../components/ConfirmationModal";
import '../styles/Chat.css';

export default function Chat({sb, userId}) {
  const [channelList, setChannelList] = useState([]);
  const [channel, setChannel] = useState(null);
  const [members, setMembers] = useState([]);
  const [channelHeaderName, setChannelHeaderName] = useState('Channel Name');
  const [messageCollection, setMessageCollection] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [customTypesFilter, setCustomTypesFilter] = useState([]);
  const [showChannelInformation, setShowChannelInformation] = useState(false);
  const [showMessageFilterModal, setShowMessageFilterModal] = useState(false);

  const handleMessageFilterCloseModal = () => {
    setShowMessageFilterModal(false);
  };

  const handleAddingCustomTypeMessage = async (customType) => {
    if (customType !== '') {
      const filter = new MessageFilter();
      filter.customTypesFilter = [...customTypesFilter, customType]
      const limit = 20;
      const startingPoint = Date.now();
      const collection = channel.createMessageCollection({
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

      setMessageCollection(collection);

      setCustomTypesFilter((customTypeFilter) => [...customTypeFilter, customType]);
    }
    handleMessageFilterCloseModal();
  };

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
        setMessageCollection={setMessageCollection}
        customTypesFilter={customTypesFilter}
        setChannel={setChannel}
        setChannelHeaderName={setChannelHeaderName}
        setChannelList={setChannelList}
        setMessageList={setMessageList}
        setMembers={setMembers}
        setShowChannelInformation={setShowChannelInformation}
        loadMoreChannelList={loadMoreChannelList}
      />
      <ConfirmationModal
        isOpen={showMessageFilterModal}
        onRequestClose={handleMessageFilterCloseModal}
        onConfirm={handleAddingCustomTypeMessage}
        title="Add Custom Type"
        message=""
        isUpdateMessage={true}
      />
      {channel && (
        <div className="channel">
          <ChannelHeader
            channelHeaderName={channelHeaderName}
            showChannelInformation={showChannelInformation}
            setShowChannelInformation={setShowChannelInformation}
            setShowMessageFilterModal={setShowMessageFilterModal}
          />
          <MessageList
            sb={sb}
            channel={channel}
            messageList={messageList}
            setMessageList={setMessageList}
            messageCollection={messageCollection}
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
