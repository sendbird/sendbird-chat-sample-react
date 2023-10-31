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

  const isHidden = channel.hiddenState !== 'unhidden';
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

  const unsetChannel = () => {
    setChannel(null);
    setMembers([]);
    setMessageList([]);
  };

  const hideChannel = async (channel) => {
    await channel.hide({
      hidePreviousMessages: false,
      allowAutoUnhide: true,
    })
    unsetChannel();
  };

  const archiveChannel = async (channel) => {
    await channel.hide({
      hidePreviousMessages: false,
      allowAutoUnhide: false,
    })
    unsetChannel();
  };

  const unhideChannel = async (channel) => {
    await channel.unhide();
    unsetChannel();
  };

  const leaveChannel = async (channel) => {
    await channel.leave();
    unsetChannel();
  };

  const closeChannelInformation = () => setShowChannelInformation(false);

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
        { !isHidden && <button
          className="button"
          onClick={() => hideChannel(channel)}
        >
          Hide Channel
        </button>}
        { !isHidden && <button
          className="button"
          onClick={() => archiveChannel(channel)}
        >
          Archive Channel
        </button>}
        { isHidden && <button
          className="button"
          onClick={() => unhideChannel(channel)}
        >
          Unhide Channel
        </button>}
      </div>
    </div>
  );
}

export default ChannelInformation;
