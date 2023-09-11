import React, {useState} from 'react';
import MemberInviteModal from './MemberInviteModal';
import {BiUserPlus} from 'react-icons/bi';

function MemberList({sb, channel, members}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inviteMembers = async (invitedUserIds) => {
    await channel.inviteWithUserIds(invitedUserIds);
  };

  return (
    <div className='members'>
      <h1>Members</h1>
      <BiUserPlus onClick={() => setIsModalOpen(true)} size="2.5em"/>
      <MemberInviteModal
        sb={sb}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onCreate={inviteMembers}
        members={members}
      />
      <div className="members-list">
        {members.map((member) => (
          <div className="member-item" key={member.userId}>
            {member.nickname}({member.userId})
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberList;
