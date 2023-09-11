import React, {useState} from 'react';
import {FiEdit2} from 'react-icons/fi';
import {ImExit} from 'react-icons/im';

function ChannelHeader({
                         channel,
                         channelList,
                         setChannel,
                         setMembers,
                         setMessageList,
                         setChannelList,
                         channelHeaderName,
                         setChannelHeaderName
                       }) {
  const [newName, setNewName] = useState(channelHeaderName);
  const [isEditingHeaderName, setIsEditingHeaderName] = useState(false);

  function startEditing() {
    setNewName(channelHeaderName);
    setIsEditingHeaderName(true);
  }

  function cancelEditing() {
    setIsEditingHeaderName(false);
  }

  async function saveChannelName(newName) {
    if (newName.trim() !== "") {
      let params = ({
        name: newName,
      });
      await channel.updateChannel(params, (_channel, error) => {
        if (error) {
          console.log(error);
          return;
        }
        setChannelHeaderName(_channel.name);
      });
      setIsEditingHeaderName(false);
    }
  }

  async function leaveChannel(channel) {
    await channel.leave();
    setChannel(null);
    setMembers([]);
    setMessageList([]);
    setChannelList(channelList.filter(item => item.url !== channel.url));
  }

  return (
    <div className="channel-top">
      <div className="channel-header">
        {isEditingHeaderName ? (
          <>
            <input
              id="channel-name-input"
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button onClick={() => saveChannelName(newName)}>Save</button>
            <button onClick={cancelEditing}>Cancel</button>
          </>
        ) : (
          <>
            {channelHeaderName}
            <FiEdit2 onClick={startEditing} size="0.7em" style={{cursor: 'pointer', marginLeft: '5px'}}/>
          </>
        )}
      </div>
      <ImExit onClick={() => leaveChannel(channel)} size="2em"/>
    </div>
  );
}

export default ChannelHeader;
