import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import SendbirdChat from '@sendbird/chat';
import {
    OpenChannelModule,
    OpenChannelHandler
} from '@sendbird/chat/openChannel';

import { SENDBIRD_INFO } from '../constants/constants';
import { timestampToTime } from '../utils/messageUtils';

let sb;

const OpenChannelMetadataAndMetacounter = (props) => {

    const [state, updateState] = useState({
        currentlyJoinedChannel: null,
        currentlyUpdatingChannel: null,
        messages: [],
        channels: [],
        showChannelCreate: false,
        messageInputValue: "",
        userNameInputValue: "",
        userIdInputValue: "",
        channelNameInputValue: "",
        settingUpUser: true,
        file: null,
        messageToUpdate: null,
        loading: false,
        error: false,
        isOpenMetadataModal: false,
        metadataKeyInputValue: "",
        metadataValueInputValue: "",
        metadataObject: {},
        currentMetadataObject: {},
        metadataItemToUpdate: null,
        isOpenMetacounterModal: false,
        metacounterKeyInputValue: "",
        metacounterValueInputValue: "",
        metacounterObject: {},
        currentMetacounterObject: {},
        metacounterItemToUpdate: null
    });

    //need to access state in message reeived callback
    const stateRef = useRef();
    stateRef.current = state;

    const onError = (error) => {
        updateState({ ...state, error: error.message });
        console.log(error);
    }

    const handleJoinChannel = async (channelUrl) => {
        const { channels, userIdInputValue } = state;
        updateState({ ...state, loading: true });
        const channelToJoin = channels.find((channel) => channel.url === channelUrl);
        const [channel, messages, error] = await joinChannel(channelToJoin);
        if (error) {
            return onError(error);

        }

        //listen for incoming messages
        const channelHandler = new OpenChannelHandler();
        channelHandler.onMessageUpdated = (channel, message) => {
            const messageIndex = stateRef.current.messages.findIndex((item => item.messageId == message.messageId));
            const updatedMessages = [...stateRef.current.messages];
            updatedMessages[messageIndex] = message;
            updateState({ ...stateRef.current, messages: updatedMessages });
        }

        channelHandler.onMessageReceived = (channel, message) => {
            const updatedMessages = [...stateRef.current.messages, message];
            updateState({ ...stateRef.current, messages: updatedMessages });
        };

        channelHandler.onMessageDeleted = (channel, message) => {
            const updatedMessages = stateRef.current.messages.filter((messageObject) => {
                return messageObject.messageId !== message;
            });
            updateState({ ...stateRef.current, messages: updatedMessages });
        }
        sb.openChannel.addOpenChannelHandler(uuid(), channelHandler);
        updateState({ ...state, currentlyJoinedChannel: channel, messages: messages, loading: false })
    }

    const handleLeaveChannel = async () => {
        const { currentlyJoinedChannel } = state;
        await currentlyJoinedChannel.exit();

        updateState({ ...state, currentlyJoinedChannel: null })

    }

    const handleCreateChannel = async () => {
        const { channelNameInputValue } = state;
        const [openChannel, error] = await createChannel(channelNameInputValue);
        if (error) {
            return onError(error);
        }
        const updatedChannels = [openChannel, ...state.channels];
        updateState({ ...state, channels: updatedChannels, showChannelCreate: false });
    }

    const handleDeleteChannel = async (channelUrl) => {
        const [channel, error] = await deleteChannel(channelUrl);
        if (error) {
            return onError(error);
        }
        const updatedChannels = state.channels.filter((channel) => {
            return channel.url !== channelUrl;
        });
        updateState({ ...state, channels: updatedChannels });
    }

    const handleUpdateChannel = async () => {
        const { currentlyUpdatingChannel, channelNameInputValue, channels } = state;
        const [updatedChannel, error] = await updateChannel(currentlyUpdatingChannel, channelNameInputValue);
        if (error) {
            return onError(error);
        }
        const indexToReplace = channels.findIndex((channel) => channel.url === currentlyUpdatingChannel.channelUrl);
        const updatedChannels = [...channels];
        updatedChannels[indexToReplace] = updatedChannel;
        updateState({ ...state, channels: updatedChannels, currentlyUpdatingChannel: null });
    }

    const toggleChannelDetails = (channel) => {
        if (channel) {
            updateState({ ...state, currentlyUpdatingChannel: channel });
        } else {
            updateState({ ...state, currentlyUpdatingChannel: null });
        }
    }

    const toggleShowCreateChannel = () => {
        updateState({ ...state, showChannelCreate: !state.showChannelCreate });
    }

    const onChannelNamenIputChange = (e) => {
        const channelNameInputValue = e.currentTarget.value;
        updateState({ ...state, channelNameInputValue });
    }

    const onUserNameInputChange = (e) => {
        const userNameInputValue = e.currentTarget.value;
        updateState({ ...state, userNameInputValue });
    }

    const onUserIdInputChange = (e) => {
        const userIdInputValue = e.currentTarget.value;
        updateState({ ...state, userIdInputValue });
    }

    const onMessageInputChange = (e) => {
        const messageInputValue = e.currentTarget.value;
        updateState({ ...state, messageInputValue });
    }

    const sendMessage = async () => {
        const { messageToUpdate, currentlyJoinedChannel, messages } = state;

        if (messageToUpdate) {
            const userMessageUpdateParams = {};
            userMessageUpdateParams.message = state.messageInputValue;
            const updatedMessage = await currentlyJoinedChannel.updateUserMessage(messageToUpdate.messageId, userMessageUpdateParams)
            const messageIndex = messages.findIndex((item => item.messageId == messageToUpdate.messageId));
            messages[messageIndex] = updatedMessage;
            updateState({ ...state, messages: messages, messageInputValue: "", messageToUpdate: null });
        } else {
            const userMessageParams = {};
            userMessageParams.message = state.messageInputValue;
            currentlyJoinedChannel.sendUserMessage(userMessageParams).onSucceeded((message) => {
                const updatedMessages = [...messages, message];
                updateState({ ...state, messages: updatedMessages, messageInputValue: "" });

            }).onFailed((error) => {
                console.log(error)
                console.log("failed")
            });

        }
    }

    const onFileInputChange = async (e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            const { currentlyJoinedChannel, messages } = state;
            const fileMessageParams = {};
            fileMessageParams.file = e.currentTarget.files[0];
            currentlyJoinedChannel.sendFileMessage(fileMessageParams).onSucceeded((message) => {
                const updatedMessages = [...messages, message];
                updateState({ ...state, messages: updatedMessages, messageInputValue: "", file: null });

            }).onFailed((error) => {
                console.log(error)
                console.log("failed")
            });
        }
    }

    const handleDeleteMessage = async (messageToDelete) => {
        const { currentlyJoinedChannel } = state;
        await deleteMessage(currentlyJoinedChannel, messageToDelete); // Delete

    }

    const updateMessage = async (message) => {
        updateState({ ...state, messageToUpdate: message, messageInputValue: message.message });
    }

    const setupUser = async () => {
        const { userNameInputValue, userIdInputValue } = state;
        const sendbirdChat = await SendbirdChat.init({
            appId: SENDBIRD_INFO.appId,
            localCacheEnabled: false,
            modules: [new OpenChannelModule()]
        });



        await sendbirdChat.connect(userIdInputValue, "79d98dc7e160e104ded1eb6b86de46bb6ae27630");
        await sendbirdChat.setChannelInvitationPreference(true);

        const userUpdateParams = {};
        userUpdateParams.nickname = userNameInputValue;
        userUpdateParams.userId = userIdInputValue;
        await sendbirdChat.updateCurrentUserInfo(userUpdateParams);

        sb = sendbirdChat;
        updateState({ ...state, loading: true });
        const [channels, error] = await loadChannels();
        if (error) {
            return onError(error);
        }
        updateState({ ...state, channels: channels, loading: false, settingUpUser: false });
    }

    const toggleMetadataModal = async () => {
      const { isOpenMetadataModal, currentlyJoinedChannel } = state;
      const data = await currentlyJoinedChannel.getAllMetaData();

      updateState({ ...state, isOpenMetadataModal: !isOpenMetadataModal, currentMetadataObject: { ...data} })
    }

    const addMetadataObjectItem = async () => {
      const { currentMetadataObject, metadataKeyInputValue, metadataValueInputValue, metadataItemToUpdate, currentlyJoinedChannel } = state;

      const newObject = {
         [metadataKeyInputValue]: metadataValueInputValue
      }

      const isEmpty = metadataKeyInputValue === "" || metadataValueInputValue === "";

      if (isEmpty) {
        alert("Metadata empty");
        return null;
      }

      if (metadataItemToUpdate) {
        const upsertIfKeyNotExist = true;

        const update = {
          [metadataItemToUpdate]: metadataValueInputValue
        }

        if (metadataItemToUpdate !== metadataKeyInputValue) {
          await currentlyJoinedChannel.deleteMetaData(metadataItemToUpdate);

          await currentlyJoinedChannel.createMetaData({[metadataKeyInputValue]: metadataValueInputValue});

        } else {
          await currentlyJoinedChannel.updateMetaData(update, upsertIfKeyNotExist);
        }

        const { [metadataItemToUpdate]: remove, ...rest } = currentMetadataObject;

        const test = {
          ...state,
          metadataObject: newObject,
          currentMetadataObject: {...newObject, ...rest},
          metadataKeyInputValue: "",
          metadataValueInputValue: "",
          metadataItemToUpdate: null
        }

        updateState({
          ...state,
          metadataObject: newObject,
          currentMetadataObject: {...newObject, ...rest},
          metadataKeyInputValue: "",
          metadataValueInputValue: "",
          metadataItemToUpdate: null
        })

      } else {
        await currentlyJoinedChannel.createMetaData(newObject);

        updateState({
          ...state,
          metadataObject: newObject,
          currentMetadataObject: {...state.currentMetadataObject, ...newObject},
          metadataKeyInputValue: "",
          metadataValueInputValue: ""
        })
      }
    }

    const updateMetadataObjectItem = (key, value) => {
      updateState({ ...state, metadataItemToUpdate: key, metadataKeyInputValue: key, metadataValueInputValue: value })
    }

    const handleDeleteMetadataObjectItem = async (key) => {
      const { currentMetadataObject, currentlyJoinedChannel } = state

      await currentlyJoinedChannel.deleteMetaData(key);
      const { [key]: remove, ...rest } = currentMetadataObject;

      updateState({ ...state, currentMetadataObject: rest })
    }

    const onMetadataKeyInputValue = (e) => {
      const metadataKeyInputValue = e.currentTarget.value
      updateState({ ...state, metadataKeyInputValue})
    }

    const onMetadataValueInputValue = (e) => {
      const metadataValueInputValue = e.currentTarget.value
      updateState({ ...state, metadataValueInputValue})
    }

    const toggleMetacounterModal = async () => {
      const { isOpenMetacounterModal, currentlyJoinedChannel, userIdInputValue } = state;
      await currentlyJoinedChannel.addOperators([userIdInputValue]);
      const data = await currentlyJoinedChannel.getAllMetaCounters();

      updateState({ ...state, isOpenMetacounterModal: !isOpenMetacounterModal, currentMetacounterObject: { ...data} })
    }

    const addMetacounterObjectItem = async () => {
      const { currentMetacounterObject, metacounterKeyInputValue, metacounterValueInputValue, metacounterItemToUpdate, currentlyJoinedChannel } = state;

      const newObject = {
         [metacounterKeyInputValue]: metacounterValueInputValue
      }

      const isEmpty = metacounterKeyInputValue === "" || metacounterValueInputValue === "";

      if (isEmpty) {
        alert("Metadata empty");
        return null;
      }

      if (metacounterItemToUpdate) {
        const upsertIfKeyNotExist = true;

        const update = {
          [metacounterItemToUpdate]: metacounterValueInputValue
        }

        if (metacounterItemToUpdate !== metacounterKeyInputValue) {
          await currentlyJoinedChannel.deleteMetaCounters(metacounterItemToUpdate);

          await currentlyJoinedChannel.createMetaCounters({[metacounterKeyInputValue]: metacounterValueInputValue});

        } else {
          await currentlyJoinedChannel.updateMetaCounters(update, upsertIfKeyNotExist);
        }

        const { [metacounterItemToUpdate]: remove, ...rest } = currentMetacounterObject;

        updateState({
          ...state,
          metacounterObject: newObject,
          currentMetacounterObject: {...newObject, ...rest},
          metacounterKeyInputValue: "",
          metacounterValueInputValue: "",
          metacounterItemToUpdate: null
        })

      } else {
        await currentlyJoinedChannel.createMetaCounters(newObject);

        updateState({
          ...state,
          metacounterObject: newObject,
          currentMetacounterObject: {...state.currentMetacounterObject, ...newObject},
          metacounterKeyInputValue: "",
          metacounterValueInputValue: ""
        })
      }
    }

    const updateMetacounterObjectItem = (key, value) => {
      updateState({ ...state, metacounterItemToUpdate: key, metacounterKeyInputValue: key, metacounterValueInputValue: value })
    }

    const handleDeleteMetacounterObjectItem = async (key) => {
      const { currentMetacounterObject, currentlyJoinedChannel } = state

      await currentlyJoinedChannel.deleteMetaData(key);
      const { [key]: remove, ...rest } = currentMetacounterObject;

      updateState({ ...state, currentMetacounterObject: rest })
    }

    const onMetacounterKeyInputValue = (e) => {
      const metacounterKeyInputValue = e.currentTarget.value
      updateState({ ...state, metacounterKeyInputValue})
    }

    const onMetacounterValueInputValue = (e) => {
      const metacounterValueInputValue = e.currentTarget.value
      updateState({ ...state, metacounterValueInputValue})
    }

    if (state.loading) {
        return <div>Loading...</div>
    }

    if (state.error) {
        return <div className="error">{state.error} check console for more information.</div>
    }

    console.log('- - - - State object very useful for debugging - - - -');
    console.log(state);

    return (
        <>
            <CreateUserForm
                setupUser={setupUser}
                userNameInputValue={state.userNameInputValue}
                userIdInputValue={state.userIdInputValue}
                settingUpUser={state.settingUpUser}
                onUserIdInputChange={onUserIdInputChange}
                onUserNameInputChange={onUserNameInputChange} />
            <ChannelList
                channels={state.channels}
                toggleChannelDetails={toggleChannelDetails}
                handleJoinChannel={handleJoinChannel}
                toggleShowCreateChannel={toggleShowCreateChannel}
                handleDeleteChannel={handleDeleteChannel} />
            <ChannelDetails
                currentlyUpdatingChannel={state.currentlyUpdatingChannel}
                handleUpdateChannel={handleUpdateChannel}
                onChannelNamenIputChange={onChannelNamenIputChange}
                toggleChannelDetails={toggleChannelDetails} />
            <MetadataModal
              isOpenMetadataModal={state.isOpenMetadataModal}
              metadataKeyInputValue={state.metadataKeyInputValue}
              metadataValueInputValue={state.metadataValueInputValue}
              currentMetadataObject={state.currentMetadataObject}
              updateMetadataObjectItem={updateMetadataObjectItem}
              handleDeleteMetadataObjectItem={handleDeleteMetadataObjectItem}
              onMetadataKeyInputValue={onMetadataKeyInputValue}
              onMetadataValueInputValue={onMetadataValueInputValue}
              addMetadataObjectItem={addMetadataObjectItem}
              toggleMetadataModal={toggleMetadataModal} />
            <MetacounterModal
              isOpenMetacounterModal={state.isOpenMetacounterModal}
              metacounterKeyInputValue={state.metacounterKeyInputValue}
              metacounterValueInputValue={state.metacounterValueInputValue}
              currentMetacounterObject={state.currentMetacounterObject}
              updateMetacounterObjectItem={updateMetacounterObjectItem}
              handleDeleteMetacounterObjectItem={handleDeleteMetacounterObjectItem}
              onMetacounterKeyInputValue={onMetacounterKeyInputValue}
              onMetacounterValueInputValue={onMetacounterValueInputValue}
              addMetacounterObjectItem={addMetacounterObjectItem}
              toggleMetacounterModal={toggleMetacounterModal} />
            <ChannelCreate
                showChannelCreate={state.showChannelCreate}
                toggleShowCreateChannel={toggleShowCreateChannel}
                onChannelNamenIputChange={onChannelNamenIputChange}
                handleCreateChannel={handleCreateChannel} />
            <Channel
              toggleMetadataModal={toggleMetadataModal}
              toggleMetacounterModal={toggleMetacounterModal}
              currentlyJoinedChannel={state.currentlyJoinedChannel}
              handleLeaveChannel={handleLeaveChannel}>
                <MessagesList
                    messages={state.messages}
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
                />
                <MessageInput
                    value={state.messageInputValue}
                    onChange={onMessageInputChange}
                    sendMessage={sendMessage}
                    fileSelected={state.file}
                    onFileInputChange={onFileInputChange} />
            </Channel>
        </>
    );
};

