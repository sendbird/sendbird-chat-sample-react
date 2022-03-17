import SendBird, {
    OpenChannel,
} from 'sendbird';
import { useEffect, useState } from 'react';
import { SENDBIRD_USER_INFO } from '../../constants/constants';

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


    const loadChannels = async (sendbird) => {
        const openChannelQuery = sendbird.OpenChannel.createOpenChannelListQuery();
        const channels = await openChannelQuery.next();
        updateState({ ...state, channels: channels, loading: false })
    }

    const handleJoinChannel = async (channelUrl) => {
        updateState({ ...state, loading: true })
        const { messages, channel } = await joinChannel(channelUrl);
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

        const userMessageParams = new sb.UserMessageParams();
        userMessageParams.message = state.messageInputValue;
        if (messageToUpdate) {
            currentlyJoinedChannel.updateUserMessage(messageToUpdate.messageId, userMessageParams, (updatedMessage, err) => {
                const messageIndex = messages.findIndex((message => message.messageId == messageToUpdate.messageId));
                messages[messageIndex] = updatedMessage
                updateState({ ...state, messages: messages, messageInputValue: "", messageToUpdate: null });
            });
        } else {
            currentlyJoinedChannel.sendUserMessage(userMessageParams, (message) => {
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

    const deleteMessage = async (messageToDelete) => {
        const { currentlyJoinedChannel } = state;

        await currentlyJoinedChannel.deleteMessage(messageToDelete);
        const updatedMessages = state.messages.filter((message) => {
            return message.messageId !== messageToDelete.messageId;
        });
        updateState({ ...state, messages: updatedMessages });

    }

    const updateMessage = async (message) => {
        updateState({ ...state, messageToUpdate: message, messageInputValue: message.message });
    }

    useEffect(() => {
        const setup = async () => {
            const sendbird = new SendBird({
                appId: SENDBIRD_USER_INFO.appId,
                localCacheEnabled: false
            });

            await sendbird.connect(SENDBIRD_USER_INFO.userId);
            await sendbird.setChannelInvitationPreference(true);

            const sendbirdUser = await sendbird.updateCurrentUserInfo(
                decodeURIComponent(SENDBIRD_USER_INFO.nickname), ''
            );

            loadChannels(sendbird);
            sb = sendbird;
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
                    deleteMessage={deleteMessage}
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
                    <div className="channel-list-item" >
                        <div class="channel-list-item-name"
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

const MessagesList = ({ messages, deleteMessage, updateMessage }) => {
    return messages.map(message => {
        return <div class="message-item">
            <Message message={message} />
            <button onClick={() => updateMessage(message)}>update</button>
            <button onClick={() => deleteMessage(message)}>delete</button>
        </div>;
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
            <div class="message-sender-name">{message.message.sender.nickname}</div>
            <div>{message.message.message}</div>
        </div >
    );

}

const MessageInput = ({ value, onChange, sendMessage, sendFileMessage, onFileInputChange, fileSelected }) => {
    return (
        <div class="message-input">
            <input
                placeholder="write a message"
                value={value}
                onChange={onChange} />

            <div class="message-input-buttons">
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

    const channel = await sb.OpenChannel.getChannel(channelUrl);
    await channel.enter();

    //list all messages
    const messageListParams = new sb.MessageListParams();
    messageListParams.nextResultSize = 20;
    const messages = await channel.getMessagesByTimestamp(0, messageListParams);

    //listen for incoming messages
    const channelHandler = new sb.ChannelHandler();

    channelHandler.onMessageReceived = function (channel, message) {
        console.log('received message')
    };

    sb.addChannelHandler("blah-key", channelHandler);
    return { channel, messages };

}

const createChannel = async (channelName) => {
    const openChannelParams = new sb.OpenChannelParams();
    openChannelParams.name = channelName;
    openChannelParams.operatorUserIds = [sb.currentUser.userId];
    const openChannel = await sb.OpenChannel.createChannel(openChannelParams);
    return openChannel;
}

const deleteChannel = async (channelUrl) => {
    const channel = await sb.OpenChannel.getChannel(channelUrl);
    await channel.delete();
    return channel;
}

const updateChannel = async (currentlyUpdatingChannel, channelNameUpdateValue) => {
    const channel = await sb.OpenChannel.getChannel(currentlyUpdatingChannel.url);
    const openChannelParams = new sb.OpenChannelParams();
    openChannelParams.name = channelNameUpdateValue;

    openChannelParams.operatorUserIds = [sb.currentUser.userId];

    await channel.updateChannel(openChannelParams);
}


export default BasicOpenChannelSample;