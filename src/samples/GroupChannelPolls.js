import { useState, useEffect, useRef } from 'react';
import SendbirdChat from '@sendbird/chat';
import {
    GroupChannelModule,
    GroupChannelFilter,
    GroupChannelListOrder,
    MessageFilter,
    MessageCollectionInitPolicy
} from '@sendbird/chat/groupChannel';
import { PollVoteEvent } from "@sendbird/chat/poll";

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
        pollMessageToUpdate: null,
        messageCollection: null,
        loading: false,
        error: false,
        isCreatePollModalOpen: false,
        pollTitleValue: "",
        pollOptionValue: "",
        pollOptionsArray: [],
        isPollAnonymous: false,
        allowUserSuggestion: false,
        allowMultipleVotes: false,
        isUpdateOptionModal: false,
        optionToUpdate: null,
        updatedPollOptionText: "",
        isAddNewOptionModal: false,
        newPollOptionText: "",
        currentPoll: null,
        checkedOptions: [],

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

        if(messageToDelete._poll) {
          currentlyJoinedChannel.deletePoll(messageToDelete._poll.id)
        }

        await deleteMessage(currentlyJoinedChannel, messageToDelete); // Delete
    }

    const updateMessage = async (message) => {
        if(message._poll) {
          const optionsArr = message._poll.options.map((item) => item.text)

          updateState({
            ...state,
            pollMessageToUpdate: message,
            pollTitleValue: message._poll.title,
            pollOptionsArray: optionsArr,
            allowUserSuggestion: message._poll.allowUserSuggestion,
            allowMultipleVotes: message._poll.allowMultipleVotes,
            isCreatePollModalOpen: true
          })
        } else {
          updateState({ ...state, messageToUpdate: message, messageInputValue: message.message });
        }
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

    const postPoll = async () => {
      const {
        pollTitleValue,
        pollOptionsArray,
        isPollAnonymous,
        allowUserSuggestion,
        allowMultipleVotes,
        currentlyJoinedChannel,
        pollMessageToUpdate
      } = state;

      const params = {};
      params.title = pollTitleValue;
      params.optionTexts = pollOptionsArray;
      params.data = {"text": "Wrong answer!"};
      params.isAnonymous = isPollAnonymous;
      params.allowUserSuggestion = allowUserSuggestion;
      params.allowMultipleVotes = allowMultipleVotes;
      params.closeAt = -1;

      if(pollMessageToUpdate) {
        await currentlyJoinedChannel.updatePoll(pollMessageToUpdate._poll.id, params)

        updateState({
          ...stateRef.current,
          pollTitleValue: "",
          pollOptionValue: "",
          pollOptionsArray: [],
          isPollAnonymous: false,
          allowUserSuggestion: false,
          allowMultipleVotes: false,
          isCreatePollModalOpen: false
        });

      } else {
        const pollData = await sb.poll.create(params);

        const messageParams = {
          message: pollData.title,
          pollId: pollData.id
        };
  
        currentlyJoinedChannel.sendUserMessage(messageParams)
          .onSucceeded((message) => {
  
            updateState({
              ...stateRef.current,
              pollTitleValue: "",
              pollOptionValue: "",
              pollOptionsArray: [],
              isPollAnonymous: false,
              allowUserSuggestion: false,
              allowMultipleVotes: false,
              isCreatePollModalOpen: false
            });
          })
            .onFailed((error) => {
              console.log(error)
              console.log("failed")
            });
      }

    }

    const isShowCreatePollModal = (value) => {
      switch(value) {
        case "open":
          updateState({ ...state, isCreatePollModalOpen: true});
          break;
        case "close":
          updateState({ ...state, isCreatePollModalOpen: false, pollTitleValue: "", pollOptionsArray: []});
          break;
        default:
          console.log("error");
          break;
      }
    }

    const addPollOption = () => {
      if(state.pollOptionValue) {
        updateState({ ...state, pollOptionsArray: [...state.pollOptionsArray, state.pollOptionValue], pollOptionValue: ""})
      }
    }

    const removeOption = (e) => {
      const newPollOptionsArray = state.pollOptionsArray.filter((value) => value !== e.currentTarget.innerHTML)
      updateState({ ...state, pollOptionsArray: newPollOptionsArray })
    }

    const onPollCheckboxInputsChange = (e, name) => {
      updateState({ ...state, [name]: !state[name] })
    }

    const addOrRemoveVoice = async(e, option, message, poll) => {
      const { userIdInputValue, checkedOptions, currentlyJoinedChannel } = state;

      let pollOptionId = option.id;
      let pollOptionIds = [pollOptionId];
      let pollId = poll.id;
      let newVoteCount = e.currentTarget.checked ? option.voteCount + 1 : option.voteCount - 1;
      const updatedVoteCounts = {
        voteCount: newVoteCount,
        optionId: pollOptionId,
      };
      let ts = Date.now();
      let messageId = message.id;
      const pollVoteEventPayload = {
        updatedVoteCounts,
        ts,
        pollId,
        messageId,
      };

      let pollEvent = new PollVoteEvent(pollId, messageId, pollVoteEventPayload);

      switch(e.currentTarget.type) {
        case "checkbox":
          if(e.currentTarget.checked) {
            const newCheckedOptions = checkedOptions.slice(0);
            newCheckedOptions.push(option.id);

            updateState({ ...state, checkedOptions: newCheckedOptions });

            if (!poll.votedPollOptionIds.includes(pollOptionId)) {
              await currentlyJoinedChannel.votePoll(pollId, newCheckedOptions, pollEvent)
            }

          } else if(!e.currentTarget.checked) {
            const newCheckedOptions = checkedOptions.slice(0)
            const filteredNewCheckedOptions = newCheckedOptions.filter((item) => item !== option.id);

            updateState({ ...state, checkedOptions: filteredNewCheckedOptions });

            if (poll.votedPollOptionIds.includes(pollOptionId)) {
              await currentlyJoinedChannel.votePoll(pollId, filteredNewCheckedOptions, pollEvent)
            }
          };
          break;
        case "radio":
          if(e.currentTarget.checked) {
            if (!poll.votedPollOptionIds.includes(pollOptionId)) {
              await currentlyJoinedChannel.votePoll(pollId, pollOptionIds, pollEvent)
            }
          };
          break;
        default:
          console.log("error");
      }
    }

    const updateOption = async() => {
      const { currentlyJoinedChannel, optionToUpdate, updatedPollOptionText } = state;

      await currentlyJoinedChannel.updatePollOption(optionToUpdate.pollId,
      optionToUpdate.id, updatedPollOptionText);

      updateState({ ...state, isUpdateOptionModal: false, optionToUpdate: null });
    }

    const handleDeleteOption = (option) => {
      state.currentlyJoinedChannel.deletePollOption(option.pollId, option.id)
    }

    const addNewOption = async() => {
      const { currentlyJoinedChannel, newPollOptionText, currentPoll } = state
      await currentlyJoinedChannel.addPollOption(currentPoll.id, newPollOptionText);
      updateState({ ...state, isAddNewOptionModal: false })
    }

    const closePoll = async(poll) => {
      await state.currentlyJoinedChannel.closePoll(poll.id);
    }

    const isShowPollModals = (currentObj, value, modalName, currentObjName) => {
      switch(value) {
        case "open":
          updateState({ ...state, [modalName]: true, [currentObjName]: currentObj });
          break;
        case "close":
          updateState({ ...state, [modalName]: false, [currentObjName]: null });
          break;
        default:
          console.log("error");
          break;
      }
    }

    const onPollInputsChange = (e, value) => {
      const newValue = e.currentTarget.value
      updateState({ ...state, [value]: newValue })
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
            <CreatePollModal
                state={state}
                isShowCreatePollModal={isShowCreatePollModal}
                onPollInputsChange={onPollInputsChange}
                addPollOption={addPollOption}
                postPoll={postPoll}
                removeOption={removeOption}
                onPollCheckboxInputsChange={onPollCheckboxInputsChange}
            />
            <UpdateOptionModal
              isUpdateOptionModal={state.isUpdateOptionModal}
              isShowPollModals={isShowPollModals}
              onPollInputsChange={onPollInputsChange}
              updatedPollOptionText={state.updatedPollOptionText}
              updateOption={updateOption}
            />
            <AddNewOptionModal
              isAddNewOptionModal={state.isAddNewOptionModal}
              isShowPollModals={isShowPollModals}
              addNewOption={addNewOption}
              newPollOptionText={state.newPollOptionText}
              onPollInputsChange={onPollInputsChange}
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
                    handleDeleteOption={handleDeleteOption}
                    isShowPollModals={isShowPollModals}
                    closePoll={closePoll}
                    addOrRemoveVoice={addOrRemoveVoice}
                />
                <MessageInput
                    value={state.messageInputValue}
                    onChange={onMessageInputChange}
                    sendMessage={sendMessage}
                    isShowCreatePollModal={isShowCreatePollModal}
                    fileSelected={state.file}
                    onFileInputChange={onFileInputChange}
                />
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

const MessagesList = ({ messages, handleDeleteMessage, updateMessage, handleDeleteOption, closePoll, isShowPollModals, addOrRemoveVoice }) => {
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
                        handleDeleteOption={handleDeleteOption}
                        isShowPollModals={isShowPollModals}
                        closePoll={closePoll}
                        addOrRemoveVoice={addOrRemoveVoice}
                        messageSentByYou={messageSentByYou} />
                    <ProfileImage user={message.sender} />
                </div>
            );
        })}
    </div>
}