// Chat UI Components
const ChannelList = ({ channels, handleJoinChannel, toggleShowCreateChannel, handleDeleteChannel, toggleChannelDetails }) => {
    return (
        <div className='channel-list'>
            <div className="channel-type">
                <h1>Open Channels</h1>
                <button className="channel-create-button" onClick={toggleShowCreateChannel}>Create Channel</button>
            </div>
            {
                channels.map(channel => {
                    const userIsOperator = channel.operators.some((operator) => operator.userId === sb.currentUser.userId)
                    return (
                        <div key={channel.url} className="channel-list-item" >
                            <div className="channel-list-item-name"
                                onClick={() => { handleJoinChannel(channel.url) }}>
                                {channel.name}
                            </div>
                            {userIsOperator &&
                                <div>
                                    <button className="control-button" onClick={() => toggleChannelDetails(channel)}>
                                        <img className="channel-icon" src='/icon_edit.png' />

                                    </button>
                                    <button className="control-button" onClick={() => handleDeleteChannel(channel.url)}>
                                        <img className="channel-icon" src='/icon_delete.png' />

                                    </button>
                                </div>}
                        </div>);
                })
            }
        </div >);
}


const Channel = ({ currentlyJoinedChannel, handleLeaveChannel, children, toggleMetadataModal, toggleMetacounterModal }) => {
    if (currentlyJoinedChannel) {
        return <div className="channel">
            <div className="channel-header-wrapper">
              <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
              <div className="create-metadata-conteiner">
                <h4 className="create-metadata-title">Metadata: </h4>
                <button className="channel-create-button create-metadata-btn" onClick={() => toggleMetadataModal()}>Edit</button>
              </div>
              <div className="create-metadata-conteiner">
                <h4 className="create-metadata-title">Metacounter: </h4>
                <button className="channel-create-button create-metadata-btn" onClick={() => toggleMetacounterModal()}>Edit</button>
              </div>
            </div>
            <div>
                <button className="leave-channel" onClick={handleLeaveChannel}>Exit Channel</button>
            </div>
            <div>{children}</div>
        </div>;

    }
    return <div className="channel"></div>;

}

