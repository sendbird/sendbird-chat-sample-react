import SendBird, {
    OpenChannel,
} from 'sendbird';
import { useEffect, useState } from 'react';
import { SENDBIRD_USER_INFO } from '../../constants/constants';

let sb;

const BasicOpenChannelSample = (props) => {

    const [state, updateState] = useState({
        currentlyJoinedChannel: null,
        messages: [],
        channels: [],
        messageInputValue: "",
        file: null,
        messageToUpdate: null,
        loading: true,
    });


    const loadChannels = async (sendbird) => {
        const openChannelQuery = sendbird.OpenChannel.createOpenChannelListQuery();
        const channels = await openChannelQuery.next();
        updateState({ ...state, channels: channels, loading: false })
    }

    const joinChannel = async (channelUrl) => {
        // enter channel
        updateState({ ...state, loading: true })

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

        updateState({ ...state, currentlyJoinedChannel: channel, messages: messages, loading: false })
    }

    const createChannel = async (channelName = "testChannel") => {
        const openChannelParams = new sb.OpenChannelParams();
        openChannelParams.name = channelName;
        openChannelParams.operatorUserIds = [sb.currentUser.userId];
        const openChannel = await sb.OpenChannel.createChannel(openChannelParams);
        const updatedChannels = [openChannel, ...state.channels]
        updateState({ ...state, channels: updatedChannels });
    }

    const deleteChannel = async (channelUrl) => {
        const channel = await sb.OpenChannel.getChannel(channelUrl);
        await channel.delete();
        const updatedChannels = state.channels.filter((channel) => {
            return channel.url !== channelUrl;
        });
        updateState({ ...state, channels: updatedChannels });
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
        const { currentlyJoinedChannel, file } = state;

        const fileMessageParams = new sb.FileMessageParams();
        fileMessageParams.file = file;
        // @ts-ignore
        currentlyJoinedChannel.sendFileMessage(fileMessageParams, () => {
            console.log('worked')
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
                joinChannel={joinChannel}
                createChannel={createChannel}
                deleteChannel={deleteChannel} />
            <CreateChannelPopup />
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
                    onFileInputChange={onFileInputChange} />
            </Channel>
        </>
    );
};

const ChannelList = ({ channels, joinChannel, createChannel, deleteChannel }) => {
    return (
        <div className='channel-list'>
            <div className="channel-type">
                <h1>Open Channels</h1>
                <button onClick={() => createChannel("name")}>Create</button>
            </div>
            {channels.map(channel => {
                return <div className="channel-list-item" onClick={() => { joinChannel(channel.url) }}>
                    <div>{channel.name}</div>
                    <button onClick={() => deleteChannel(channel.url)}>delete</button>
                </div>;
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
            <button onClick={() => deleteMessage(message)}>delete</button>
            <button onClick={() => updateMessage(message)}>update</button>
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

const MessageInput = ({ value, onChange, sendMessage, sendFileMessage, onFileInputChange }) => {
    return (
        <div class="message-input">
            <input
                placeholder="write a message"
                value={value}
                onChange={onChange} />

            <div class="message-input-buttons">
                <button onClick={sendMessage}>Send</button>
                <button onClick={sendFileMessage}>Send File</button>

                <input
                    type='file'
                    onChange={onFileInputChange}
                    onClick={() => { }}
                />
            </div>
        </div>);
}

const CreateChannelPopup = () => {
    return "";

}


export default BasicOpenChannelSample;