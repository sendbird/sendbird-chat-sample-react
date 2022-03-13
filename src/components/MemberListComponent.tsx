import { useEffect, useState } from "react";
import {GroupChannel, Member} from "sendbird";
import {MemberListCategoryStyle, MemberListItemStyle, MemberListStyle} from "../styles/styles";

const MemberListItemComponent = (props: MemberListItemComponentProps) => {
  const {
    member,
  } = props;

  return (
    <div className={MemberListItemStyle}>
      {member.nickname}
    </div>
  );
}

type MemberListItemComponentProps = {
  member: Member,
};

const MemberListComponent = (props: MemberListComponentProps) => {
  const {
    groupChannel,
  } = props;

  const [memberList, setMemberList] = useState<Member[]>([]);

  useEffect(() => {
    setMemberList(groupChannel.members);
  }, [groupChannel]);

  return (
    <div className={MemberListStyle}>
      <div className={MemberListCategoryStyle}>
        Members
      </div>
      {
        memberList.map((member: Member, i: number) => (
          <MemberListItemComponent member={member} key={i}/>
        ))
      }
    </div>
  );
}

type MemberListComponentProps = {
  groupChannel: GroupChannel,
};

export default MemberListComponent;