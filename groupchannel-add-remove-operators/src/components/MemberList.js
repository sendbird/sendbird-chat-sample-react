import React, { useState } from 'react';
import MemberInviteModal from './MemberInviteModal';
import { BiUserPlus } from 'react-icons/bi';
import { GrUserAdmin } from 'react-icons/gr';

function MemberList({ sb, channel, members }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inviteMembers = async (invitedUserIds) => {
    await channel.inviteWithUserIds(invitedUserIds);
  };

  const switchOperatorStatus = async (member) => {
    if (isOperator(member)) {
      // If the member is already an operator, remove them
      await channel.removeOperators([member.userId]);
    } else {
      // Otherwise, add them as an operator
      await channel.addOperators([member.userId]);
    }
  };

  const isOperator = (member) => {
    return member.role === 'operator';
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
          <div
            className="member-item"
            key={member.userId}
            onClick={() => switchOperatorStatus(member)}
          >
            {isOperator(member) ? <GrUserAdmin style={{paddingRight: 10}}/> : ''} {member.nickname}({member.userId})
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberList;
