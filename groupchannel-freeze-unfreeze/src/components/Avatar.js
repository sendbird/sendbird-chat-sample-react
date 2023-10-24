import React from 'react';
import { ReactComponent as UserIcon } from "../assets/sendbird-icon-user.svg";
import '../styles/Avatar.css';

const Avatar = ({ sb }) => {
  return (
    <div className="avatar">
      {sb.currentUser.profileUrl
        ? <img src={sb.currentUser.profileUrl} alt="profile"/>
        : <UserIcon />
      }
    </div>
  );
};

export default Avatar;