const ChannelHeader = ({ children }) => {
    return <div className="channel-header">{children}</div>;

}

const MessagesList = ({ messages, handleDeleteMessage, updateMessage }) => {
    return messages.map(message => {
        return (
            <div key={message.messageId} className="oc-message-item">
                <Message
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
                    message={message}
                />
            </div>);
    })
}

const Message = ({ message, updateMessage, handleDeleteMessage }) => {
    if (message.url) {
        return (
            <div className="oc-message">
                <div>{timestampToTime(message.createdAt)}</div>

                <div className="oc-message-sender-name">{message.sender.nickname}{' '}</div>

                <img src={message.url} />
            </div >);
    }

    const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;
    return (
        <div className="oc-message">
            <div>{timestampToTime(message.createdAt)}</div>

            <div className="oc-message-sender-name">{message.sender.nickname}{':'}</div>
            <div>{message.message}</div>

            {messageSentByCurrentUser && <>
                <button className="control-button" onClick={() => updateMessage(message)}>
                    <img className="oc-message-icon" src='/icon_edit.png' />
                </button>
                <button className="control-button" onClick={() => handleDeleteMessage(message)}>
                    <img className="oc-message-icon" src='/icon_delete.png' />
                </button>
            </>}


        </div >
    );

}

const MessageInput = ({ value, onChange, sendMessage, onFileInputChange }) => {
    return (
        <div className="message-input">
            <input
                placeholder="write a message"
                value={value}
                onChange={onChange} />

            <div className="message-input-buttons">
                <button className="send-message-button" onClick={sendMessage}>Send Message</button>
                <label className="file-upload-label" htmlFor="upload" >Select File</label>

                <input
                    id="upload"
                    className="file-upload-button"
                    type='file'
                    hidden={true}
                    onChange={onFileInputChange}
                    onClick={() => { }}
                />
            </div>

        </div>);
}

