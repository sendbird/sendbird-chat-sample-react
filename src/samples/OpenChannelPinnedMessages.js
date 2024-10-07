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

const OpenChannelPinnedMessage = (props) => {

    const [state, updateState] = useState({
        currentlyJoinedChannel: null,
        currentlyUpdatingChannel: null,
        currentlyJoinedChannelOperators: [],
        applicationUsers: [],
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
        isShowMembersList: false,
        showPinnedMessagesListModal: false,
        pinnedMessages: [],
        pinnedMessageIds: [],
        isPinMessage: false,
        isMaxCountPinnedMessagesError: false,
        maxCountPinnedMessages: 10,
    });

    //need to access state in message reeived callback
    const stateRef = useRef();
    stateRef.current = state;

    const channelRef = useRef();

    const onError = (error) => {
        updateState({ ...state, error: error.message });
        console.log(error);
    }

    const handleJoinChannel = async (channelUrl) => {
        const { channels } = state;
        updateState({ ...state, loading: true });
        const channelToJoin = channels.find((channel) => channel.url === channelUrl);
        const [channel, messages, error] = await joinChannel(channelToJoin);
        const [operators, operatorsError] = await getChannelOperators(channel);
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
        updateState({
           ...state,
           currentlyJoinedChannel: channel,
           messages: messages,
           loading: false,
           currentlyJoinedChannelOperators: operators,
           pinnedMessageIds: channel.pinnedMessageIds ?? [],
        })
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

    const handlePinMessage = async (message) => {
      const { currentlyJoinedChannel } = state;

      if (state.pinnedMessageIds.length >= state.maxCountPinnedMessages) {
          updateState({
              ...state,
              isMaxCountPinnedMessagesError: true
          })
      } else {
          await pinMessage(currentlyJoinedChannel, message);
          updateState({
              ...state,
              pinnedMessageIds: [...state.pinnedMessageIds, message.messageId]
          })
      }
  }

  const handleUnpinMessage = async (message) => {
      const { currentlyJoinedChannel } = state;
      await unpinMessage(currentlyJoinedChannel, message);

      updateState({ ...state, pinnedMessageIds: state.pinnedMessageIds.filter(pinnedMessageId => pinnedMessageId !== message.messageId) });
  }

    const setupUser = async () => {
        const { userNameInputValue, userIdInputValue } = state;
        const sendbirdChat = await SendbirdChat.init({
            appId: SENDBIRD_INFO.appId,
            localCacheEnabled: true,
            customApiHost: SENDBIRD_INFO.customApiHost,
            customWebSocketHost: SENDBIRD_INFO.customWebSocketHost,
            modules: [new OpenChannelModule()]
        });



        await sendbirdChat.connect(userIdInputValue);
        await sendbirdChat.setChannelInvitationPreference(true);

        const userUpdateParams = {};
        userUpdateParams.nickname = userNameInputValue;
        userUpdateParams.userId = userIdInputValue;
        await sendbirdChat.updateCurrentUserInfo(userUpdateParams);

        sb = sendbirdChat;
        updateState({ ...state, loading: true });
        const [channels, error] = await loadChannels();
        const [users, usersError] = await getAllApplicationUsers();
        if (error) {
            return onError(error);
        }
        updateState({ ...state, channels: channels, loading: false, settingUpUser: false, applicationUsers: users });
    }

    const toggleShowPinnedMessagesListModal = async () => {
      updateState({ ...state, showPinnedMessagesListModal: !state.showPinnedMessagesListModal });
    }

    const setMaxCountPinnedMessageError = (errorState) => {
        updateState({ ...state, isMaxCountPinnedMessagesError: errorState });
    }

    const toggleIsPinMessage = () => {
        if (state.pinnedMessageIds.length >= state.maxCountPinnedMessages) {
            updateState({ ...state, isMaxCountPinnedMessagesError: true })
        } else {
            updateState({ ...state, isPinMessage: !state.isPinMessage });
        }
    }

    const toggleMembersList = () => {
      updateState({ ...state, isShowMembersList: !state.isShowMembersList });
    }

    const handleOperator = async (callbackName, user) => {
      const { currentlyJoinedChannel, applicationUsers, currentlyJoinedChannelOperators } = state;

      try {
          await currentlyJoinedChannel[callbackName]([user.userId]);
          const [operators, operatorsError] = await getChannelOperators(currentlyJoinedChannel);
          updateState({ ...state, applicationUsers: applicationUsers, currentlyJoinedChannelOperators: operators })
      } catch (error) {
          console.log("Error");
          console.log(error);
      }
  }

  const registerUnregisterAnOperator = (user, isOperator) => {
      if(isOperator) {
          handleOperator("removeOperators", user);
          alert("Operator was unregister");
      } else {
          handleOperator("addOperators", user);
          alert("Operator was register");
      }
  }

  const muteUnmuteUser = (user, isOperator) => {
    const { currentlyJoinedChannel } = state;
    if (isOperator) {
        if (user.isMuted) {
            unmuteUser(currentlyJoinedChannel, user)
        } else {
            muteUser(currentlyJoinedChannel, user, 'description')
        }
    }

    const updatedUsers = state.applicationUsers.map(item => {
        if (item.userId === user.userId) {
            return { ...item, isMuted: !item.isMuted }
        }
        return item
    });

    updateState({ ...state, applicationUsers: updatedUsers });
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
          <ChannelCreate
              showChannelCreate={state.showChannelCreate}
              toggleShowCreateChannel={toggleShowCreateChannel}
              onChannelNamenIputChange={onChannelNamenIputChange}
              handleCreateChannel={handleCreateChannel} />
          <Channel
            currentlyJoinedChannel={state.currentlyJoinedChannel}
            operators={state.currentlyJoinedChannelOperators}
            userIdInputValue={state.userIdInputValue}
            handleLeaveChannel={handleLeaveChannel}
            channelRef={channelRef}
            pinnedMessageIds={state.pinnedMessageIds}
            toggleShowPinnedMessagesListModal={toggleShowPinnedMessagesListModal}
            toggleMembersList={toggleMembersList}>
              <MessagesList
                  messages={state.messages}
                  handleDeleteMessage={handleDeleteMessage}
                  updateMessage={updateMessage}
                  handlePinMessage={handlePinMessage}
                  handleUnpinMessage={handleUnpinMessage}
                  pinnedMessageIds={state.pinnedMessageIds}
              />
              <MessageInput
                  value={state.messageInputValue}
                  onChange={onMessageInputChange}
                  sendMessage={sendMessage}
                  fileSelected={state.file}
                  onFileInputChange={onFileInputChange}
                  toggleShowPinnedMessagesListModal={toggleShowPinnedMessagesListModal}
                  pinnedMessageIds={state.pinnedMessageIds}
                  isPinMessage={state.isPinMessage}
                  toggleIsPinMessage={toggleIsPinMessage} />
          </Channel>
          <MembersList
              toggleMembersList={toggleMembersList}
              isShowMembersList={state.isShowMembersList}
              users={state.applicationUsers}
              userIdInputValue={state.userIdInputValue}
              operators={state.currentlyJoinedChannelOperators}
              registerUnregisterAnOperator={registerUnregisterAnOperator}
              muteUnmuteUser={muteUnmuteUser}
          />
          <PinnedMessagesListModal
              messages={state.messages}
              pinnedMessageIds={state.pinnedMessageIds}
              showPinnedMessagesListModal={state.showPinnedMessagesListModal}
              toggleShowPinnedMessagesListModal={toggleShowPinnedMessagesListModal}
              handleUnpinMessage={handleUnpinMessage}
          />
          <ErrorModal
              isMaxCountPinnedMessagesError={state.isMaxCountPinnedMessagesError}
              setMaxCountPinnedMessageError={setMaxCountPinnedMessageError}
          />
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


const Channel = ({ currentlyJoinedChannel, handleLeaveChannel, children, toggleMembersList, operators, userIdInputValue, channelRef, pinnedMessageIds, toggleShowPinnedMessagesListModal }) => {
    if (currentlyJoinedChannel) {
        const isOperator = operators.find((operator) => userIdInputValue === operator.userId)
        return <div className="channel" ref={channelRef}>
            <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
            <div>
                <button className="leave-channel" onClick={handleLeaveChannel}>Exit Channel</button>
                <button className="leave-channel" onClick={toggleShowPinnedMessagesListModal}>{pinnedMessageIds ? pinnedMessageIds.length : 0} pinned</button>
                {isOperator && <button className="leave-channel register-as-operator-btn" onClick={toggleMembersList}>Open users list</button>}
            </div>
            <div>{children}</div>
        </div>;

    }
    return <div className="channel"></div>;

}

const ChannelHeader = ({ children }) => {
    return <div className="channel-header">{children}</div>;

}

const MessagesList = ({ messages, pinnedMessageIds, handleDeleteMessage, updateMessage, handlePinMessage, handleUnpinMessage }) => {
    return <div className="message-list">
        {messages.map(message => {
            //if (!message.sender) return null;
            const messageSentByYou = message.sender.userId === sb.currentUser.userId;
            return (
                <div key={message.messageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                    <Message
                        message={message}
                        pinnedMessageIds={pinnedMessageIds}
                        handleDeleteMessage={handleDeleteMessage}
                        updateMessage={updateMessage}
                        handlePinMessage={handlePinMessage}
                        handleUnpinMessage={handleUnpinMessage} />
                </div>
            );
        })}
    </div>
}

const Message = ({ message, pinnedMessageIds, updateMessage, handleDeleteMessage, handlePinMessage, handleUnpinMessage }) => {
    const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;
    const isPinnedMessage = pinnedMessageIds.includes(message.messageId);

    if (message.url) {
        return (
            <div className={`message  ${messageSentByCurrentUser ? 'message-from-you' : ''}`}>
              <div className="message-info">
                <div className="message-user-info">
                  <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                  <div>{timestampToTime(message.createdAt)}</div>
                </div>
                <div>
                  {messageSentByCurrentUser &&
                    <div>
                      {isPinnedMessage ?
                          <button className="control-button" onClick={() => handleUnpinMessage(message)}>
                            <img className="message-icon" src='/icon_unpin.png' />
                          </button> :
                          <button className="control-button" onClick={() => handlePinMessage(message)}>
                            <img className="message-icon" src='/icon_pin.png' />
                          </button>}
                    </div>}
                </div>
              </div>

              <img className="message-img" src={message.url} />
            </div >);
    }

    return (
        <div className={`message  ${messageSentByCurrentUser ? 'message-from-you' : ''}`}>
            <div className="message-info">
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.createdAt)}</div>
                </div>
                {messageSentByCurrentUser &&
                    <div>
                        {isPinnedMessage ?
                        <button className="control-button" onClick={() => handleUnpinMessage(message)}>
                          <img className="message-icon" src='/icon_unpin.png' />
                        </button> :
                        <button className="control-button" onClick={() => handlePinMessage(message)}>
                          <img className="message-icon" src='/icon_pin.png' />
                        </button>}

                        <button className="control-button" onClick={() => updateMessage(message)}><img className="message-icon" src='/icon_edit.png' /></button>
                        <button className="control-button" onClick={() => handleDeleteMessage(message)}><img className="message-icon" src='/icon_delete.png' /></button>
                    </div>}
            </div>
            <div>{message.message}</div>
        </div>
    );
}

const PinnedMessage = ({ message, handleUnpinMessage, messageSentByYou }) => {
  const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;

  if (message.url) {
      return (
          <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
            <div className="message-info">
              <div className="message-user-info">
                <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                <div>{timestampToTime(message.createdAt)}</div>
              </div>
              <div>
                {messageSentByCurrentUser &&
                  <div>
                    <button className="control-button" onClick={() => handleUnpinMessage(message)}>
                      <img className="message-icon" src='/icon_unpin.png' />
                    </button>
                  </div>}
              </div>
            </div>
            <img className="message-img" src={message.url} />
          </div >);
  }

  return (
      <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
          <div className="message-info">
              <div className="message-user-info">
                  <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                  <div>{timestampToTime(message.createdAt)}</div>
              </div>
              {messageSentByCurrentUser &&
                  <div>
                      <button className="control-button" onClick={() => handleUnpinMessage(message)}><img className="message-icon" src='/icon_unpin.png' /></button>
                  </div>}
          </div>
          <div>{message.message}</div>
      </div>
  );
}

const MessageInput = ({ value, onChange, sendMessage, onFileInputChange, onPineMessage }) => {
    return (
        <div className="message-input">
            <input
                placeholder="write a message"
                value={value}
                onChange={onChange} />

            <div className="message-input-buttons">
                <button className="send-message-button" onClick={sendMessage}>Send Message</button>
                <label className="file-upload-label" htmlFor="upload" >Select File</label>
                <checkbox className="pin-message-checkbox" onClick={onPineMessage}>Pin message</checkbox>

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

const MembersList = ({ toggleMembersList, isShowMembersList, users, registerUnregisterAnOperator, userIdInputValue, operators, muteUnmuteUser }) => {
  if (isShowMembersList && users) {
      return <div className="members-list">
          <button onClick={toggleMembersList}>Close</button>
          {users.map((user) => {
              const isOperator = operators.find((operator) => user.userId === operator.userId);
              const userIsNotSender = (user.userId !== userIdInputValue);
              return(
                <div key={user.userId}>
                  <div key={user.userId} className="member-item-wrapper">
                    <div className="member-item">
                      {user.nickname}
                      {isOperator && <img className="message-icon" src='/operator_icon.png' />}
                    </div>
                    {userIsNotSender && <button onClick={() => registerUnregisterAnOperator(user, isOperator)}>
                      {isOperator ? "Unregister as operator" : "Register as operator"}
                    </button>}
                    {userIsNotSender && <button className="mute-button" onClick={() => muteUnmuteUser(user, isOperator)}>
                      {user.isMuted ? "Unmute" : "Mute"}
                    </button>}
                  </div>
                </div>
              )
            })}
      </div>;
  } else {
      return null;
  }
}

const ErrorModal = ({
  isMaxCountPinnedMessagesError,
  setMaxCountPinnedMessageError
}) => {
  if (isMaxCountPinnedMessagesError) {
      return <div className="overlay ">
          <div className="overlay-content scheduled-messages-list-modal">
              <div>
                  <p>The maximum number of pinned messages cannot exceed 10</p>
              </div>

              <button
                  className="close-button"
                  onClick={() => setMaxCountPinnedMessageError(false)}
              >
                  <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                      <path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z" />
                  </svg>
              </button>
          </div>
      </div>
  } else {
      return null;
  }
}

const PinnedMessagesListModal = ({
  showPinnedMessagesListModal,
  toggleShowPinnedMessagesListModal,
  messages,
  handleUnpinMessage,
  pinnedMessageIds
}) => {
  const pinnedMessages = messages.filter(message => pinnedMessageIds.includes(message.messageId))

  if (showPinnedMessagesListModal) {
      return <div className="overlay ">
          <div className="overlay-content scheduled-messages-list-modal">
              <div className="scheduled-message-header">Pinned messages</div>

              <div className="message-list">
                  {pinnedMessages.map(message => {
                      const messageSentByYou = message.sender.userId === sb.currentUser.userId;
                      return (
                          <div key={message.messageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                              <PinnedMessage
                                  message={message}
                                  handleUnpinMessage={handleUnpinMessage}
                                  messageSentByYou={messageSentByYou} />
                          </div>
                      );
                  })}
              </div>

              <button
                  className="close-button"
                  onClick={toggleShowPinnedMessagesListModal}
              >
                  <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                      <path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z" />
                  </svg>
              </button>
          </div>
      </div>
  } else {
      return null;
  }
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

const pinMessage = async (currentlyJoinedChannel, message) => {
  await currentlyJoinedChannel.pinMessage(message.messageId);
}

const unpinMessage = async (currentlyJoinedChannel, message) => {
  await currentlyJoinedChannel.unpinMessage(message.messageId);
}

const getAllApplicationUsers = async () => {
  try {
      const userQuery = sb.createApplicationUserListQuery({ limit: 100 });
      const users = await userQuery.next();
      return [users, null];
  } catch (error) {
      return [null, error];
  }
}

const getChannelOperators = async (channel) => {
  try {
    const query = channel.createOperatorListQuery();
    const operators = await query.next();
    return [operators, null];
  } catch (error) {
    return [null, error];
  }
}

const muteUser = async (channel, userId, description) => {
  await channel.muteUser(userId, 600000, description);
}

const unmuteUser = async (channel, userId) => {
  await channel.unmuteUser(userId);
}

export default OpenChannelPinnedMessage;