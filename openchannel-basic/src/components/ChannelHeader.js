import React from 'react';
import {ReactComponent as Information} from '../assets/sendbird-icon-information.svg';
import '../styles/ChannelHeader.css'

function ChannelHeader({
                         channelHeaderName,
                         showChannelInformation,
                         setShowChannelInformation
                       }) {
  const changeShowChannelInformation = () => () => {
    setShowChannelInformation(!showChannelInformation);
  };
  return (
    <div className="channel-header">
      <h2>{channelHeaderName}</h2>
      <div>
        <Information onClick={changeShowChannelInformation()} style={{ width: "1.5em", height: "1.5em"}}/>
      </div>
    </div>
  );
}

export default ChannelHeader;
