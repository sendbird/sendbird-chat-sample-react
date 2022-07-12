
import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import SendbirdChat from '@sendbird/chat';
import {
    GroupChannelHandler,
    GroupChannelModule,
} from '@sendbird/chat/groupChannel';

import { SENDBIRD_INFO } from '../constants/constants';
import { timestampToTime, handleKeyPress } from '../utils/messageUtils';
let sb;

const GroupChannelReportAMessageUserChannel = (props) => {

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
        loading: false,
        error: false,
        isOpenReportModal: false,
        reportObject: {},
        reportKey: "",
        reportCategoriesInputValue: "",
        reportDescriptionInputValue: "",
        showNotification: false,
        reportNotification: ""
    });

    //need to access state in message received callback
    const stateRef = useRef();
    stateRef.current = state;

    const channelRef = useRef();

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
        if (state.currentlyJoinedChannel?.url === channelUrl) {
            return null;
        }
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
        channelHandler.onChannelChanged = () => { };
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
        };
        sb.groupChannel.addGroupChannelHandler(uuid(), channelHandler);
        updateState({ ...state, currentlyJoinedChannel: channel, messages: messages, loading: false })
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
            const userMessageUpdateParams = {};
            userMessageUpdateParams.message = state.messageInputValue;
            const updatedMessage = await currentlyJoinedChannel.updateUserMessage(messageToUpdate.messageId, userMessageUpdateParams)
            const messageIndex = messages.findIndex((item => item.messageId == messageToUpdate.messageId));
            messages[messageIndex] = updatedMessage;
            updateState({ ...state, messages: messages, messageInputValue: "", messageToUpdate: null });
        } else {
            const userMessageParams = {};
            userMessageParams.message = state.messageInputValue;
            currentlyJoinedChannel.sendUserMessage(userMessageParams)
                .onSucceeded((message) => {
                    const updatedMessages = [...messages, message];

                    updateState({ ...state, messages: updatedMessages, messageInputValue: "" });

                })
                .onFailed((error) => {
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
            currentlyJoinedChannel.sendFileMessage(fileMessageParams)
                .onSucceeded((message) => {
                    const updatedMessages = [...messages, message];
                    updateState({ ...state, messages: updatedMessages, messageInputValue: "", file: null });

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
            localCacheEnabled: false,
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
        const [channels, error] = await loadChannels();
        if (error) {
            return onError(error);
        }

        updateState({ ...state, channels: channels, loading: false, settingUpUser: false });
    }

    const toggleNotificationMessage = async (notification) => {
      const { showNotification } = state;
      updateState({ ...state, showNotification: !showNotification, isOpenReportModal: false, reportNotification: notification, reportObject: {}, reportKey: "" })
    }

    const toggleReportModal = (obj, key) => {
      const { isOpenReportModal } = state;
      updateState({ ...state, isOpenReportModal: !isOpenReportModal, reportObject: obj, reportKey: key })
    }

    const onReportCategoriesInputChange = (e) => {
      const reportCategoriesInputValue = e.currentTarget.value;
      updateState({ ...state, reportCategoriesInputValue})
    }

    const onReportDescriptionInputChange = (e) => {
      const reportDescriptionInputValue = e.currentTarget.value;
      updateState({ ...state, reportDescriptionInputValue})
    }

    const sendReport = async () => {
      const { currentlyJoinedChannel, reportCategoriesInputValue, reportDescriptionInputValue, reportObject, reportKey } = state;
      switch(reportKey) {
        case 'Message':
          // Report a message.
          await currentlyJoinedChannel.reportMessage(reportObject, reportCategoriesInputValue, reportDescriptionInputValue);
          break;
        case 'User':
          // Report a user.
          await currentlyJoinedChannel.reportUser(reportObject, reportCategoriesInputValue, reportDescriptionInputValue);
          break;
        case 'Channel':
          // Report a channel.
          await reportObject.report(reportCategoriesInputValue, reportDescriptionInputValue);
          break;
        default:
          break;
      }

      toggleNotificationMessage(reportKey)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
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
                onUserNameInputChange={onUserNameInputChange} />
            <ChannelList
                channels={state.channels}
                toggleReportModal={toggleReportModal}
                showNotification={state.showNotification}
                toggleNotificationMessage={toggleNotificationMessage}
                currentlyJoinedChannel={state.currentlyJoinedChannel}
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
            <ReportModal
              isOpenReportModal={state.isOpenReportModal}
              toggleReportModal={toggleReportModal}
              sendReport={sendReport}
              onReportCategoriesInputChange={onReportCategoriesInputChange}
              reportDescriptionInputValue={state.reportDescriptionInputValue}
              onReportDescriptionInputChange={onReportDescriptionInputChange}
            />

            <Channel
                showNotification={state.showNotification}
                reportNotification={state.reportNotification}
                toggleNotificationMessage={toggleNotificationMessage}
                currentlyJoinedChannel={state.currentlyJoinedChannel} handleLeaveChannel={handleLeaveChannel}
                channelRef={channelRef}
              >
                <MessagesList
                    messages={state.messages}
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
                    toggleReportModal={toggleReportModal}
                />

                <MessageInput
                    value={state.messageInputValue}
                    onChange={onMessageInputChange}
                    sendMessage={sendMessage}
                    fileSelected={state.file}
                    onFileInputChange={onFileInputChange}
                    handleKeyDown={handleKeyDown} />
            </Channel>
            <MembersList
                channel={state.currentlyJoinedChannel}
                toggleReportModal={toggleReportModal}
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
    handleLoadMemberSelectionList,
    toggleReportModal,
    showNotification,
    reportNotification,
    toggleNotificationMessage,
    currentlyJoinedChannel
}) => {
    return (
        <div className='channel-list'>
            <div className="channel-type">
                <h1>Group Channels</h1>
                <button className="channel-create-button" onClick={() => handleLoadMemberSelectionList()}>Create Channel</button>
            </div>
            {showNotification && !currentlyJoinedChannel && <div className='report-notification' onClick={() => toggleNotificationMessage("")}>{ `${reportNotification} was reported` }</div>}
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
                        <button className="control-button" onClick={() => toggleReportModal(channel, 'Channel')}><img className="oc-channel-list-icon" style={{width: "19px"}} src='/report_icon.png' /></button>
                    </div>);
            })}
        </div >);
}