const ChannelDetails = ({
    currentlyUpdatingChannel,
    toggleChannelDetails,
    handleUpdateChannel,
    onChannelNamenIputChange
}) => {
    if (currentlyUpdatingChannel) {
        return <div className="overlay">
            <div className="overlay-content">

                <h3>Update Channel Details</h3>
                <div> Channel name</div>
                <input className="form-input" onChange={onChannelNamenIputChange} />

                <button className="form-button" onClick={() => toggleChannelDetails(null)}>Close</button>

                <button onClick={() => handleUpdateChannel()}>Update channel name</button>
            </div>
        </div >;
    }
    return null;
}

const ChannelCreate = ({
    showChannelCreate,
    toggleShowCreateChannel,
    handleCreateChannel,
    onChannelNamenIputChange
}) => {
    if (showChannelCreate) {
        return <div className="overlay">
            <div className="overlay-content">
                <div>
                    <h3>Create Channel</h3>
                </div>
                <div>Name</div>
                <input className="form-input" onChange={onChannelNamenIputChange} />
                <div>
                    <button className="form-button" onClick={handleCreateChannel}>Create</button>
                    <button className="form-button" onClick={toggleShowCreateChannel}>Cancel</button>
                </div>

            </div>
        </div >;
    }
    return null;
}

