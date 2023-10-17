import React, {useState, useEffect, useCallback} from 'react';
import ConfirmationModal from "./ConfirmationModal";
import AccordionItem from "./AccordionItem";
import {ReactComponent as Members} from '../assets/sendbird-icon-members.svg';
import {ReactComponent as Close} from '../assets/sendbird-icon-close.svg';
import '../styles/ChannelInformation.css';

function ChannelInformation({
                              channel,
                              channelList,
                              channelHeaderName,
                              setChannel,
                              setChannelList,
                              setMessageList,
                              setShowChannelInformation

}) {
  const [isUpdatingChannelNameModalOpen, setUpdatingChannelNameModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleUpdatingChannelNameOpenModal = () => {
    setUpdatingChannelNameModalOpen(true);
  };

  const handleUpdatingChannelNameCloseModal = () => {
    setUpdatingChannelNameModalOpen(false);
  };

  const handleUpdateChannelName = async (channelName) => {
    if (channelName.trim() !== "") {
      let params = ({
        name: channelName,
      });
      await channel.updateChannel(params, (_channel, error) => {
        if (error) {
          console.log(error);
        }
      });
    }
    handleUpdatingChannelNameCloseModal();
  };

  async function leaveChannel(channel) {
    await channel.leave();
    setChannel(null);
    setMembers([]);
    setMessageList([]);
    setChannelList(channelList.filter(item => item.url !== channel.url));
  }

  function closeChannelInformation() {
    setShowChannelInformation(false);
  }

  const loadMoreMembers = useCallback(async () => {
    if (loading || !channel || !query || !query.hasNext) return;

    setLoading(true);
    try {
      const _members = await query.next();
      setMembers(prevMembers => [...prevMembers, ..._members]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [channel, query, loading, setMembers]);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!channel) {
        setMembers([]);
        setQuery(null);
        return;
      }

      const memberQuery = channel.createParticipantListQuery(
        params => params.limit = 20,
      );
      setQuery(memberQuery);

      if (memberQuery.hasNext) {
        try {
          setLoading(true);
          const _members = await memberQuery.next();
          setMembers(_members);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [channel, refresh, setMembers]);

  return (
    <div className="channel-information">
      <div className="channel-header">
        <h2>Channel information</h2>
        <Close onClick={closeChannelInformation} className="close-icon"/>
      </div>
      <div className="channel-information-body">
        <ConfirmationModal
          isOpen={isUpdatingChannelNameModalOpen}
          onRequestClose={handleUpdatingChannelNameCloseModal}
          onConfirm={handleUpdateChannelName}
          title="Update channel name"
          message={channelHeaderName}
          isUpdateMessage={true}
        />
        <AccordionItem
          Icon={Members}
          title="Members"
          onActionBtnClick={loadMoreMembers}
          actionBtnLabel="Refresh members"
          onRightButtonClick={handleRefresh}
        >
          {members.map((member) => (
            <div className="member-item" key={member.userId}>
              {member.nickname}({member.userId})
            </div>
          ))}
        </AccordionItem>
        <button
          className="button"
          onClick={handleUpdatingChannelNameOpenModal}
        >
          Change channel name
        </button>
        <button
          className="button"
          onClick={() => leaveChannel(channel)}
        >
          Leave channel
        </button>
      </div>
    </div>
  );
}

export default ChannelInformation;
