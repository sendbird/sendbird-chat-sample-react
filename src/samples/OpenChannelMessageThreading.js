import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import SendbirdChat, { UserUpdateParams } from '@sendbird/chat';
import {
    OpenChannelModule,
    OpenChannelHandler,
    OpenChannelCreateParams,
    OpenChannelUpdateParams
} from '@sendbird/chat/openChannel';

import {
    UserMessageUpdateParams,
    UserMessageCreateParams,
    MessageListParams,
    FileMessageCreateParams,
    MessageRetrievalParams,
    ThreadedMessageListParams
} from '@sendbird/chat/message';

import { SENDBIRD_INFO } from '../constants/constants';
import { timestampToTime } from '../utils/messageUtils';

let sb;

const BasicOpenChannelSample = (props) => {

    const [state, updateState] = useState({
        currentlyJoinedChannel: null,
        currentlyUpdatingChannel: null,
        treadsParentsMessage: {},
        treadsMessages: [],
        messages: [],
        channels: [],
        showChannelCreate: false,
        treadsMessageInputValue: "",
        messageInputValue: "",
        userNameInputValue: "",
        userIdInputValue: "",
        channelNameInputValue: "",
        isOpenTread: false,
        settingUpUser: true,
        file: null,
        messageToUpdate: null,
        loading: false,
        error: false
    });

    //need to access state in message reeived callback
    const stateRef = useRef();
    stateRef.current = state;

    const onError = (error) => {
        updateState({ ...state, error: error.message });
        console.log(error);
    }

    const handleJoinChannel = async (channelUrl) => {
        const { channels } = state;
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

    const onTreadsMessageInputChange = (e) => {
      const treadsMessageInputValue = e.currentTarget.value;
      updateState({ ...state, treadsMessageInputValue });
    }

    const sendMessage = async () => {
        const { messageToUpdate, currentlyJoinedChannel, messages } = state;

        if (messageToUpdate) {
            const userMessageUpdateParams = new UserMessageUpdateParams();
            userMessageUpdateParams.message = state.messageInputValue;
            const updatedMessage = await currentlyJoinedChannel.updateUserMessage(messageToUpdate.messageId, userMessageUpdateParams)
            const messageIndex = messages.findIndex((item => item.messageId == messageToUpdate.messageId));
            messages[messageIndex] = updatedMessage;
            updateState({ ...state, messages: messages, messageInputValue: "", messageToUpdate: null });
        } else {
            const userMessageParams = new UserMessageCreateParams();
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

    const sendTreadMessage = async () => {
      const { currentlyJoinedChannel, treadsMessages, treadsParentsMessage } = state;

      const userMessageParams = new UserMessageCreateParams({parentMessageId: treadsParentsMessage.messageId});
      userMessageParams.message = state.treadsMessageInputValue;
      currentlyJoinedChannel.sendUserMessage(userMessageParams).onSucceeded((message) => {
        const updatedMessages = [...treadsMessages, message];
        updateState({ ...state, treadsMessages: updatedMessages, treadsMessageInputValue: "" });

      }).onFailed((error) => {
          console.log(error)
          console.log("failed")
        });
  }

    const onFileInputChange = async (e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            const { currentlyJoinedChannel, messages } = state;
            const fileMessageParams = new FileMessageCreateParams();
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

    const openTreads = async (parentsMessage) => {
      const { currentlyJoinedChannel } = state;

      const params = new MessageRetrievalParams({
        messageId: parentsMessage.messageId,
        channelType: "open", // Acceptable values are open and group.
        channelUrl: currentlyJoinedChannel.url,
      });

      const paramsThreadedMessageListParams = new ThreadedMessageListParams({
        prevResultSize: 10,
        nextResultSize: 10,
        isInclusive: true,
        reverse: false,
        includeParentMessageInfo: false,
      })

      const { parentMessage, threadedMessages } = await parentsMessage.getThreadedMessagesByTimestamp(30, paramsThreadedMessageListParams);

      const message = await sb.message.getMessage(params);
      updateState({ ...state, isOpenTread: true, treadsParentsMessage: message, treadsMessages: threadedMessages })
    }

    const exitTreads = async () => {
      updateState({ ...state, isOpenTread: false })
    }

    const setupUser = async () => {
        const { userNameInputValue, userIdInputValue } = state;
        const sendbirdChat = await SendbirdChat.init({
            appId: SENDBIRD_INFO.appId,
            localCacheEnabled: false,
            modules: [new OpenChannelModule()]
        });



        await sendbirdChat.connect(userIdInputValue);
        await sendbirdChat.setChannelInvitationPreference(true);

        const userUpdateParams = new UserUpdateParams();
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
            <Channel currentlyJoinedChannel={state.currentlyJoinedChannel} handleLeaveChannel={handleLeaveChannel}>
                <MessagesList
                    messages={state.messages}
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
                    openTreads={openTreads}
                />
                <MessageInput
                    value={state.messageInputValue}
                    onChange={onMessageInputChange}
                    sendMessage={sendMessage}
                    fileSelected={state.file}
                    isOpenTread={state.isOpenTread}
                    onFileInputChange={onFileInputChange} />
            </Channel>
            <Treads
              isOpenTread={state.isOpenTread}
              openTreads={openTreads}
              exitTreads={exitTreads}
              handleDeleteMessage={handleDeleteMessage}
              updateMessage={updateMessage}
              treadsParentsMessage={state.treadsParentsMessage}
            >
                <MessagesList
                    displayNone={"display-none"}
                    messages={state.treadsMessages}
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
                />
                <MessageInput
                    treadsInputClass={"treads-input"}
                    value={state.treadsMessageInputValue}
                    isOpenTread={state.isOpenTread}
                    onChange={onTreadsMessageInputChange}
                    sendMessage={sendTreadMessage}
                    fileSelected={state.file}
                    onFileInputChange={onFileInputChange} />
            </Treads>
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


const Channel = ({ currentlyJoinedChannel, handleLeaveChannel, children }) => {
    if (currentlyJoinedChannel) {
        return <div className="channel">
            <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
            <div>
                <button className="leave-channel" onClick={handleLeaveChannel}>Exit Channel</button>
            </div>
            <div>{children}</div>
        </div>;

    }
    return <div className="channel"></div>;

}

const Treads = ({ isOpenTread, exitTreads, children, treadsParentsMessage, handleDeleteMessage, updateMessage}) => {
  if (isOpenTread) {
    return <div className="channel treads">
      <ChannelHeader>Treads</ChannelHeader>
      <div>
        <button className="leave-channel" onClick={() => exitTreads()}>Exit Treads</button>
      </div>
      <Message
        displayNone={"display-none"}
        isOpenTread={isOpenTread}
        handleDeleteMessage={handleDeleteMessage}
        updateMessage={updateMessage}
        message={treadsParentsMessage}
      />
      <div className="underline" />
      <div>{children}</div>
    </div>
  }

  return null
}

const ChannelHeader = ({ children }) => {
    return <div className="channel-header">{children}</div>;

}

const MessagesList = ({ messages, handleDeleteMessage, updateMessage, openTreads, displayNone }) => {
    return messages.map(message => {
        return (
            <div key={message.messageId} className="oc-message-item">
                <Message
                    displayNone={displayNone}
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
                    message={message}
                    openTreads={openTreads}
                />
            </div>);
    })
}

const Message = ({ message, updateMessage, handleDeleteMessage, openTreads, isOpenTread, displayNone = "" }) => {
    if (message.url) {
        return (
            <div className="oc-message">
                <div>{timestampToTime(message.createdAt)}</div>

                <div className="oc-message-sender-name">{message.sender.nickname}{' '}</div>

                <img src={message.url} />
                {!isOpenTread && <button className={`control-button ${displayNone}`} onClick={() => openTreads(message)}>
                    <img className="oc-message-icon" src='/icon_thread.png' />
                </button>}
            </div >);
    }

    const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;
    return (
        <div className="oc-message">
            <div>{timestampToTime(message.createdAt)}</div>

            <div className="oc-message-sender-name">{message.sender.nickname}{':'}</div>
            <div>{message.message}</div>

            {messageSentByCurrentUser && <>
                <button className={`control-button ${displayNone}`} onClick={() => updateMessage(message)}>
                    <img className="oc-message-icon" src='/icon_edit.png' />
                </button>
                <button className={`control-button ${displayNone}`} onClick={() => handleDeleteMessage(message)}>
                    <img className="oc-message-icon" src='/icon_delete.png' />
                </button>
            </>}
            {!isOpenTread && <button className={`control-button ${displayNone}`} onClick={() => openTreads(message)}>
                  <img className="oc-message-icon" src='/icon_thread.png' />
              </button>}


        </div >
    );

}

const MessageInput = ({ value, onChange, sendMessage, onFileInputChange, isOpenTread, treadsInputClass = "" }) => {
    return (
        <div className={`message-input ${treadsInputClass} ${isOpenTread ? "message-input-column" : ""}`}>
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
        const messageListParams = new MessageListParams();
        messageListParams.nextResultSize = 20;
        const messages = await channel.getMessagesByTimestamp(0, messageListParams);
        return [channel, messages, null];
    } catch (error) {
        return [null, null, error]
    }
}


const createChannel = async (channelName) => {
    try {
        const openChannelParams = new OpenChannelCreateParams();
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
        const openChannelParams = new OpenChannelUpdateParams();
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

export default BasicOpenChannelSample;