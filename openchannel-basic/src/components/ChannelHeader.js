import React, {useState} from 'react';
import {FiEdit2, FiTrash2} from 'react-icons/fi';
import {ImExit} from 'react-icons/im';
import ConfirmationModal from "./ConfirmationModal";

function ChannelHeader({
                         channel,
                         channelHeaderName,
                         setChannel,
                         setMessageList,
                         channelList,
                         setChannelList,
                         isOperator
                       }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(channelHeaderName);

  async function exitChannel(channel) {
    await channel.exit();
    setChannel(null);
    setMessageList([]);
    setChannelList(channelList.filter(item => item.url !== channel.url));
  }

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleConfirmDelete = async () => {
    await channel.delete();
    setChannel(null);
    setMessageList([]);
    setChannelList(channelList.filter(item => item.url !== channel.url));
    closeModal();
  };

  function startEditing() {
    setNewName(channelHeaderName);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveName() {
    if (newName.trim() !== "") {
      let params = ({
        name: newName,
      });
      channel.updateChannel(params, (response, error) => {
        if (error) {
          console.log(error);
          return;
        }
        setChannel(response);
      });
      setIsEditing(false);
    }
  }

  return (
    <div className="channel-top">
      <div className="channel-header">
        {isEditing ? (
          <>
            <input
              id="channel-name-input"
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button onClick={saveName}>Save</button>
            <button onClick={cancelEditing}>Cancel</button>
          </>
        ) : (
          <>
            {channelHeaderName}
            <FiEdit2 onClick={startEditing} size="0.7em" style={{cursor: 'pointer', marginLeft: '5px'}}/>
          </>
        )}
      </div>
      <div>
        <ImExit onClick={() => exitChannel(channel)} size="2em"/>
        {isOperator && <FiTrash2 className='control-button' size="2em" onClick={openModal}/>}
        <ConfirmationModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          onConfirm={handleConfirmDelete}
          title="Delete Channel"
          message="Are you sure you want to delete this channel?"
        />
      </div>
    </div>
  );
}

export default ChannelHeader;
