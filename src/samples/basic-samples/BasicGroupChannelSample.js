import SendBird from 'sendbird';
import { useEffect, useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import { SENDBIRD_USER_INFO } from '../../constants/constants';
import { timestampToTime } from '../../utils/messageUtils';

import SendbirdChat from '../../out/sendbird.js';
import { GroupChannelModule, GroupChannelHandler } from '../../out/module/groupChannel.js';
import { UserMessageParams } from '../../out/module/message.js';
import UserMessageUpdateParams from '../../out/model/params/userMessageUpdateParams.js';
import GroupChannelCreateParams from '../../out/model/params/groupChannelCreateParams.js';
import GroupChannelUpdateParams from '../../out/model/params/groupChannelUpdateParams.js';
import FileMessageParams from '../../out/model/params/fileMessageParams.js';

import UserUpdateParams from '../../out/model/params/userUpdateParams.js';
import MessageListParams from '../../out/model/params/messageListParams.js';

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
        channelHandler.onUserEntered = () => { };
        channelHandler.onChannelParticipantCountChanged = () => { };
        channelHandler.onChannelChanged = () => { };
        channelHandler.onUserReceivedInvitation = () => { };
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
            // should be onSucceeded but not firing. One for QA
            message.onSucceeded((message) => {
                const updatedMessages = [...messages, message];
                updateState({ ...state, messages: updatedMessages, messageInputValue: "" });
            });
        }
    }

    const sendFileMessage = async () => {
        const { currentlyJoinedChannel, file, messages } = state;

        const fileMessageParams = new FileMessageParams();
        fileMessageParams.file = file;
        // fileMessageParams.thumbnailSizes = [{ maxWidth: 100, maxHeight: 100 }, { maxWidth: 200, maxHeight: 200 }];
        const message = await currentlyJoinedChannel.sendFileMessage(fileMessageParams);

        message.onSucceeded((message) => {
            const updatedMessages = [...messages, message];
            updateState({ ...state, messages: updatedMessages, messageInputValue: "", file: null });
        });
    }

    const onFileInputChange = async (e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            updateState({ ...state, file: e.currentTarget.files[0] });
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

    const handleGetAllApplicationUsers = async () => {
        const [users, error] = await getAllApplicationUsers();
        if (error) {
            return onError(error);
        }
        updateState({ ...state, applicationUsers: users, groupChannelMembers: [sb.currentUser.userId] });
    }

    const addToChannelMembersList = (userId) => {
        const groupChannelMembers = [...state.groupChannelMembers, userId];
        updateState({ ...state, groupChannelMembers: groupChannelMembers });

    }

    const setupUser = async () => {
        const { userNameInputValue } = state;
        const sendbirdChat = await SendbirdChat.init({
            appId: SENDBIRD_USER_INFO.appId,
            localCacheEnabled: false,
            modules: [new GroupChannelModule()]
        });

        const userUpdateParams = new UserUpdateParams(SENDBIRD_USER_INFO.nickname);
        userUpdateParams.nickname = userNameInputValue;
        await sendbirdChat.connect(userNameInputValue);
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
        return <div>{state.error} check console for more information.</div>
    }

    console.log('- - - - State object very useful for debugging - - - -');
    console.log(state);

    return (
        <>
            <CreateUserForm
                setupUser={setupUser}
                userNameInputValue={state.userNameInputValue}
                settingUpUser={state.settingUpUser}
                onUserNameInputChange={onUserNameInputChange} />
            <ChannelList
                channels={state.channels}
                handleJoinChannel={handleJoinChannel}
                handleCreateChannel={handleGetAllApplicationUsers}
                handleDeleteChannel={handleDeleteChannel}
                handleGetAllApplicationUsers={handleGetAllApplicationUsers} />
            <MembersSelect
                applicationUsers={state.applicationUsers}
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
                    sendFileMessage={sendFileMessage}
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
    handleGetAllApplicationUsers
}) => {
    return (
        <div className='channel-list'>
            <div className="channel-type">
                <h1>Group Channels</h1>
                <button onClick={() => handleGetAllApplicationUsers()}>Create</button>
            </div>
            {channels.map(channel => {
                // debugger;
                // const userIsChannelOperator = channel.operators.some((operator) => operator.id === "1234");
                return (
                    <div key={channel.url} className="channel-list-item" >
                        <div
                            className="channel-list-item-name"
                            onClick={() => { handleJoinChannel(channel.url) }}>
                            <ChannelName members={channel.members} />
                            <div className="last-message">{channel.lastMessage?.message}</div>
                        </div>
                        <div>
                            {true && < button onClick={() => handleDeleteChannel(channel.url)}>delete</button>}
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
                <div key={member.userId}>{member.nickname}</div>
            )}
        </div>;
    } else {
        return null;
    }


}

const MessagesList = ({ messages, handleDeleteMessage, updateMessage }) => {
    return messages.map(message => {
        return (
            <div key={message.messageId} className="message-item">
                {message.messageId}
                <Message message={message} />
                <button onClick={() => updateMessage(message)}>update</button>
                <button onClick={() => handleDeleteMessage(message)}>delete</button>
            </div>);
    })
}

const Message = (message) => {
    if (message.message.url) {
        return (
            <div className="message">
                <div>{timestampToTime(message.message.createdAt)}</div>
                <img src={message.message.url} />
            </div >)
    }
    return (
        <div className="message">
            <div>{timestampToTime(message.message.createdAt)}</div>
            <div className="message-sender-name">{message.message.sender?.userId}</div>
            <div>{message.message.message}</div>
        </div >
    );

}

const MessageInput = ({ value, onChange, sendMessage, sendFileMessage, onFileInputChange, fileSelected }) => {
    return (
        <div className="message-input">
            <input
                placeholder="write a message"
                value={value}
                onChange={onChange} />

            <div className="message-input-buttons">
                <button onClick={sendMessage}>Send Message</button>
                <input
                    type='file'
                    onChange={onFileInputChange}
                    onClick={() => { }}
                />
                <button onClick={sendFileMessage} disabled={!fileSelected}>Send File</button>

            </div>

        </div>);
}

const MembersSelect = ({
    applicationUsers,
    currentlyJoinedChannel,
    addToChannelMembersList,
    handleCreateChannel,
    handleUpdateChannelMembersList

}) => {
    if (applicationUsers.length > 0) {
        return <div className="overlay">
            <div className="overlay-content">
                {applicationUsers.map((user) => {
                    return <div key={user.userId} onClick={() => addToChannelMembersList(user.userId)}>{user.nickname}</div>
                })}
            </div>
            <button onClick={() => {
                if (currentlyJoinedChannel) {
                    handleUpdateChannelMembersList();
                } else {
                    handleCreateChannel();

                }
            }}>{currentlyJoinedChannel ? 'Submit' : 'Create'}</button>
        </div >;
    }
    return null;
}

const CreateUserForm = ({
    setupUser,
    settingUpUser,
    userNameInputValue,
    onUserNameInputChange
}) => {
    if (settingUpUser) {
        return <div className="overlay">
            <div className="overlay-content">
                <button onClick={setupUser}>create</button>
                <div>input user name</div>
                <input onChange={onUserNameInputChange} value={userNameInputValue} />
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
        debugger;
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