const CreateUserForm = ({
    setupUser,
    settingUpUser,
    userNameInputValue,
    userIdInputValue,
    onUserNameInputChange,
    onUserIdInputChange
}) => {
    if (settingUpUser) {
        return <div className="overlay">
            <div className="overlay-content">
                <div>User ID</div>

                <input
                    onChange={onUserIdInputChange}
                    className="form-input"
                    type="text" value={userIdInputValue} />

                <div>User Nickname</div>
                <input
                    onChange={onUserNameInputChange}
                    className="form-input"
                    type="text" value={userNameInputValue} />

                <div>

                    <button
                        className="user-submit-button"
                        onClick={setupUser}>Connect</button>
                </div>
            </div>

        </div>
    } else {
        return null;
    }

}

const MetadataModal = ({ isOpenMetadataModal, toggleMetadataModal, addMetadataObjectItem, metadataKeyInputValue, onMetadataKeyInputValue, onMetadataValueInputValue, metadataValueInputValue, currentMetadataObject, updateMetadataObjectItem, handleDeleteMetadataObjectItem }) => {
  const isEmpty = Object.keys(currentMetadataObject).length == 0;
  const keys = Object.keys(currentMetadataObject);

  if(isOpenMetadataModal) {
    return(
      <div className="overlay">
          <div className="overlay-content">
            <h3>Manage channel metadata</h3>
            {!isEmpty && keys.map((key) => {
              return (
                <div key={`${key}`} className="metadata-modal-list">
                  <div>{`${key}: `}{`${currentMetadataObject[key]}`}</div>
                  <button className="control-button" onClick={() => updateMetadataObjectItem(key, currentMetadataObject[key])}>
                    <img className="oc-message-icon" src='/icon_edit.png' />
                  </button>
                  <button className="control-button" onClick={() => handleDeleteMetadataObjectItem(key)}>
                    <img className="oc-message-icon" src='/icon_delete.png' />
                  </button>
                </div>
              )
            })}
            <div className="metadata-modal-input">
                <input type="text" placeholder="key" onChange={(e) => onMetadataKeyInputValue(e)} name="key" value={metadataKeyInputValue}></input>
                <input type="text" placeholder="value" onChange={(e) => onMetadataValueInputValue(e)} name="value" value={metadataValueInputValue}></input>
                <button onClick={() => addMetadataObjectItem()}>Add</button>
            </div>
            <button className="form-button" onClick={() => toggleMetadataModal()}>Close</button>
          </div>
      </div>
    )
  }
  return null;
}

