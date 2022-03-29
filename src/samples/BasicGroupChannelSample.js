import SendBird from 'sendbird';
import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import { SENDBIRD_USER_INFO } from '../constants/constants';
import { timestampToTime } from '../utils/messageUtils';

import SendbirdChat from '../out/sendbird.js';
import { GroupChannelModule, GroupChannelHandler } from '../out/module/groupChannel.js';
import { UserMessageParams } from '../out/module/message.js';
import UserMessageUpdateParams from '../out/model/params/userMessageUpdateParams.js';
import GroupChannelCreateParams from '../out/model/params/groupChannelCreateParams.js';
import FileMessageParams from '../out/model/params/fileMessageParams.js';

import UserUpdateParams from '../out/model/params/userUpdateParams.js';
import MessageListParams from '../out/model/params/messageListParams.js';

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
        channelNameUpdateValue: "",
        file: null,
        messageToUpdate: null,
        loading: false,
        error: false
    });

    //need to access state in message received callback
    const stateRef = useRef();
    stateRef.current = state;

    const onError = (error) => {
        updateState({ ...state, error: error.message });
        console.log(error);
    }

    const handleJoinChannel = async (channelUrl) => {
        const { channels } = state;
        updateState({ ...state, loading: true });
        const channel = channels.find((channel) => channel.url === channelUrl);
        const [messages, error] = await joinChannel(channel);
        if (error) {
            return onError(error);
        }
        // listen for incoming messages
        const channelHandler = new GroupChannelHandler();
        channelHandler.onUserJoined = () => { };
        channelHandler.onMessageUpdated = (channel, message) => {
            const messageIndex = messages.findIndex((item => item.messageId == message.messageId));
            messages[messageIndex] = message;
            updateState({ ...stateRef.current, messages });

        }

        channelHandler.onMessageReceived = (channel, message) => {
            const updatedMessages = [...messages, message];
            updateState({ ...stateRef.current, messages: updatedMessages });
        };

        sb.groupChannel.addGroupChannelHandler(uuid(), channelHandler);
        updateState({ ...state, currentlyJoinedChannel: channel, messages: messages, loading: false })
    }

    const handleCreateChannel = async (channelName = "testChannel",) => {
        const [groupChannel, error] = await createChannel(channelName, state.groupChannelMembers);
        if (error) {
            return onError(error);
        }

        const updatedChannels = [groupChannel, ...state.channels];
        updateState({ ...state, channels: updatedChannels, applicationUsers: [] });
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
        const updatedChannels = state.channels.filter((channel) => {
            return channel.url !== channelUrl;
        });
        updateState({ ...state, channels: updatedChannels });
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
        const { messageToUpdate, currentlyJoinedChannel, messages } = state;
        if (messageToUpdate) {
            const userMessageUpdateParams = new UserMessageUpdateParams();
            userMessageUpdateParams.message = state.messageInputValue;
            const updatedMessage = await currentlyJoinedChannel.updateUserMessage(messageToUpdate.messageId, userMessageUpdateParams)
            const messageIndex = messages.findIndex((item => item.messageId == messageToUpdate.messageId));
            messages[messageIndex] = updatedMessage;
            updateState({ ...state, messages: messages, messageInputValue: "", messageToUpdate: null });
        } else {
            const userMessageParams = new UserMessageParams();
            userMessageParams.message = state.messageInputValue;
            const message = await currentlyJoinedChannel.sendUserMessage(userMessageParams);
            message.onSucceeded((message) => {
                const updatedMessages = [...messages, message];
                updateState({ ...state, messages: updatedMessages, messageInputValue: "" });
            });
        }
    }

    const onFileInputChange = async (e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            const { currentlyJoinedChannel, messages } = state;
            const fileMessageParams = new FileMessageParams();
            fileMessageParams.file = e.currentTarget.files[0];
            const message = await currentlyJoinedChannel.sendFileMessage(fileMessageParams);
            message.onSucceeded((message) => {
                const updatedMessages = [...messages, message];
                updateState({ ...state, messages: updatedMessages, messageInputValue: "", file: null });
            });
        }
    }

    const handleDeleteMessage = async (messageToDelete) => {
        const { currentlyJoinedChannel, messages } = state;
        await deleteMessage(currentlyJoinedChannel, messageToDelete);
        const updatedMessages = messages.filter((message) => {
            return message.messageId !== messageToDelete.messageId;
        });
        updateState({ ...state, messages: updatedMessages });

    }

    const updateMessage = async (message) => {
        updateState({ ...state, messageToUpdate: message, messageInputValue: message.message });
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
            appId: SENDBIRD_USER_INFO.appId,
            localCacheEnabled: false,
            modules: [new GroupChannelModule()]
        });

        const userUpdateParams = new UserUpdateParams();
        userUpdateParams.nickname = userNameInputValue;
        userUpdateParams.userId = userIdInputValue;

        await sendbirdChat.connect(userIdInputValue);
        await sendbirdChat.setChannelInvitationPreference(true);

        await sendbirdChat.updateCurrentUserInfo(userUpdateParams);
        sb = sendbirdChat;
        updateState({ ...state, loading: true });
        const [channels, error] = await loadChannels();
        if (error) {
            return onError(error);
        }
        console.log(sb.currentUser.userId);
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
                handleJoinChannel={handleJoinChannel}
                handleCreateChannel={handleLoadMemberSelectionList}
                handleDeleteChannel={handleDeleteChannel}
                handleLoadMemberSelectionList={handleLoadMemberSelectionList} />
            <MembersSelect
                applicationUsers={state.applicationUsers}
                groupChannelMembers={state.groupChannelMembers}
                currentlyJoinedChannel={state.currentlyJoinedChannel}
                addToChannelMembersList={addToChannelMembersList}
                handleCreateChannel={handleCreateChannel}
                handleUpdateChannelMembersList={handleUpdateChannelMembersList}
            />

            <Channel currentlyJoinedChannel={state.currentlyJoinedChannel}>
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
            <MembersList
                channel={state.currentlyJoinedChannel}
                handleMemberInvite={handleMemberInvite}
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
                            <button className="control-button" onClick={() => handleDeleteChannel(channel.url)}>delete</button>
                        </div>
                    </div>);
            })}
        </div >);
}