const Message = ({ message, updateMessage, handleDeleteMessage, messageSentByYou, handleDeleteOption, closePoll, isShowPollModals, addOrRemoveVoice }) => {
    const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;

    if(message._poll) {
      const {
        title,
        options,
        allowMultipleVotes,
        allowUserSuggestion,
        status
      } = message._poll;

      return (
        <div className={`message poll-message ${messageSentByYou ? 'message-from-you' : ''}`}>
          <div className="message-info">
            <div className="message-user-info">
              <div className="message-sender-name">{message.sender.nickname}{' '}</div>
              <div>{timestampToTime(message.createdAt)}</div>
            </div>
            {messageSentByCurrentUser &&
              <div>
                <button className="control-button" onClick={() => updateMessage(message)}><img className="message-icon" src='/icon_edit.png' /></button>
                <button className="control-button" onClick={() => handleDeleteMessage(message)}><img className="message-icon" src='/icon_delete.png' /></button>
              </div>}
          </div>
          <div>Poll {title}:</div>
          <div>
            {options.map((option, i) => {
              return (
                <div key={option.id} className="freeze-channel input_wrapper option_wrapper">
                  <span style={{ marginRight: "5px" }}>{option.voteCount}:</span>
                  {(status === "open") && 
                    <input
                      type={allowMultipleVotes ? "checkbox" : "radio"}
                      onClick={(e) => addOrRemoveVoice(e, option, message, message._poll)}
                      name="option" />}
                  <label htmlFor="option">{option.text}</label>
                  {(messageSentByCurrentUser && status === "open") &&
                    <>
                      <button className="control-button" onClick={() => isShowPollModals(option, "open", "isUpdateOptionModal", "optionToUpdate")}><img className="option-icon" src='/icon_edit.png' /></button>
                      <button className="control-button" onClick={() => handleDeleteOption(option)}><img className="option-icon" src='/icon_delete.png' /></button>
                    </>
                  }
                </div>
              )
            })}
          </div>
          <div className="poll-status_wrapper">
            {((messageSentByCurrentUser || allowUserSuggestion) && status === "open") &&
              <button onClick={() => isShowPollModals(message._poll, "open", "isAddNewOptionModal", "currentPoll" )} className="add-new-option">Add new option</button>}
            {(messageSentByCurrentUser && status === "open") && 
              <button className="add-new-option" onClick={() => closePoll(message._poll)}>Close poll</button>
            }
            <span className="poll-status">Poll status: {status}</span>
          </div>
        </div>
      )
    }

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

    return (
        <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
            <div className="message-info">
                <div className="message-user-info">
                    <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                    <div>{timestampToTime(message.createdAt)}</div>
                </div>
                {messageSentByCurrentUser &&
                    <div>
                        <button className="control-button" onClick={() => updateMessage(message)}><img className="message-icon" src='/icon_edit.png' /></button>
                        <button className="control-button" onClick={() => handleDeleteMessage(message)}><img className="message-icon" src='/icon_delete.png' /></button>
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

const MessageInput = ({ value, onChange, sendMessage, onFileInputChange, isShowCreatePollModal }) => {
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
                <label className="file-upload-label" htmlFor="upload" >Select File</label>
                <button className="open-poll-btn" onClick={() => isShowCreatePollModal("open")}>Create poll</button>

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

const CreatePollModal = ({
  state,
  isShowCreatePollModal,
  onPollInputsChange,
  addPollOption,
  postPoll,
  removeOption,
  onPollCheckboxInputsChange
}) => {
  const {
    isCreatePollModalOpen,
    pollTitleValue,
    pollOptionValue,
    pollOptionsArray,
    isPollAnonymous,
    allowUserSuggestion,
    allowMultipleVotes
  } = state;

  if (isCreatePollModalOpen) {
      return <div className="overlay">
          <div className="overlay-content create-poll-modal">
            <h3>Create Poll:</h3>
            <div className='create-poll-modal_inputs'>
              <label htmlFor="pollTitle">Title</label>
              <div className="input_wrapper">
                <input
                    type="text"
                    placeholder="write a title"
                    name="pollTitle"
                    value={pollTitleValue}
                    onChange={(e) => onPollInputsChange(e, "pollTitleValue")}
                />
              </div>
              <label htmlFor="pollOption">Add Option</label>
              <div className="input_wrapper">
                <input
                    type="text"
                    placeholder="write an option"
                    name="pollOption"
                    value={pollOptionValue}
                    onChange={(e) => onPollInputsChange(e, "pollOptionValue")}
                />
                <button className="option-add_btn" onClick={addPollOption}>Add</button>
              </div>
              <div className="poll-options input_wrapper">
                {pollOptionsArray.map((item, i) => {
                  return(
                    <span className="options_item" onClick={removeOption} key={`${item}${i}`} data-tooltip="click to delete">{item}</span>
                  )
                })}
              </div>
              <div className="freeze-channel input_wrapper">
                <input type="checkbox" onChange={(e) => onPollCheckboxInputsChange(e, "isPollAnonymous")} checked={isPollAnonymous} />
                Is anonymous?
              </div>
              <div className="freeze-channel input_wrapper">
                <input type="checkbox" onChange={(e) => onPollCheckboxInputsChange(e, "allowUserSuggestion")} checked={allowUserSuggestion} />
                Allow user suggestion?
              </div>
              <div className="freeze-channel input_wrapper">
                <input type="checkbox" onChange={(e) => onPollCheckboxInputsChange(e, "allowMultipleVotes")} checked={allowMultipleVotes} />
                Allow multiple votes?
              </div>
            </div>
            <button className="poll-create_btn" onClick={postPoll}>Create and send</button>
            <span className="poll-close_btn" onClick={() => isShowCreatePollModal("close")}>&#10006;</span>
          </div>
      </div>;
  }
  return null;
}

const UpdateOptionModal = ({
  isUpdateOptionModal,
  isShowPollModals,
  onPollInputsChange,
  updatedPollOptionText,
  updateOption
}) => {
  if(isUpdateOptionModal) {
    return (
      <div className="overlay">
        <div className="overlay-content create-poll-modal">
          <div className="option input_wrapper">
            <input
              type="text"
              placeholder="write an option`s update"
              name="pollOption"
              value={updatedPollOptionText}
              onChange={(e) => onPollInputsChange(e, "updatedPollOptionText")}
            />
            <button className="option-add_btn" onClick={updateOption}>Update</button>
          </div>
          <span className="poll-close_btn" onClick={() => isShowPollModals(null, "close", "isUpdateOptionModal", "optionToUpdate")}>&#10006;</span>
        </div>
      </div>
    )
  }
  return null;
}

const AddNewOptionModal = ({
  isAddNewOptionModal,
  isShowPollModals,
  addNewOption,
  newPollOptionText,
  onPollInputsChange
}) => {
  if(isAddNewOptionModal) {
    return (
      <div className="overlay">
        <div className="overlay-content create-poll-modal">
          <div className="option input_wrapper">
            <input
              type="text"
              placeholder="write an option`s update"
              name="pollOption"
              value={newPollOptionText}
              onChange={(e) => onPollInputsChange(e, "newPollOptionText")}
            />
            <button className="option-add_btn" onClick={addNewOption}>Add</button>
          </div>
          <span className="poll-close_btn" onClick={() => isShowPollModals(null, "close", "isAddNewOptionModal", "currentPoll" )}>&#10006;</span>
        </div>
      </div>
    )
  }
  return null;
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
