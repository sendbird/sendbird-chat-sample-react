import { useState, useEffect, useRef } from 'react';
import SendbirdChat from '@sendbird/chat';
import {
    GroupChannelModule,
    GroupChannelFilter,
    GroupChannelListOrder,
    MessageFilter,
    MessageCollectionInitPolicy,
    ScheduledStatus
} from '@sendbird/chat/groupChannel';

import { SENDBIRD_INFO } from '../constants/constants';
import { timestampToTime, handleEnterPress } from '../utils/messageUtils';
let sb;

const BasicGroupChannelSample = (props) => {

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
        scheduledMessages: [],
        showScheduledMessageSettingsModal: false,
        showScheduledMessageListModal: false,
        scheduleDate: null,
        scheduleTime: null,
        scheduleMessageInputValue: "",
        scheduleMessageToUpdate: null,
        scheduleMessageRangeError: false,
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

        updateState({ ...state, messageCollection: collection });
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

    const onScheduleMessageInputChange = (e) => {
        const scheduleMessageInputValue = e.currentTarget.value;
        updateState({ ...state, scheduleMessageInputValue });
    }

    const sendMessage = async () => {
        const { messageToUpdate, currentlyJoinedChannel, messages } = state;
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
            currentlyJoinedChannel.sendUserMessage(userMessageParams)
                .onSucceeded((message) => {

                    updateState({ ...stateRef.current, messageInputValue: "" });
                })
                .onFailed((error) => {
                    console.log(error)
                    console.log("failed")
                });
        }
    }

    const sendScheduledMessage = async () => {
        const { scheduleMessageToUpdate, currentlyJoinedChannel, scheduledMessages } = state;
        if (state.scheduleTime.replace(':', '') > getDate().min.slice(-5).replace(':', '')) {
            if (scheduleMessageToUpdate) {
                const params = {
                    scheduledAt: Math.floor(new Date(state.scheduleDate + ' ' + state.scheduleTime).getTime())
                };
                if (state.scheduleMessageInputValue !== '') {
                    params.message = state.scheduleMessageInputValue
                }
                await currentlyJoinedChannel.updateScheduledUserMessage(
                    scheduleMessageToUpdate.scheduledInfo.scheduledMessageId,
                    params
                );
                const updatedMessages = await loadSchedulesMessages()

                updateState({
                    ...state,
                    scheduledMessages: updatedMessages,
                    scheduleMessageInputValue: "",
                    scheduleMessageToUpdate: null,
                    showScheduledMessageSettingsModal: false,
                    scheduleMessageRangeError: false
                });
            } else {
                const userMessageParams = {
                    scheduledAt: Math.floor(new Date(state.scheduleDate + ' ' + state.scheduleTime).getTime())
                };
                userMessageParams.message = state.messageInputValue
                currentlyJoinedChannel.createScheduledUserMessage(userMessageParams)
                    .onPending(message => {
                        const updatedMessages = [...scheduledMessages, message]

                        updateState({
                            ...stateRef.current,
                            messageInputValue: "",
                            showScheduledMessageSettingsModal: false,
                            scheduledMessages: updatedMessages,
                            scheduleMessageRangeError: false,
                        });
                    })
                    .onFailed((error) => {
                        console.log(error)
                        console.log("failed")
                    });
            }
        } else {
            updateState({ ...stateRef.current, scheduleMessageRangeError: true });
        }
    }

    const updateScheduleTime = (timestamp) => {
        const date = timestamp.slice(0, 10)
        const time = timestamp.slice(-5)

        updateState({ ...state, scheduleTime: time, scheduleDate: date });
    }

    const onFileInputChange = async (e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            const { currentlyJoinedChannel, messages } = state;
            const fileMessageParams = {};
            fileMessageParams.file = e.currentTarget.files[0];
            currentlyJoinedChannel.sendFileMessage(fileMessageParams)
                .onSucceeded((message) => {
                    updateState({ ...stateRef.current, messageInputValue: "", file: null });
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
    }

    const updateMessage = async (message) => {
        updateState({ ...state, messageToUpdate: message, messageInputValue: message.message });
    }

    const updateScheduleMessage = async (message) => {
        updateState({ ...state, scheduleMessageToUpdate: message, scheduleMessageInputValue: message.message });
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

    const formatDate = (unixTimestamp) => {
        const date = new Date(unixTimestamp);

        const year = date.getFullYear();
        const month = "0" + (date.getMonth() + 1);
        const day = "0" + date.getDate();
        const hours = "0" + date.getHours();
        const minutes = "0" + date.getMinutes();

        return `${year}-${month.slice(-2)}-${day.slice(-2)}T${hours.slice(-2)}:${minutes.slice(-2)}`
    }

    const getDate = () => {
        const today = Date.now()
        const min = formatDate(today + 300000)
        const max = formatDate(today + 2592000000)

        return {min, max}
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

        const scheduledMessages = await loadSchedulesMessages()

        updateState({ ...state, channels: channels, loading: false, settingUpUser: false, scheduledMessages });
    }

    const toggleShowScheduledMessageSettingsModal = () => {
        updateState({ ...state, showScheduledMessageSettingsModal: !state.showScheduledMessageSettingsModal });
    }

    const toggleShowScheduledMessageListModal = async () => {
        const scheduledMessages = await loadSchedulesMessages()

        updateState({ ...state, showScheduledMessageListModal: !state.showScheduledMessageListModal, scheduledMessages });
    }

    const handleDeleteScheduleMessage = async (scheduledMessage) => {
        const { currentlyJoinedChannel } = state;
        await currentlyJoinedChannel.cancelScheduledMessage(scheduledMessage.scheduledInfo.scheduledMessageId);
        const updatedMessages = await loadSchedulesMessages()

        updateState({ ...state, scheduledMessages: updatedMessages });
    }

    const sendScheduleMessageImmediately = async (scheduledMessage) => {
        const { currentlyJoinedChannel, messages } = state;
        await currentlyJoinedChannel.sendScheduledMessageNow(scheduledMessage.scheduledInfo.scheduledMessageId);

        const updatedMessages = await loadSchedulesMessages()

        const messagesIndex = scheduledMessage.scheduledInfo.scheduledMessageId
        messages[messagesIndex] = scheduledMessage;

        updateState({ ...state, scheduledMessages: updatedMessages, messages });
    }

    const rescheduleMessage = (message) => {
        updateState({ ...state, scheduleMessageToUpdate: message, showScheduledMessageSettingsModal: true });
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
            >
                <MessagesList
                    messages={state.messages}
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
                />
                <MessageInput
                    value={state.messageInputValue}
                    onChange={onMessageInputChange}
                    sendMessage={sendMessage}
                    sendScheduledMessage={sendScheduledMessage}
                    toggleShowScheduledMessageSettingsModal={toggleShowScheduledMessageSettingsModal}
                    toggleShowScheduledMessageListModal={toggleShowScheduledMessageListModal}
                    fileSelected={state.file}
                    onFileInputChange={onFileInputChange}
                />
            </Channel>
            <MembersList
                channel={state.currentlyJoinedChannel}
                handleMemberInvite={handleMemberInvite}
            />
            <ScheduledMessageSettingsModal
                showScheduledMessageSettingsModal={state.showScheduledMessageSettingsModal}
                toggleShowScheduledMessageSettingsModal={toggleShowScheduledMessageSettingsModal}
                sendScheduledMessage={sendScheduledMessage}
                updateScheduleTime={updateScheduleTime}
                scheduleMessageToUpdate={state.scheduleMessageToUpdate}
                scheduleDate={state.scheduleDate}
                getDate={getDate}
                scheduleMessageRangeError={state.scheduleMessageRangeError}
            />
            <ScheduledMessageListModal
                showScheduledMessageListModal={state.showScheduledMessageListModal}
                toggleShowScheduledMessageListModal={toggleShowScheduledMessageListModal}
                onScheduleMessageInputChange={onScheduleMessageInputChange}
                sendScheduledMessage={sendScheduledMessage}
                updateScheduleTime={updateScheduleTime}
                scheduledMessages={state.scheduledMessages}
                updateScheduleMessage={updateScheduleMessage}
                sendScheduleMessageImmediately={sendScheduleMessageImmediately}
                handleDeleteScheduleMessage={handleDeleteScheduleMessage}
                scheduleMessageToUpdate={state.scheduleMessageToUpdate}
                value={state.scheduleMessageInputValue}
                rescheduleMessage={rescheduleMessage}
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

const Channel = ({ currentlyJoinedChannel, children, handleLeaveChannel, channelRef }) => {
    if (currentlyJoinedChannel) {
        return <div className="channel" ref={channelRef}>
            <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
            <div>
                <button className="leave-channel" onClick={handleLeaveChannel}>Leave Channel</button>
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

const MessagesList = ({ messages, handleDeleteMessage, updateMessage }) => {
    return <div className="message-list">
        {messages.map(message => {
            if (!message.sender) return null;
            const messageSentByYou = message.sender.userId === sb.currentUser.userId;
            return (
                <div key={message.messageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                    <Message
                        message={message}
                        handleDeleteMessage={handleDeleteMessage}
                        updateMessage={updateMessage}
                        messageSentByYou={messageSentByYou} />
                    <ProfileImage user={message.sender} />
                </div>
            );
        })}
    </div>
}

const Message = ({ message, updateMessage, handleDeleteMessage, messageSentByYou }) => {
    if (message.url) {
        return (
            <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.createdAt)}</div>
                </div>
                <img src={message.url} />
            </div >);
    }
    const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;

    return (
        <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
            <div className="message-info">
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.createdAt)}</div>
                </div>
                {messageSentByCurrentUser &&
                    <div>
                        <button className="control-button" onClick={() => updateMessage(message)}>
                            <img className="message-icon" src='/icon_edit.png' alt="Edit message" />
                        </button>
                        <button className="control-button" onClick={() => handleDeleteMessage(message)}>
                            <img className="message-icon" src='/icon_delete.png' alt="Delete message" />
                        </button>
                    </div>}
            </div>
            <div>{message.message}</div>
        </div>
    );
}

const ScheduleMessage = ({ message, handleDeleteScheduleMessage, messageSentByYou, updateScheduleMessage, sendScheduleMessageImmediately, rescheduleMessage }) => {
    if (message.url) {
        return (
            <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.scheduledInfo.scheduledAt)}</div>
                </div>
                <img src={message.url} />
            </div >);
    }
    const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;

    return (
        <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
            <div className="message-info">
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.scheduledInfo.scheduledAt)}</div>
                </div>
                {messageSentByCurrentUser &&
                    <div>
                        <button className="control-button" data-tooltip="send now" onClick={() => sendScheduleMessageImmediately(message)}>
                            <img className="message-icon" src='/icon_send-message.png' alt="Send message" />
                        </button>
                        <button className="control-button" data-tooltip="reschedule" onClick={() => rescheduleMessage(message)}>
                            <img className="message-icon" src='/icon_reschedule.png' alt="Reschedule message" />
                        </button>
                        <button className="control-button" data-tooltip="edit" onClick={() => updateScheduleMessage(message)}>
                            <img className="message-icon" src='/icon_edit.png' alt="Edit message" />
                        </button>
                        <button className="control-button" data-tooltip="delete" onClick={() => handleDeleteScheduleMessage(message)}>
                            <img className="message-icon" src='/icon_delete.png' alt="Delete message" />
                        </button>
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

const MessageInput = ({ value, onChange, sendMessage, sendScheduledMessage, toggleShowScheduledMessageSettingsModal, toggleShowScheduledMessageListModal, onFileInputChange }) => {
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
                <button className="send-message-button" onClick={toggleShowScheduledMessageSettingsModal}>Schedule Message</button>
                <button className="send-message-button" onClick={toggleShowScheduledMessageListModal}>List</button>
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

const ScheduledMessageSettingsModal = ({
    setupUser,
    showScheduledMessageSettingsModal,
    toggleShowScheduledMessageSettingsModal,
    sendScheduledMessage,
    updateScheduleTime,
    scheduleMessageToUpdate,
    getDate,
    scheduleMessageRangeError,
}) => {
    if (showScheduledMessageSettingsModal) {
        return <div className="overlay scheduled-messages-settings-modal">
            <div className="overlay-content" onKeyDown={(event) => handleEnterPress(event, setupUser)}>
                <div className="settings-header">
                    {scheduleMessageToUpdate ? 'Reschedule message': 'Send shcheduled message'}
                </div>
                <div className="schedule-message-error">
                    {scheduleMessageRangeError && 'Scheduled time should be between 5 minutes and 30 days'}
                </div>
                <input
                    type="datetime-local"
                    onChange={(e) => {
                        updateScheduleTime(e.target.value)
                    }}
                    min={getDate().min}
                    max={getDate().max}
                />
                
                <div className="schedule-message">
                    <button
                        className="user-submit-button cancel-button"
                        onClick={toggleShowScheduledMessageSettingsModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="user-submit-button"
                        onClick={sendScheduledMessage}
                    >
                        {scheduleMessageToUpdate ? 'Reschedule' : 'Schedule'}
                    </button>
                </div>
            </div>
        </div>
    } else {
        return null;
    }
}

const ScheduledMessageListModal = ({
    value,
    setupUser,
    showScheduledMessageListModal,
    toggleShowScheduledMessageListModal,
    scheduledMessages,
    sendScheduledMessage,
    onScheduleMessageInputChange,
    updateScheduleMessage,
    sendScheduleMessageImmediately,
    handleDeleteScheduleMessage,
    rescheduleMessage,
    scheduleMessageToUpdate
}) => {
    if (showScheduledMessageListModal) {
        return <div className="overlay ">
            <div className="overlay-content scheduled-messages-list-modal" onKeyDown={(event) => handleEnterPress(event, setupUser)}>
                <div className="scheduled-message-header">Shcheduled messages</div>

                <div className="message-list">
                    {scheduledMessages?.map(message => {
                        if (!message.sender) return null;
                        const messageSentByYou = message.sender.userId === sb.currentUser.userId;
                        return (
                            <div key={message.scheduledInfo.scheduledMessageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                                <ScheduleMessage
                                    message={message}
                                    updateScheduleMessage={updateScheduleMessage}
                                    sendScheduleMessageImmediately={sendScheduleMessageImmediately}
                                    handleDeleteScheduleMessage={handleDeleteScheduleMessage}
                                    messageSentByYou={messageSentByYou}
                                    rescheduleMessage={rescheduleMessage} />
                                <ProfileImage user={message.sender} />
                            </div>
                        );
                    })}
                </div>

                {scheduleMessageToUpdate && <div className="update-input">
                    <input
                        placeholder="update schedule message"
                        value={value}
                        onChange={onScheduleMessageInputChange}
                    />

                    <button className="send-message-button" onClick={sendScheduledMessage}>Update Message</button>
                </div>}

                <button
                    className="close-button"
                    onClick={toggleShowScheduledMessageListModal}
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

const loadSchedulesMessages = async () => {
    const params = {
        scheduledStatus: [ScheduledStatus.PENDING],
    }

    const scheduledMessageListQuery = sb.groupChannel.createScheduledMessageListQuery(params);
    const queriedScheduledMessages = await scheduledMessageListQuery.next();

    return queriedScheduledMessages
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

const getAllApplicationUsers = async () => {
    try {
        const userQuery = sb.createApplicationUserListQuery({ limit: 100 });
        const users = await userQuery.next();
        return [users, null];
    } catch (error) {
        return [null, error];
    }
}

export default BasicGroupChannelSample;