const MetacounterModal = ({ isOpenMetacounterModal, toggleMetacounterModal, addMetacounterObjectItem, metacounterKeyInputValue, onMetacounterKeyInputValue, onMetacounterValueInputValue, metacounterValueInputValue, currentMetacounterObject, updateMetacounterObjectItem, handleDeleteMetacounterObjectItem }) => {
  const isEmpty = Object.keys(currentMetacounterObject).length == 0;
  const keys = Object.keys(currentMetacounterObject);

  if(isOpenMetacounterModal) {
    return(
      <div className="overlay">
          <div className="overlay-content">
            <h3>Manage channel metacounter</h3>
            {!isEmpty && keys.map((key) => {
              return (
                <div key={`${key}`} className="metadata-modal-list">
                  <div>{`${key}: `}{`${currentMetacounterObject[key]}`}</div>
                  <button className="control-button" onClick={() => updateMetacounterObjectItem(key, currentMetacounterObject[key])}>
                    <img className="oc-message-icon" src='/icon_edit.png' />
                  </button>
                  <button className="control-button" onClick={() => handleDeleteMetacounterObjectItem(key)}>
                    <img className="oc-message-icon" src='/icon_delete.png' />
                  </button>
                </div>
              )
            })}
            <div className="metadata-modal-input">
                <input type="text" placeholder="key" onChange={(e) => onMetacounterKeyInputValue(e)} name="key" value={metacounterKeyInputValue}></input>
                <input type="number" placeholder="value" onChange={(e) => onMetacounterValueInputValue(e)} name="value" value={metacounterValueInputValue}></input>
                <button onClick={() => addMetacounterObjectItem()}>Add</button>
            </div>
            <button className="form-button" onClick={() => toggleMetacounterModal()}>Close</button>
          </div>
      </div>
    )
  }
  return null;
}


