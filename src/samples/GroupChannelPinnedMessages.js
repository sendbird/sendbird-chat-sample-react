import { useState, useEffect, useRef } from 'react';
import SendbirdChat from '@sendbird/chat';
import {
    GroupChannelModule,
    GroupChannelFilter,
    GroupChannelListOrder,
    MessageFilter,
    MessageCollectionInitPolicy
} from '@sendbird/chat/groupChannel';

import { SENDBIRD_INFO } from '../constants/constants';
import { timestampToTime, handleEnterPress } from '../utils/messageUtils';
let sb;

const GroupChannelPinnedMessages = (props) => {

    const [state, updateState] = useState({
        applicationUsers: [],
        groupChannelMembers: [],
        currentlyJoinedChannel: null,
        messages: [],
        channels: [],
        messageInputValue: "",
        userNameInputValue: "",
        userIdInputValue: "",
        channelNameUpdateValue: "",
        settingUpUser: true,
        file: null,
        messageToUpdate: null,
        messageCollection: null,
        loading: false,
        error: false,
        showPinnedMessagesListModal: false,
        pinnedMessages: [],
        pinnedMessageIds: [],
        isPinMessage: false,
        isMaxCountPinnedMessagesError: false,
        maxCountPinnedMessages: 10,
    });

    //need to access state in message received callback
    const stateRef = useRef();
    stateRef.current = state;

    const channelRef = useRef();

    const channelHandlers = {
        onChannelsAdded: (context, channels) => {
            const updatedChannels = [...channels, ...stateRef.current.channels];
            updateState({ ...stateRef.current, channels: updatedChannels, applicationUsers: [] });
        },
        onChannelsDeleted: (context, channels) => {
            const updatedChannels = stateRef.current.channels.filter((channel) => {
                return !channels.includes(channel.url);
            });
            updateState({ ...stateRef.current, channels: updatedChannels });

        },
        onChannelsUpdated: (context, channels) => {
            const updatedChannels = stateRef.current.channels.map((channel) => {
                const updatedChannel = channels.find(incomingChannel => incomingChannel.url === channel.url);
                if (updatedChannel) {
                    return updatedChannel;
                } else {
                    return channel;
                }
            });

            updateState({ ...stateRef.current, channels: updatedChannels });
        },
    }

    const messageHandlers = {
        onMessagesAdded: (context, channel, messages) => {
            const updatedMessages = [...stateRef.current.messages, ...messages];

            updateState({ ...stateRef.current, messages: updatedMessages });

        },
        onMessagesUpdated: (context, channel, messages) => {
            const updatedMessages = [...stateRef.current.messages];
            for (let i in messages) {
                const incomingMessage = messages[i];
                const indexOfExisting = stateRef.current.messages.findIndex(message => {
                    return incomingMessage.reqId === message.reqId;
                });

                if (indexOfExisting !== -1) {
                    updatedMessages[indexOfExisting] = incomingMessage;
                }
                if (!incomingMessage.reqId) {
                    updatedMessages.push(incomingMessage);
                }
            }


            updateState({ ...stateRef.current, messages: updatedMessages });
        },
        onMessagesDeleted: (context, channel, messageIds) => {
            const updateMessages = stateRef.current.messages.filter((message) => {
                return !messageIds.includes(message.messageId);
            });
            updateState({ ...stateRef.current, messages: updateMessages });

        },
        onChannelUpdated: (context, channel) => {

        },
        onChannelDeleted: (context, channelUrl) => {
        },
        onHugeGapDetected: () => {
        }
    }

    const scrollToBottom = (item, smooth) => {
        item?.scrollTo({
            top: item.scrollHeight,
            behavior: smooth
        })
    }

    useEffect(() => {
        scrollToBottom(channelRef.current)
    }, [state.currentlyJoinedChannel])

    useEffect(() => {
        scrollToBottom(channelRef.current, 'smooth')
    }, [state.messages])

    const onError = (error) => {
        updateState({ ...state, error: error.message });
        console.log(error);
    }

    const handleJoinChannel = async (channelUrl) => {
        if (state.messageCollection && state.messageCollection.dispose) {
            state.messageCollection?.dispose();
        }

        if (state.currentlyJoinedChannel?.url === channelUrl) {
            return null;
        }
        const { channels } = state;
        updateState({ ...state, loading: true });
        const channel = channels.find((channel) => channel.url === channelUrl);
        const onCacheResult = (err, messages) => {
            updateState({ ...stateRef.current, currentlyJoinedChannel: channel, messages: messages.reverse(), loading: false })

        }

        const onApiResult = (err, messages) => {
            updateState({ ...stateRef.current, currentlyJoinedChannel: channel, messages: messages.reverse(), loading: false })
        }

        const collection = loadMessages(channel, messageHandlers, onCacheResult, onApiResult);

        updateState({ ...state, messageCollection: collection, pinnedMessageIds: channel.pinnedMessageIds });
    }

    const handleLeaveChannel = async () => {
        const { currentlyJoinedChannel } = state;
        await currentlyJoinedChannel.leave();

        updateState({ ...state, currentlyJoinedChannel: null })
    }

    const handleCreateChannel = async (channelName = "testChannel",) => {
        const [groupChannel, error] = await createChannel(channelName, state.groupChannelMembers);
        if (error) {
            return onError(error);
        }
    }

    const handleUpdateChannelMembersList = async () => {
        const { currentlyJoinedChannel, groupChannelMembers } = state;
        await inviteUsersToChannel(currentlyJoinedChannel, groupChannelMembers);
        updateState({ ...state, applicationUsers: [] });
    }

    const handleDeleteChannel = async (channelUrl) => {
        const [channel, error] = await deleteChannel(channelUrl);
        if (error) {
            return onError(error);
        }
    }

    const handleMemberInvite = async () => {
        const [users, error] = await getAllApplicationUsers();
        if (error) {
            return onError(error);
        }
        updateState({ ...state, applicationUsers: users });
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
        const { messageToUpdate, currentlyJoinedChannel, messages, isPinMessage } = state;
        if (messageToUpdate) {
            const userMessageUpdateParams = {};
            userMessageUpdateParams.message = state.messageInputValue
            const updatedMessage = await currentlyJoinedChannel.updateUserMessage(messageToUpdate.messageId, userMessageUpdateParams)
            const messageIndex = messages.findIndex((item => item.messageId == messageToUpdate.messageId));
            messages[messageIndex] = updatedMessage;
            updateState({ ...state, messages: messages, messageInputValue: "", messageToUpdate: null });
        } else {
            const userMessageParams = {};
            userMessageParams.message = state.messageInputValue
            userMessageParams.isPinnedMessage = isPinMessage

            currentlyJoinedChannel.sendUserMessage(userMessageParams)
                .onSucceeded((message) => {
                    if (isPinMessage) {
                        updateState({
                            ...stateRef.current,
                            messageInputValue: "",
                            pinnedMessageIds: [...state.pinnedMessageIds, message.messageId],
                            isPinMessage: false
                        });
                    } else {
                        updateState({
                            ...stateRef.current,
                            messageInputValue: "",
                            isPinMessage: false
                        });
                    }
                })
                .onFailed((error) => {
                    console.log(error)
                    console.log("failed")
                });
        }
    }

    const onFileInputChange = async (e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            const { currentlyJoinedChannel, messages, isPinMessage } = state;
            const fileMessageParams = {};
            fileMessageParams.file = e.currentTarget.files[0];
            fileMessageParams.isPinnedMessage = isPinMessage

            currentlyJoinedChannel.sendFileMessage(fileMessageParams)
                .onSucceeded((message) => {
                    if (isPinMessage) {
                        updateState({
                            ...stateRef.current,
                            messageInputValue: "",
                            pinnedMessageIds: [...state.pinnedMessageIds, message.messageId],
                            file: null,
                            isPinMessage: false
                        });
                    } else {
                        updateState({
                            ...stateRef.current,
                            messageInputValue: "",
                            file: null,
                            isPinMessage: false
                        });
                    }
                })
                .onFailed((error) => {
                    console.log(error)
                    console.log("failed")
                });
        }
    }

    const handleDeleteMessage = async (messageToDelete) => {
        const { currentlyJoinedChannel } = state;
        await deleteMessage(currentlyJoinedChannel, messageToDelete); // Delete

        updateState({
            ...state,
            pinnedMessageIds: state.pinnedMessageIds.filter(pinnedMessageId => pinnedMessageId !== messageToDelete.messageId)
        });
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

    const handleLoadMemberSelectionList = async () => {
        updateState({ ...state, currentlyJoinedChannel: null });
        const [users, error] = await getAllApplicationUsers();
        if (error) {
            return onError(error);
        }
        updateState({ ...state, currentlyJoinedChannel: null, applicationUsers: users, groupChannelMembers: [sb.currentUser.userId] });
    }

    const addToChannelMembersList = (userId) => {
        const groupChannelMembers = [...state.groupChannelMembers, userId];
        updateState({ ...state, groupChannelMembers: groupChannelMembers });
    }

    const setupUser = async () => {
        const { userNameInputValue, userIdInputValue } = state;
        const sendbirdChat = await SendbirdChat.init({
            appId: SENDBIRD_INFO.appId,
            localCacheEnabled: true,
            modules: [new GroupChannelModule()]
        });

        await sendbirdChat.connect(userIdInputValue);
        await sendbirdChat.setChannelInvitationPreference(true);

        const userUpdateParams = {};
        userUpdateParams.nickname = userNameInputValue;
        userUpdateParams.userId = userIdInputValue;
        await sendbirdChat.updateCurrentUserInfo(userUpdateParams);

        sb = sendbirdChat;
        updateState({ ...state, loading: true });
        const [channels, error] = await loadChannels(channelHandlers);
        if (error) {
            return onError(error);
        }

        updateState({ ...state, channels: channels, loading: false, settingUpUser: false });
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
                onUserNameInputChange={onUserNameInputChange}
            />
            <ChannelList
                channels={state.channels}
                handleJoinChannel={handleJoinChannel}
                handleCreateChannel={handleLoadMemberSelectionList}
                handleDeleteChannel={handleDeleteChannel}
                handleLoadMemberSelectionList={handleLoadMemberSelectionList}
            />
            <MembersSelect
                applicationUsers={state.applicationUsers}
                groupChannelMembers={state.groupChannelMembers}
                currentlyJoinedChannel={state.currentlyJoinedChannel}
                addToChannelMembersList={addToChannelMembersList}
                handleCreateChannel={handleCreateChannel}
                handleUpdateChannelMembersList={handleUpdateChannelMembersList}
            />
            <Channel
                currentlyJoinedChannel={state.currentlyJoinedChannel}
                handleLeaveChannel={handleLeaveChannel}
                channelRef={channelRef}
                pinnedMessageIds={state.pinnedMessageIds}
                toggleShowPinnedMessagesListModal={toggleShowPinnedMessagesListModal}
            >
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
                    toggleIsPinMessage={toggleIsPinMessage}
                />
            </Channel>
            <MembersList
                channel={state.currentlyJoinedChannel}
                handleMemberInvite={handleMemberInvite}
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
const ChannelList = ({
    channels,
    handleJoinChannel,
    handleDeleteChannel,
    handleLoadMemberSelectionList
}) => {
    return (
        <div className='channel-list'>
            <div className="channel-type">
                <h1>Group Channels</h1>
                <button className="channel-create-button" onClick={() => handleLoadMemberSelectionList()}>Create Channel</button>
            </div>
            {channels.map(channel => {
                return (
                    <div key={channel.url} className="channel-list-item" >
                        <div
                            className="channel-list-item-name"
                            onClick={() => { handleJoinChannel(channel.url) }}>
                            <ChannelName members={channel.members} />
                            <div className="last-message">{channel.lastMessage?.message}</div>
                        </div>
                        <div>
                            <button className="control-button" onClick={() => handleDeleteChannel(channel.url)}>
                                <img className="channel-icon" src='/icon_delete.png' />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div >);
}

const ChannelName = ({ members }) => {
    const membersToDisplay = members.slice(0, 2);
    const membersNotToDisplay = members.slice(2);

    return <>
        {membersToDisplay.map((member) => {
            return <span key={member.userId}>{member.nickname}</span>
        })}
        {membersNotToDisplay.length > 0 && `+ ${membersNotToDisplay.length}`}
    </>
}

const Channel = ({ currentlyJoinedChannel, children, handleLeaveChannel, channelRef, pinnedMessageIds, toggleShowPinnedMessagesListModal }) => {
    if (currentlyJoinedChannel) {
        return <div className="channel" ref={channelRef}>
            <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
            <div>
                <button className="leave-channel" onClick={handleLeaveChannel}>Leave Channel</button>
                <button className="leave-channel" onClick={toggleShowPinnedMessagesListModal}>{pinnedMessageIds.length} pinned</button>
            </div>
            <div>{children}</div>
        </div>;
    }
    return <div className="channel"></div>;
}

const ChannelHeader = ({ children }) => {
    return <div className="channel-header">{children}</div>;
}

const MembersList = ({ channel, handleMemberInvite }) => {
    if (channel) {
        return <div className="members-list">
            <button onClick={handleMemberInvite}>Invite</button>
            {channel.members.map((member) =>
                <div className="member-item" key={member.userId}>{member.nickname}</div>
            )}
        </div>;
    } else {
        return null;
    }
}

const MessagesList = ({ messages, pinnedMessageIds, handleDeleteMessage, updateMessage, handlePinMessage, handleUnpinMessage }) => {
    return <div className="message-list">
        {messages.map(message => {
            if (!message.sender) return null;
            const messageSentByYou = message.sender.userId === sb.currentUser.userId;
            return (
                <div key={message.messageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                    <Message
                        message={message}
                        pinnedMessageIds={pinnedMessageIds}
                        handleDeleteMessage={handleDeleteMessage}
                        updateMessage={updateMessage}
                        handlePinMessage={handlePinMessage}
                        handleUnpinMessage={handleUnpinMessage}
                        messageSentByYou={messageSentByYou} />
                    <ProfileImage user={message.sender} />
                </div>
            );
        })}
    </div>
}

const Message = ({ message, pinnedMessageIds, updateMessage, handleDeleteMessage, handlePinMessage, handleUnpinMessage, messageSentByYou }) => {
    const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;
    const isPinnedMessage = pinnedMessageIds.includes(message.messageId);

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
        <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
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

const ProfileImage = ({ user }) => {
    if (user.plainProfileUrl) {
        return <img className="profile-image" src={user.plainProfileUrl} />
    } else {
        return <div className="profile-image-fallback">{user.nickname.charAt(0)}</div>;
    }
}

const MessageInput = ({
    value,
    onChange,
    sendMessage,
    onFileInputChange,
    pinnedMessageIds,
    toggleShowPinnedMessagesListModal,
    isPinMessage,
    toggleIsPinMessage
}) => {
    return (
        <div className="message-input">
            <input
                placeholder="write a message"
                value={value}
                onChange={onChange}
                onKeyDown={(event => handleEnterPress(event, sendMessage))}
            />
            <div className="message-input-buttons">
                <button className="send-message-button" onClick={sendMessage}>Send Message</button>
                <div className="freeze-channel pin-checkbox">
                  <input type="checkbox" onChange={toggleIsPinMessage} checked={isPinMessage} />
                  pin
                </div>
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
        </div>
    );
}

const MembersSelect = ({
    applicationUsers,
    groupChannelMembers,
    currentlyJoinedChannel,
    addToChannelMembersList,
    handleCreateChannel,
    handleUpdateChannelMembersList

}) => {
    if (applicationUsers.length > 0) {
        return <div className="overlay">
            <div className="overlay-content">
                <button onClick={() => {
                    if (currentlyJoinedChannel) {
                        handleUpdateChannelMembersList();
                    } else {
                        handleCreateChannel();
                    }
                }}>{currentlyJoinedChannel ? 'Submit' : 'Create'}</button>
                {applicationUsers.map((user) => {
                    const userSelected = groupChannelMembers.some((member) => member === user.userId);
                    return <div
                        key={user.userId}
                        className={`member-item ${userSelected ? 'member-selected' : ''}`}
                        onClick={() => addToChannelMembersList(user.userId)}>
                        <ProfileImage user={user} />
                        <div className="member-item-name">{user.nickname}</div>
                    </div>
                })}
            </div>
        </div>;
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
            <div className="overlay-content" onKeyDown={(event) => handleEnterPress(event, setupUser)}>
                <div>User ID</div>
                <input
                    onChange={onUserIdInputChange}
                    className="form-input"
                    type="text" value={userIdInputValue}
                />
                <div>User Nickname</div>
                <input
                    onChange={onUserNameInputChange}
                    className="form-input"
                    type="text" value={userNameInputValue}
                />
                <button
                    className="user-submit-button"
                    onClick={setupUser}
                >
                    Connect
                </button>
            </div>
        </div>
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
                        if (!message.sender) return null;
                        const messageSentByYou = message.sender.userId === sb.currentUser.userId;
                        return (
                            <div key={message.messageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                                <PinnedMessage
                                    message={message}
                                    handleUnpinMessage={handleUnpinMessage}
                                    messageSentByYou={messageSentByYou} />
                                <ProfileImage user={message.sender} />
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
const loadChannels = async (channelHandlers) => {
    const groupChannelFilter = new GroupChannelFilter();
    groupChannelFilter.includeEmpty = true;

    const collection = sb.groupChannel.createGroupChannelCollection({
        filter: groupChannelFilter,
        order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
    });

    collection.setGroupChannelCollectionHandler(channelHandlers);

    const channels = await collection.loadMore();
    return [channels, null];
}

const loadMessages = (channel, messageHandlers, onCacheResult, onApiResult) => {
    const messageFilter = new MessageFilter();

    const collection = channel.createMessageCollection({
        filter: messageFilter,
        startingPoint: Date.now(),
        limit: 100
    });

    collection.setMessageCollectionHandler(messageHandlers);
    collection
        .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
        .onCacheResult(onCacheResult)
        .onApiResult(onApiResult);
    return collection;
}

const inviteUsersToChannel = async (channel, userIds) => {
    await channel.inviteWithUserIds(userIds);
}

const createChannel = async (channelName, userIdsToInvite) => {
    try {
        const groupChannelParams = {};
        groupChannelParams.invitedUserIds = userIdsToInvite;
        groupChannelParams.name = channelName;
        groupChannelParams.operatorUserIds = userIdsToInvite;
        const groupChannel = await sb.groupChannel.createChannel(groupChannelParams);
        return [groupChannel, null];
    } catch (error) {
        return [null, error];
    }
}

const deleteChannel = async (channelUrl) => {
    try {
        const channel = await sb.groupChannel.getChannel(channelUrl);
        await channel.delete();
        return [channel, null];
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

export default GroupChannelPinnedMessages;