const ChannelName = ({ members }) => {
    return members.map((member) => {
        return <span key={member.userId}>{member.nickname} </span>
    })
}


const Channel = ({ currentlyJoinedChannel, children }) => {
    if (currentlyJoinedChannel) {
        return <div className="channel">
            <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
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
            const messageSentByYou = message.sender.userId === sb.currentUser.userId;
            return (
                <div key={message.messageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                    <Message message={message} handleDeleteMessage={handleDeleteMessage} updateMessage={updateMessage} />
                </div>);
        })}
    </div>
}

const Message = ({ message, updateMessage, handleDeleteMessage }) => {
    if (message.url) {
        return (
            <div className="message">
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.createdAt)}</div>
                </div>
                <img src={message.url} />
            </div >);
    }
    return (
        <div className="message">
            <div className="message-info">
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.createdAt)}</div>
                </div>
                <div>
                    <button className="control-button" onClick={() => updateMessage(message)}><img className="message-icon" src='/icon_edit.png' /></button>
                    <button className="control-button" onClick={() => handleDeleteMessage(message)}><img className="message-icon" src='/icon_delete.png' /></button>
                </div>
            </div>
            <div>{message.message}</div>
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
                        onClick={() => addToChannelMembersList(user.userId)}>{user.nickname}</div>
                })}

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
                <div>User Nickname</div>
                <input
                    onChange={onUserNameInputChange}
                    className="form-input"
                    type="text" value={userNameInputValue} />
                <div>User ID</div>

                <input
                    onChange={onUserIdInputChange}
                    className="form-input"
                    type="text" value={userIdInputValue} />
                <div></div>
                <div>

                    <button
                        className="user-submit-button"
                        onClick={setupUser}>Submit</button>
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
        const groupChannelQuery = sb.groupChannel.createMyGroupChannelListQuery({ limit: 30, includeEmpty: true });
        const channels = await groupChannelQuery.next();
        return [channels, null];
    } catch (error) {
        return [null, error];
    }


}

const joinChannel = async (channel) => {
    try {
        const messageListParams = new MessageListParams();
        messageListParams.nextResultSize = 20;
        const messages = await channel.getMessagesByTimestamp(0, messageListParams);
        return [messages, null];
    } catch (error) {
        return [null, error];
    }

}

const inviteUsersToChannel = async (channel, userIds) => {
    await channel.inviteWithUserIds(userIds);
}


const createChannel = async (channelName, userIdsToInvite) => {
    try {
        const groupChannelParams = new GroupChannelCreateParams();
        groupChannelParams.addUserIds(userIdsToInvite);
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