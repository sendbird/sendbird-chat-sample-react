import React from 'react';
import {ReactComponent as Information} from '../assets/sendbird-icon-information.svg';
import {ReactComponent as Filter} from '../assets/sendbird-icon-filter.svg';
import '../styles/ChannelHeader.css';

function ChannelHeader({
                         channelHeaderName,
                         showChannelInformation,
                         setShowChannelInformation,
                         setShowMessageFilterModal
                       }) {

  const handleShowMessageFilterModal = () => {
    setShowMessageFilterModal(true);
  };
  const changeShowChannelInformation = () => () => {
    setShowChannelInformation(!showChannelInformation);
  };
  return (
    <div className="channel-header">
      <h2>{channelHeaderName}</h2>
      <div>
        <Filter onClick={handleShowMessageFilterModal} style={{ width: "1.5em", height: "1.5em", marginRight: 10}}/>
        <Information onClick={changeShowChannelInformation()} style={{ width: "1.5em", height: "1.5em"}}/>
      </div>
    </div>
  );
}

export default ChannelHeader;
