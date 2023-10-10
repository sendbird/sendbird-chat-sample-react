import React, { useState } from 'react';
import MemberInviteModal from './MemberInviteModal';
import ConfirmationModal from "./ConfirmationModal";
import AccordionItem from "./AccordionItem";
import { ReactComponent as Members } from '../assets/sendbird-icon-members.svg';
import { ReactComponent as Close } from '../assets/sendbird-icon-close.svg';
import '../styles/ChannelInformation.css';

function ChannelInformation({
                              sb,
                              channel,
                              channelList,
                              members,
                              channelHeaderName,
                              setChannel,
                              setChannelList,
                              setMembers,
                              setMessageList,
                              setShowChannelInformation
                            }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingChannelNameModalOpen, setUpdatingChannelNameModalOpen] = useState(false);

  const inviteMembers = async (invitedUserIds) => {
    await channel.inviteWithUserIds(invitedUserIds);
  };

  const handleUpdatingChannelNameOpenModal = () => setUpdatingChannelNameModalOpen(true);

  const handleUpdatingChannelNameCloseModal = () => setUpdatingChannelNameModalOpen(false);

  const handleUpdateChannelName = async (channelName) => {
    if (channelName.trim() !== "") {
      const params = { name: channelName };
      await channel.updateChannel(params, (_channel, error) => {
        if (error) console.log(error);
      });
    }
    handleUpdatingChannelNameCloseModal();
  };

  const leaveChannel = async (channel) => {
    await channel.leave();
    setChannel(null);
    setMembers([]);
    setMessageList([]);
    setChannelList(channelList.filter(item => item.url !== channel.url));
  };

  const closeChannelInformation = () => setShowChannelInformation(false);

  return (
    <div className="channel-information">
      <div className="header">
        <h2>Channel information</h2>
        <Close onClick={closeChannelInformation} className="close-icon"/>
      </div>

      <ConfirmationModal
        isOpen={isUpdatingChannelNameModalOpen}
        onRequestClose={handleUpdatingChannelNameCloseModal}
        onConfirm={handleUpdateChannelName}
        title="Update channel name"
        message={channelHeaderName}
        isUpdateMessage={true}
      />

      <MemberInviteModal
        sb={sb}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onCreate={inviteMembers}
        members={members}
      />

      <AccordionItem
        Icon={Members}
        title="Members"
        onActionBtnClick={() => setIsModalOpen(true)}
        actionBtnLabel="Invite Users"
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
  );
}

export default ChannelInformation;
