import SendBird from 'sendbird';
import { useEffect, useState, useRef } from 'react';
import { SENDBIRD_USER_INFO } from '../../constants/constants';
import SendbirdChat from '../../out/sendbird.js';
import { OpenChannelModule, OpenChannelHandler } from '../../out/module/openChannel.js';
import { UserMessageParams } from '../../out/module/message.js';
import UserMessageUpdateParams from '../../out/model/params/userMessageUpdateParams.js';
import OpenChannelCreateParams from '../../out/model/params/openChannelCreateParams.js';
import OpenChannelUpdateParams from '../../out/model/params/openChannelUpdateParams.js';

import UserUpdateParams from '../../out/model/params/userUpdateParams.js';
import MessageListParams from '../../out/model/params/messageListParams.js';

let sb;

const BasicOpenChannelSample = (props) => {

    const [state, updateState] = useState({
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
        const openChannelQuery = sb.openChannel.createOpenChannelListQuery({ limit: 30 });
        const channels = await openChannelQuery.next();
        updateState({ ...state, channels: channels, loading: false })
    }

    const handleJoinChannel = async (channelUrl) => {
        updateState({ ...state, loading: true });
        const { messages, channel } = await joinChannel(channelUrl);
        //listen for incoming messages
        const channelHandler = new OpenChannelHandler();
        channelHandler.onUserEntered = () => { };
        channelHandler.onChannelParticipantCountChanged = () => { };

        channelHandler.onMessageReceived = (channel, message) => {

            const messageIndex = messages.findIndex((item => item.messageId == message.messageId));
            if (messageIndex >= 0) {
                messages[messageIndex] = message;
                updateState({ ...stateRef.current, messages });


            } else {
                const updatedMessages = [...messages, message];
                updateState({ ...stateRef.current, messages: updatedMessages });
            }

        };

        sb.openChannel.addOpenChannelHandler("blah-key", channelHandler);
        updateState({ ...state, currentlyJoinedChannel: channel, messages: messages, loading: false })
    }

    const handleCreateChannel = async (channelName = "testChannel") => {
        const openChannel = await createChannel(channelName);
        const updatedChannels = [openChannel, ...state.channels];
        updateState({ ...state, channels: updatedChannels });
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

    useEffect(() => {
        const setup = async () => {
            const sendbirdChat = await SendbirdChat.init({
                appId: SENDBIRD_USER_INFO.appId,
                localCacheEnabled: false,
                modules: [new OpenChannelModule()]
            });
            console.log();
            const userUpdateParams = new UserUpdateParams(SENDBIRD_USER_INFO.nickname);
            userUpdateParams.nickname = SENDBIRD_USER_INFO.nickname + Math.random();
            await sendbirdChat.connect(SENDBIRD_USER_INFO.userId + Math.random());
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
                handleCreateChannel={handleCreateChannel}
                handleDeleteChannel={handleDeleteChannel} />
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


const ChannelList = ({ channels, handleJoinChannel, handleCreateChannel, handleDeleteChannel, toggleChannelDetails }) => {
    return (
        <div className='channel-list'>
            <div className="channel-type">
                <h1>Open Channels</h1>
                <button onClick={() => handleCreateChannel("name")}>Create</button>
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

const ChannelDetails = ({ currentlyUpdatingChannel, toggleChannelDetails, handleUpdateChannel, onChannelNamenputChange }) => {
    if (currentlyUpdatingChannel) {
        return <div className="details-overlay">
            <div className="details-content">
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

const joinChannel = async (channelUrl) => {

    const channel = await sb.openChannel.getChannel(channelUrl);
    await channel.enter();

    //list all messages
    const messageListParams = new MessageListParams();
    messageListParams.nextResultSize = 20;
    const messages = await channel.getMessagesByTimestamp(0, messageListParams);
    return { channel, messages };

}


const createChannel = async (channelName) => {
    const openChannelParams = new OpenChannelCreateParams();
    openChannelParams.name = channelName;
    openChannelParams.operatorUserIds = [sb.currentUser.userId];
    const openChannel = await sb.openChannel.createChannel(openChannelParams);
    return openChannel;
}

const deleteChannel = async (channelUrl) => {
    const channel = await sb.openChannel.getChannel(channelUrl);
    await channel.delete();
    return channel;
}

const updateChannel = async (currentlyUpdatingChannel, channelNameUpdateValue) => {
    const channel = await sb.openChannel.getChannel(currentlyUpdatingChannel.url);
    const openChannelParams = new OpenChannelUpdateParams();
    openChannelParams.name = channelNameUpdateValue;

    openChannelParams.operatorUserIds = [sb.currentUser.userId];

    await channel.updateChannel(openChannelParams);
}

const deleteMessage = async (currentlyJoinedChannel, messageToDelete) => {
    await currentlyJoinedChannel.deleteMessage(messageToDelete);
}

export default BasicOpenChannelSample;