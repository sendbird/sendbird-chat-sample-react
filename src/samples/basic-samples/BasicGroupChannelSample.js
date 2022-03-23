import SendBird from 'sendbird';
import { useEffect, useState, useRef } from 'react';
import { SENDBIRD_USER_INFO } from '../../constants/constants';
import SendbirdChat from '../../out/sendbird.js';
import { GroupChannelModule, GroupChannelHandler } from '../../out/module/groupChannel.js';
import { UserMessageParams } from '../../out/module/message.js';
import UserMessageUpdateParams from '../../out/model/params/userMessageUpdateParams.js';
import GroupChannelCreateParams from '../../out/model/params/groupChannelCreateParams.js';
import GroupChannelUpdateParams from '../../out/model/params/groupChannelUpdateParams.js';

import UserUpdateParams from '../../out/model/params/userUpdateParams.js';
import MessageListParams from '../../out/model/params/messageListParams.js';

let sb;

const BasicGroupChannelSample = (props) => {

    const [state, updateState] = useState({
        applicationUsers: [],
        groupChannelMembers: [],
        currentlyJoinedChannel: null,
        currentlyUpdatingChannel: null,
        messages: [],
        channels: [],
        messageInputValue: "",
        channelNameUpdateValue: "",
        file: null,
        messageToUpdate: null,
        loading: true,
    });

    //need to access state in message reeived callback
    const stateRef = useRef();
    stateRef.current = state;



    const loadChannels = async () => {
        const groupChannelQuery = sb.groupChannel.createMyGroupChannelListQuery({ limit: 30, includeEmpty: true });
        const channels = await groupChannelQuery.next();
        updateState({ ...state, channels: channels, loading: false })
    }

    const handleJoinChannel = async (channelUrl) => {
        const { channels } = state;
        updateState({ ...state, loading: true });
        const channelToJoin = channels.find((channel) => channel.url === channelUrl);
        const { messages, channel } = await joinChannel(channelToJoin);
        // listen for incoming messages
        const channelHandler = new GroupChannelHandler();
        channelHandler.onUserEntered = () => { };
        channelHandler.onChannelParticipantCountChanged = () => { };
        channelHandler.onMessageUpdated = (channel, message) => {
            const messageIndex = messages.findIndex((item => item.messageId == message.messageId));
            messages[messageIndex] = message;
            updateState({ ...stateRef.current, messages });

        }

        channelHandler.onMessageReceived = (channel, message) => {
            const updatedMessages = [...messages, message];
            updateState({ ...stateRef.current, messages: updatedMessages });
        };

        sb.groupChannel.addGroupChannelHandler("blah-key", channelHandler);
        updateState({ ...state, currentlyJoinedChannel: channel, messages: messages, loading: false })
    }

    const handleCreateChannel = async (channelName = "testChannel",) => {
        const groupChannel = await createChannel(channelName, state.groupChannelMembers);

        const updatedChannels = [groupChannel, ...state.channels];
        updateState({ ...state, channels: updatedChannels, applicationUsers: [] });
    }

    const handleDeleteChannel = async (channelUrl) => {
        const channel = await deleteChannel(channelUrl);
        const updatedChannels = state.channels.filter((channel) => {
            return channel.url !== channelUrl;
        });
        updateState({ ...state, channels: updatedChannels });
    }

    const handleUpdateChannel = async () => {
        const { currentlyUpdatingChannel, channelNameUpdateValue } = state;
        await updateChannel(currentlyUpdatingChannel, channelNameUpdateValue);
    }

    const toggleChannelDetails = (channel) => {
        if (channel) {
            updateState({ ...state, currentlyUpdatingChannel: channel });
        } else {
            updateState({ ...state, currentlyUpdatingChannel: null });

        }
    }

    const onChannelNamenputChange = (e) => {
        const channelNameUpdateValue = e.currentTarget.value;
        updateState({ ...state, channelNameUpdateValue });
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

    const sendFileMessage = async () => {
        const { currentlyJoinedChannel, file, messages } = state;

        const fileMessageParams = new sb.FileMessageParams();
        fileMessageParams.file = file;
        currentlyJoinedChannel.sendFileMessage(fileMessageParams, (message) => {
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
        const users = await getAllApplicationUsers();
        updateState({ ...state, applicationUsers: users, groupChannelMembers: [sb.currentUser.userId] });
    }

    const addToChannelMembersList = (userId) => {
        const groupChannelMembers = [...state.groupChannelMembers, userId];
        updateState({ ...state, groupChannelMembers: groupChannelMembers });

    }

    useEffect(() => {
        const setup = async () => {
            const sendbirdChat = await SendbirdChat.init({
                appId: SENDBIRD_USER_INFO.appId,
                localCacheEnabled: false,
                modules: [new GroupChannelModule()]
            });
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const user = urlParams.get('user');
            const userUpdateParams = new UserUpdateParams(SENDBIRD_USER_INFO.nickname);
            userUpdateParams.nickname = user || SENDBIRD_USER_INFO.nickname;
            await sendbirdChat.connect(user || SENDBIRD_USER_INFO.userId);
            await sendbirdChat.setChannelInvitationPreference(true);

            const sendbirdUser2 = await sendbirdChat.updateCurrentUserInfo(userUpdateParams);
            sb = sendbirdChat;

            loadChannels();
        }
        setup();
    }, []);

    if (state.loading) {
        return <div>Loading...</div>
    }

    console.log('------ state');
    console.log(state);

    return (
        <>

            <ChannelList
                channels={state.channels}
                toggleChannelDetails={toggleChannelDetails}
                handleJoinChannel={handleJoinChannel}
                handleCreateChannel={handleGetAllApplicationUsers}
                handleDeleteChannel={handleDeleteChannel}
                handleGetAllApplicationUsers={handleGetAllApplicationUsers} />
            <MembersSelect applicationUsers={state.applicationUsers} addToChannelMembersList={addToChannelMembersList} handleCreateChannel={handleCreateChannel} />

            <ChannelDetails
                currentlyUpdatingChannel={state.currentlyUpdatingChannel}
                handleUpdateChannel={handleUpdateChannel}
                onChannelNamenputChange={onChannelNamenputChange}
                toggleChannelDetails={toggleChannelDetails} />
            <Channel currentlyJoinedChannel={state.currentlyJoinedChannel}>
                <MembersList />
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
        </>
    );
};


const ChannelList = ({
    channels,
    handleJoinChannel,
    handleDeleteChannel,
    toggleChannelDetails,
    handleGetAllApplicationUsers
}) => {
    return (
        <div className='channel-list'>
            <div className="channel-type">
                <h1>Open Channels</h1>
                <button onClick={() => handleGetAllApplicationUsers()}>Create</button>
            </div>
            {channels.map(channel => {
                return (
                    <div key={channel.url} className="channel-list-item" >
                        <div className="channel-list-item-name"
                            onClick={() => { handleJoinChannel(channel.url) }}>
                            {channel.name}
                        </div>
                        <div>
                            <button onClick={() => toggleChannelDetails(channel)}>update</button>
                            <button onClick={() => handleDeleteChannel(channel.url)}>delete</button>
                        </div>
                    </div>);
            })}
        </div >);
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

const MembersList = () => {
    return "";

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
                <img src={message.message.url} />
            </div >)
    }
    return (
        <div className="message">
            <div className="message-sender-name">{message.message.sender.userId}</div>
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

const MembersSelect = ({ applicationUsers, addToChannelMembersList, handleCreateChannel }) => {
    if (applicationUsers.length > 0) {
        return <div className="overlay">
            <div className="overlay-content">
                {applicationUsers.map((user) => {
                    return <div key={user.userId} onClick={() => addToChannelMembersList(user.userId)}>{user.nickname}</div>
                })}
            </div>
            <button onClick={() => handleCreateChannel()}>Create</button>
        </div >;
    }
    return null;
}

const ChannelDetails = ({ currentlyUpdatingChannel, toggleChannelDetails, handleUpdateChannel, onChannelNamenputChange }) => {
    if (currentlyUpdatingChannel) {
        return <div className="overlay">
            <div className="overlay-content">
                <div>
                    <h3>Channel Details</h3>
                    <button onClick={() => toggleChannelDetails(null)}>Close</button>
                </div>
                Name
                <input onChange={onChannelNamenputChange} />
                <button onClick={() => handleUpdateChannel()}>Update channel name</button>
            </div>
        </div >;
    }
    return null;
}

const joinChannel = async (channel) => {

    await channel.join("");

    //list all messages
    const messageListParams = new MessageListParams();
    messageListParams.nextResultSize = 20;
    const messages = await channel.getMessagesByTimestamp(0, messageListParams);
    return { channel, messages };

}


const createChannel = async (channelName, userIdsToInvite, accessCode) => {
    const groupChannelParams = new GroupChannelCreateParams();
    console.log(groupChannelParams)
    groupChannelParams.addUserIds(userIdsToInvite);
    groupChannelParams.name = channelName;
    // In production, you will want to pass in the access code supplied when creating a group channel
    groupChannelParams.accessCode = "";
    groupChannelParams.operatorUserIds = [SENDBIRD_USER_INFO.userId];
    const groupChannel = await sb.groupChannel.createChannel(groupChannelParams);
    return groupChannel;
}

const deleteChannel = async (channelUrl) => {
    const channel = await sb.groupChannel.getChannel(channelUrl);
    await channel.delete();
    return channel;
}

const updateChannel = async (currentlyUpdatingChannel, channelNameUpdateValue) => {
    const channel = await sb.groupChannel.getChannel(currentlyUpdatingChannel.url);
    const groupChannelParams = new GroupChannelUpdateParams();
    groupChannelParams.name = channelNameUpdateValue;

    groupChannelParams.operatorUserIds = [sb.currentUser.userId];

    await channel.updateChannel(groupChannelParams);
}

const deleteMessage = async (currentlyJoinedChannel, messageToDelete) => {
    await currentlyJoinedChannel.deleteMessage(messageToDelete);
}

const getAllApplicationUsers = async () => {
    const userQuery = sb.createApplicationUserListQuery({ limit: 30 });
    return await userQuery.next();
}

export default BasicGroupChannelSample;