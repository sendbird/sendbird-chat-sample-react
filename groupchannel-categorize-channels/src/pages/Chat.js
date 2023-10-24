import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GroupChannelFilter, GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import ChannelList from '../components/ChannelList';
import ChannelHeader from '../components/ChannelHeader';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import ChannelInformation from '../components/ChannelInformation';
import ConfirmationModal from "../components/ConfirmationModal";
import '../styles/Chat.css';

export default function Chat({ sb, userId }) {
  const [channelList, setChannelList] = useState([]);
  const [channel, setChannel] = useState(null);
  const [members, setMembers] = useState([]);
  const [channelHeaderName, setChannelHeaderName] = useState('Channel Name');
  const [messageCollection, setMessageCollection] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [customTypeChannelList, setCustomTypeChannelList] = useState([]);
  const [showChannelInformation, setShowChannelInformation] = useState(false);
  const [showChannelFilterModal, setShowChannelFilterModal] = useState(false);

  const handleChannelFilterCloseModal = () => {
    setShowChannelFilterModal(false);
  };

  const handleAddingCustomTypeChannel = async (customType) => {
    if (customType !== '') {
      setCustomTypeChannelList((customTypeChannelList) => [...customTypeChannelList, customType]);
    }
    handleChannelFilterCloseModal();
  };

  const groupQuery = useRef(null);

  const retrieveChannelList = useCallback(async () => {
    if (groupQuery.current && groupQuery.current.hasMore) {
      return await groupQuery.current.loadMore();
    } else {
      return [];
    }
  }, [groupQuery]);

  const loadMoreChannelList = useCallback(async () => {
    const newChannels = await retrieveChannelList();
    setChannelList(prevChannels => [...prevChannels, ...newChannels]);
  }, [retrieveChannelList]);

  useEffect(() => {
    const groupChannelFilter = new GroupChannelFilter();
    groupChannelFilter.includeEmpty = true;
    groupChannelFilter.customTypesFilter = customTypeChannelList;

    const localGroupQuery = sb.groupChannel.createGroupChannelCollection({
      filter: groupChannelFilter,
      order: GroupChannelListOrder.CHRONOLOGICAL,
      limit: 10
    });

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

    localGroupQuery.setGroupChannelCollectionHandler(channelRetrieveHandler);
    groupQuery.current = localGroupQuery;

    // Initiate the data retrieval when the filter changes
    const fetchChannels = async () => {
      const channels = await retrieveChannelList();
      setChannelList(channels);
    };

    fetchChannels();

    // Cleanup the query handler if needed
    return () => {
      localGroupQuery.setGroupChannelCollectionHandler(null);
    }
  }, [customTypeChannelList, retrieveChannelList, channel, sb.groupChannel]);

  return (
    <div className='container'>
      <ChannelList
        sb={sb}
        groupQuery={groupQuery}
        userId={userId}
        channel={channel}
        channelList={channelList}
        setMessageCollection={setMessageCollection}
        setChannel={setChannel}
        setChannelHeaderName={setChannelHeaderName}
        setChannelList={setChannelList}
        setMessageList={setMessageList}
        setMembers={setMembers}
        setShowChannelInformation={setShowChannelInformation}
        setShowChannelFilterModal={setShowChannelFilterModal}
        loadMoreChannelList={loadMoreChannelList}
      />
      <ConfirmationModal
        isOpen={showChannelFilterModal}
        onRequestClose={handleChannelFilterCloseModal}
        onConfirm={handleAddingCustomTypeChannel}
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
      {(channel && showChannelInformation) && (
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