const ChannelName = ({ members }) => {
    const membersToDisplay = members.slice(0, 2);
    const membersNotToDisplay = members.slice(2);

    return <>
        {membersToDisplay.map((member) => {
            return <span key={member.userId}>{member.nickname} </span>
        })}
        {membersNotToDisplay.length > 0 && `+ ${membersNotToDisplay.length}`}
    </>
}


const Channel = ({ currentlyJoinedChannel, children, handleLeaveChannel, toggleNotificationMessage, showNotification, reportNotification, channelRef }) => {
    if (currentlyJoinedChannel) {
        return <div className="channel" ref={channelRef}>
            <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
            {showNotification && <div className='report-notification' onClick={() => toggleNotificationMessage("")}>{ `${reportNotification} was reported` }</div>}
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

const MembersList = ({ channel, handleMemberInvite, toggleReportModal }) => {
    if (channel) {
        return <div className="members-list">
            <button onClick={handleMemberInvite}>Invite</button>
            {channel.members.map((member) => {
              return(
                  <div className="member-item" key={member.userId}>
                    {member.nickname}
                    <button className="control-button" onClick={() => toggleReportModal(member, "User")}><img className="message-icon" style={{width: "19px"}} src='/report_icon.png' /></button>
                  </div>
              )
            })}
        </div>;
    } else {
        return null;
    }


}

const MessagesList = ({ messages, handleDeleteMessage, updateMessage, toggleReportModal }) => {
    return <div className="message-list">
        {messages.map(message => {
            const messageSentByYou = message.sender.userId === sb.currentUser.userId;

            return (
                <div key={message.messageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                    <Message
                        message={message}
                        toggleReportModal={toggleReportModal}
                        handleDeleteMessage={handleDeleteMessage}
                        updateMessage={updateMessage}
                        messageSentByYou={messageSentByYou} />
                    <ProfileImage user={message.sender} />

                </div>);
        })}
    </div >
}

const Message = ({ message, updateMessage, handleDeleteMessage, messageSentByYou, toggleReportModal }) => {
    if (message.url) {
        return (
            <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.createdAt)}</div>
                </div>
                <img src={message.url} />
                <button className="control-button" onClick={() => toggleReportModal(message, "Message")}><img className="message-icon" style={{width: "19px"}} src='/report_icon.png' /></button>
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
                <div>
                  {messageSentByCurrentUser && <>
                        <button className="control-button" onClick={() => updateMessage(message)}><img className="message-icon" src='/icon_edit.png' /></button>
                        <button className="control-button" onClick={() => handleDeleteMessage(message)}><img className="message-icon" src='/icon_delete.png' /></button> </>}
                  <button className="control-button" onClick={() => toggleReportModal(message, "Message")}><img className="message-icon" style={{width: "19px"}} src='/report_icon.png' /></button>
                </div>
            </div>
            <div>{message.message}</div>

        </div >
    );

}

const ProfileImage = ({ user }) => {
    if (user.plainProfileUrl) {
        return <img className="profile-image" src={user.plainProfileUrl} />
    } else {
        return <div className="profile-image-fallback">{user.nickname.charAt(0)}</div>;

    }

}

const MessageInput = ({ value, onChange, sendMessage, onFileInputChange, handleKeyDown }) => {
    return (
        <div className="message-input">
            <input
                placeholder="write a message"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown} />

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
                        onClick={() => addToChannelMembersList(user.userId)}>
                        <ProfileImage user={user} />
                        <div className="member-item-name">{user.nickname}</div>
                    </div>
                })}

            </div>
        </div >;
    }
    return null;
}

const ReportModal = ({ isOpenReportModal, toggleReportModal, sendReport, onReportCategoriesInputChange, reportDescriptionInputValue, onReportDescriptionInputChange }) => {
  if(isOpenReportModal) {
    return <div className="overlay">
      <div className="overlay-content">
        <h3>Report Modal</h3>

        <label htmlFor="report_categories">Report categories: </label>
        <select className="form-input" name="report_categories" id="report_categories" onChange={onReportCategoriesInputChange}>
          <option value=""></option>
          <option value="suspicious">Suspicious</option>
          <option value="harassing">Harassing</option>
          <option value="inappropriate">Inappropriate</option>
          <option value="spam">Spam</option>
        </select>

        <label htmlFor="report_description">Report Description: </label>
        <textarea
          onChange={onReportDescriptionInputChange}
          className="form-input"
          name="report_description"
          id="report_description"
          value={reportDescriptionInputValue} />

        <div>
          <button className="form-button" onClick={() => sendReport()}>Send</button>
          <button className="form-button" onClick={() => toggleReportModal({}, "")}>Cancel</button>
        </div>
      </div>
    </div>
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
            <div className="overlay-content" onKeyDown={(event) => handleKeyPress(event, setupUser)}>
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

                <button
                    className="user-submit-button"
                    onClick={setupUser}>Connect</button>
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
        const messageListParams = {};
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
        const groupChannelParams = {};
        groupChannelParams.addUserIds = userIdsToInvite;
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

export default GroupChannelReportAMessageUserChannel;