// Helpful functions that call Sendbird
const loadChannels = async () => {
    try {
        const openChannelQuery = sb.openChannel.createOpenChannelListQuery({ limit: 30 });
        const channels = await openChannelQuery.next();
        return [channels, null];

    } catch (error) {
        return [null, error];
    }

}

const joinChannel = async (channel) => {
    try {
        await channel.enter();
        //list all messages
        const messageListParams = {};
        messageListParams.nextResultSize = 20;
        const messages = await channel.getMessagesByTimestamp(0, messageListParams);
        return [channel, messages, null];
    } catch (error) {
        return [null, null, error]
    }
}


const createChannel = async (channelName) => {
    try {
        const openChannelParams = {};
        openChannelParams.name = channelName;
        openChannelParams.operatorUserIds = [sb.currentUser.userId];
        const openChannel = await sb.openChannel.createChannel(openChannelParams);
        return [openChannel, null];
    } catch (error) {
        return [null, error];
    }

}

const deleteChannel = async (channelUrl) => {
    try {
        const channel = await sb.openChannel.getChannel(channelUrl);
        await channel.delete();
        return [channel, null];
    } catch (error) {
        return [null, error];
    }

}

const updateChannel = async (currentlyUpdatingChannel, channelNameInputValue) => {
    try {
        const channel = await sb.openChannel.getChannel(currentlyUpdatingChannel.url);
        const openChannelParams = {};
        openChannelParams.name = channelNameInputValue;

        openChannelParams.operatorUserIds = [sb.currentUser.userId];

        const updatedChannel = await channel.updateChannel(openChannelParams);
        return [updatedChannel, null];
    } catch (error) {
        return [null, error];
    }
}

const deleteMessage = async (currentlyJoinedChannel, messageToDelete) => {
    await currentlyJoinedChannel.deleteMessage(messageToDelete);
}

export default OpenChannelMetadataAndMetacounter;