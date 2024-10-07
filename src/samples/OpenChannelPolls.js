import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import SendbirdChat from '@sendbird/chat';
import {
    OpenChannelModule,
    OpenChannelHandler,
} from '@sendbird/chat/openChannel';

import { SENDBIRD_INFO } from '../constants/constants';
import { timestampToTime, timestampToDateTime, handleEnterPress } from '../utils/messageUtils';
let sb;

const OpenChannelPolls = (props) => {

    const [state, updateState] = useState({
        currentlyJoinedChannel: null,
        currentlyUpdatingChannel: null,
        currentlyJoinedChannelOperators: [],
        applicationUsers: [],
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
      const { channels } = state;
      updateState({ ...state, loading: true });
      const channelToJoin = channels.find((channel) => channel.url === channelUrl);
      const [channel, messages, error] = await joinChannel(channelToJoin);
      const [operators] = await getChannelOperators(channel);
      if (error) {
          //return onError(error);
          console.error(error);
      }

      //listen for incoming messages
      const channelHandler = new OpenChannelHandler();
      channelHandler.onMessageUpdated = (channel, message) => {
          const messageIndex = stateRef.current.messages.findIndex((item => item.messageId === message.messageId));
          const updatedMessages = [...stateRef.current.messages];
          updatedMessages[messageIndex] = message;
          updateState({ ...stateRef.current, messages: updatedMessages });
      }

      channelHandler.onMessageReceived = (channel, message) => {
          console.log('current messages = ', stateRef.current.messages);
          console.log('new message = ', message);
          const updatedMessages = [...stateRef.current.messages, message];
          updateState({ ...stateRef.current, messages: updatedMessages });
      };

      channelHandler.onMessageDeleted = (channel, message) => {
          const updatedMessages = stateRef.current.messages.filter((messageObject) => {
              return messageObject.messageId !== message;
          });
          updateState({ ...stateRef.current, messages: updatedMessages });
      };

      channelHandler.onPollUpdated = (channel, pollEvent) => {
        const { checkedOptions } = state;

        const messageIndex = stateRef.current.messages.findIndex((item => (item.poll) && (item.poll.id === pollEvent.pollId)));
        const updatedMessages = [...stateRef.current.messages];
        updatedMessages[messageIndex].poll.applyPollUpdateEvent(pollEvent);

        const newCheckedOptions = checkedOptions.slice(0);
        if (newCheckedOptions.length > 0) {
          newCheckedOptions.forEach((optionId) => {
            if (!updatedMessages[messageIndex].poll.votedPollOptionIds.includes(optionId)) {
              newCheckedOptions.splice(newCheckedOptions.indexOf(optionId), 1);
            }
          });
        }
        updateState({ ...stateRef.current, messages: updatedMessages, checkedOptions: newCheckedOptions });
      };

      channelHandler.onPollVoted = (channel, pollEvent) => {
        const messageIndex = stateRef.current.messages.findIndex((item => (item.poll) && (item.poll.id === pollEvent.pollId)));
        const updatedMessages = [...stateRef.current.messages];
        updatedMessages[messageIndex].poll.applyPollVoteEvent(pollEvent)
        updateState({ ...state, currentlyJoinedChannel: channel, messages: updatedMessages });
      };

      channelHandler.onPinnedMessageUpdated = (channel) => {
        updateState({ ...stateRef.current, currentlyJoinedChannel: channel, pinnedMessageIds: channel.pinnedMessageIds });
      };

      channelHandler.onUserBanned = (channel, user) => {
        if (user.userId === sb.currentUser.userId) {
          channel.exit();
          updateState({ ...stateRef.current, currentlyJoinedChannel: null, pinnedMessageIds: [] });
        } else {
          updateState({ ...stateRef.current, currentlyJoinedChannel: channel, pinnedMessageIds: channel.pinnedMessageIds });
        }
      };

      sb.openChannel.addOpenChannelHandler(uuid(), channelHandler);
      updateState({
         ...state,
         currentlyJoinedChannel: channel,
         messages: messages,
         loading: false,
         currentlyJoinedChannelOperators: operators,
         pinnedMessageIds: channel ? channel.pinnedMessageIds : [],
      });
    }

    const handleLeaveChannel = async () => {
      const { currentlyJoinedChannel } = state;
      await currentlyJoinedChannel.exit();

      updateState({ ...state, currentlyJoinedChannel: null })
    }

    const handleCreateChannel = async (channelName = "testChannel",) => {
      const { channelNameInputValue } = state;
      const [openChannel, error] = await createChannel(channelNameInputValue);
      if (error) {
          return onError(error);
      }
      const updatedChannels = [openChannel, ...state.channels];
      updateState({ ...state, channels: updatedChannels, showChannelCreate: false });
    }

    const handleDeleteChannel = async (channelUrl) => {
      const [error] = await deleteChannel(channelUrl);
      if (error) {
          return onError(error);
      }
      const updatedChannels = state.channels.filter((channel) => {
          return channel.url !== channelUrl;
      });
      updateState({ ...state, channels: updatedChannels });
    }

    const handleUpdateChannel = async () => {
      const { currentlyUpdatingChannel, channelNameInputValue, channels } = state;
      const [updatedChannel, error] = await updateChannel(currentlyUpdatingChannel, channelNameInputValue);
      if (error) {
          return onError(error);
      }
      const indexToReplace = channels.findIndex((channel) => channel.url === currentlyUpdatingChannel.channelUrl);
      const updatedChannels = [...channels];
      updatedChannels[indexToReplace] = updatedChannel;
      updateState({ ...state, channels: updatedChannels, currentlyUpdatingChannel: null });
    }

    const toggleChannelDetails = (channel) => {
      if (channel) {
          updateState({ ...state, currentlyUpdatingChannel: channel });
      } else {
          updateState({ ...state, currentlyUpdatingChannel: null });
      }
    }

    const toggleShowCreateChannel = () => {
        updateState({ ...state, showChannelCreate: !state.showChannelCreate });
    }

    const onChannelNamenIputChange = (e) => {
        const channelNameInputValue = e.currentTarget.value;
        updateState({ ...state, channelNameInputValue });
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
            const messageIndex = messages.findIndex((item => item.messageId === messageToUpdate.messageId));
            messages[messageIndex] = updatedMessage;
            updateState({ ...state, messages: messages, messageInputValue: "", messageToUpdate: null });
        } else {
            const userMessageParams = {};
            userMessageParams.message = state.messageInputValue
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
            const { currentlyJoinedChannel } = state;
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
      console.log('temp = ', state.pinnedMessageIds.filter(pinnedMessageId => pinnedMessageId !== message.messageId));
      updateState({ ...state, pinnedMessageIds: state.pinnedMessageIds.filter(pinnedMessageId => pinnedMessageId !== message.messageId) });
    }

    const setupUser = async () => {
        const { userNameInputValue, userIdInputValue } = state;
        console.log('Custom Server Address = ', SENDBIRD_INFO.customApiHost, SENDBIRD_INFO.customWebSocketHost);
        const sendbirdChat = await SendbirdChat.init({
            appId: SENDBIRD_INFO.appId,
            localCacheEnabled: true,
            customApiHost: SENDBIRD_INFO.customApiHost,
            customWebSocketHost: SENDBIRD_INFO.customWebSocketHost,
            modules: [new OpenChannelModule()],
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
        const [users] = await getAllApplicationUsers();
        if (error) {
            return onError(error);
        }

        updateState({ ...state, channels: channels, loading: false, settingUpUser: false, applicationUsers: users });
    }

    const toggleMembersList = () => {
      updateState({ ...state, isShowMembersList: !state.isShowMembersList });
    }

    const handleOperator = async (callbackName, user) => {
      const { currentlyJoinedChannel, applicationUsers } = state;

      try {
          await currentlyJoinedChannel[callbackName]([user.userId]);
          const [operators] = await getChannelOperators(currentlyJoinedChannel);
          updateState({ ...state, applicationUsers: applicationUsers, currentlyJoinedChannelOperators: operators })
      } catch (error) {
          console.log("Error");
          console.log(error);
      }
    }

    const registerUnregisterAnOperator = (user, isOperator) => {
      if(isOperator) {
          handleOperator("removeOperators", user);
          alert("Operator was unregister");
      } else {
          handleOperator("addOperators", user);
          alert("Operator was register");
      }
    }

    const toggleShowPinnedMessagesListModal = async () => {
      updateState({ ...state, showPinnedMessagesListModal: !state.showPinnedMessagesListModal });
    }

    const setMaxCountPinnedMessageError = (errorState) => {
        updateState({ ...state, isMaxCountPinnedMessagesError: errorState });
    }

    const postPoll = async () => {
      const {
        messages,
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
            const updatedMessages = [...messages, message];
            updateState({
              ...stateRef.current,
              messages: updatedMessages,
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
      const { checkedOptions, currentlyJoinedChannel } = state;

      let pollOptionId = option.id;
      let pollOptionIds = [pollOptionId];
      let pollId = poll.id;

      switch(e.currentTarget.type) {
        case "checkbox":
          if(e.currentTarget.checked) {
            const newCheckedOptions = checkedOptions.slice(0);
            newCheckedOptions.push(option.id);

            updateState({ ...state, checkedOptions: newCheckedOptions });

            if (!poll.votedPollOptionIds.includes(pollOptionId)) {
              const pollEvent = await currentlyJoinedChannel.votePoll(pollId, newCheckedOptions);
              poll.applyPollVoteEvent(pollEvent);
              updateState({ ...stateRef.current });
            }

          } else if(!e.currentTarget.checked) {
            const newCheckedOptions = checkedOptions.slice(0)
            const filteredNewCheckedOptions = newCheckedOptions.filter((item) => item !== option.id);

            updateState({ ...state, checkedOptions: filteredNewCheckedOptions });

            if (poll.votedPollOptionIds.includes(pollOptionId)) {
              const pollEvent = await currentlyJoinedChannel.votePoll(pollId, filteredNewCheckedOptions);
              poll.applyPollVoteEvent(pollEvent);
              updateState({ ...stateRef.current });
            }
          };
          break;
        case "radio":
          if(e.currentTarget.checked) {
            if (!poll.votedPollOptionIds.includes(pollOptionId)) {
              const pollEvent = await currentlyJoinedChannel.votePoll(pollId, pollOptionIds);
              poll.applyPollVoteEvent(pollEvent);
              updateState({ ...stateRef.current });
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
                toggleChannelDetails={toggleChannelDetails}
                handleJoinChannel={handleJoinChannel}
                toggleShowCreateChannel={toggleShowCreateChannel}
                handleDeleteChannel={handleDeleteChannel}
            />
            <ChannelDetails
                currentlyUpdatingChannel={state.currentlyUpdatingChannel}
                handleUpdateChannel={handleUpdateChannel}
                onChannelNamenIputChange={onChannelNamenIputChange}
                toggleChannelDetails={toggleChannelDetails} />
            <ChannelCreate
                showChannelCreate={state.showChannelCreate}
                toggleShowCreateChannel={toggleShowCreateChannel}
                onChannelNamenIputChange={onChannelNamenIputChange}
                handleCreateChannel={handleCreateChannel} />
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
                operators={state.currentlyJoinedChannelOperators}
                userIdInputValue={state.userIdInputValue}
                handleLeaveChannel={handleLeaveChannel}
                channelRef={channelRef}
                toggleMembersList={toggleMembersList}
                pinnedMessageIds={state.pinnedMessageIds}
                toggleShowPinnedMessagesListModal={toggleShowPinnedMessagesListModal}
            >
                <MessagesList
                    messages={state.messages}
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
                    handleDeleteOption={handleDeleteOption}
                    isShowPollModals={isShowPollModals}
                    closePoll={closePoll}
                    addOrRemoveVoice={addOrRemoveVoice}
                    handlePinMessage={handlePinMessage}
                    handleUnpinMessage={handleUnpinMessage}
                    pinnedMessageIds={state.pinnedMessageIds}
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
              toggleMembersList={toggleMembersList}
              isShowMembersList={state.isShowMembersList}
              users={state.applicationUsers}
              userIdInputValue={state.userIdInputValue}
              operators={state.currentlyJoinedChannelOperators}
              registerUnregisterAnOperator={registerUnregisterAnOperator}
            />
            <PinnedMessagesListModal
              messages={state.messages}
              pinnedMessageIds={state.pinnedMessageIds}
              showPinnedMessagesListModal={state.showPinnedMessagesListModal}
              toggleShowPinnedMessagesListModal={toggleShowPinnedMessagesListModal}
              handleUnpinMessage={handleUnpinMessage}
              addOrRemoveVoice={addOrRemoveVoice}
              handleDeleteOption={handleDeleteOption}
              closePoll={closePoll}
              isShowPollModals={isShowPollModals}
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
    toggleShowCreateChannel,
    handleDeleteChannel,
    toggleChannelDetails
}) => {
  return (
    <div className='channel-list'>
        <div className="channel-type">
            <h1>Open Channels</h1>
            <button className="channel-create-button" onClick={toggleShowCreateChannel}>Create Channel</button>
        </div>
        {
            channels.map(channel => {
                const userIsOperator = channel.operators.some((operator) => operator.userId === sb.currentUser.userId)
                return (
                    <div key={channel.url} className="channel-list-item" >
                        <div className="channel-list-item-name"
                            onClick={() => { handleJoinChannel(channel.url) }}>
                            {channel.name}
                        </div>
                        {userIsOperator &&
                            <div>
                                <button className="control-button" onClick={() => toggleChannelDetails(channel)}>
                                    <img className="channel-icon" src='/icon_edit.png' alt=''/>

                                </button>
                                <button className="control-button" onClick={() => handleDeleteChannel(channel.url)}>
                                    <img className="channel-icon" src='/icon_delete.png' alt=''/>

                                </button>
                            </div>}
                    </div>);
            })
        }
    </div >);
}

const Channel = ({
  currentlyJoinedChannel,
  children,
  handleLeaveChannel,
  toggleMembersList,
  channelRef,
  operators,
  userIdInputValue,
  pinnedMessageIds,
  toggleShowPinnedMessagesListModal,
 }) => {
    if (currentlyJoinedChannel) {
      //const isOperator = operators.find((operator) => userIdInputValue === operator.userId);
      const isOperator = currentlyJoinedChannel.operators.find((operator) => operator.userId === sb.currentUser.userId);
      return <div className="channel" ref={channelRef}>
          <ChannelHeader>{currentlyJoinedChannel.name}</ChannelHeader>
          <div>
              <button className="leave-channel" onClick={handleLeaveChannel}>Exit Channel</button>
              <button className="leave-channel" onClick={toggleShowPinnedMessagesListModal}>{pinnedMessageIds ? pinnedMessageIds.length : 0} pinned</button>
              {isOperator && <button className="leave-channel register-as-operator-btn" onClick={toggleMembersList}>Open users list</button>}
          </div>
          <div>{children}</div>
      </div>;
    }
    return <div className="channel"></div>;
}

const ChannelHeader = ({ children }) => {
    return <div className="channel-header">{children}</div>;
}

const MessagesList = ({ 
  messages,
  handleDeleteMessage,
  updateMessage,
  handleDeleteOption,
  closePoll,
  isShowPollModals,
  addOrRemoveVoice,
  pinnedMessageIds,
  handlePinMessage,
  handleUnpinMessage,
}) => {
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
                        handleDeleteOption={handleDeleteOption}
                        isShowPollModals={isShowPollModals}
                        closePoll={closePoll}
                        addOrRemoveVoice={addOrRemoveVoice}
                        handlePinMessage={handlePinMessage}
                        handleUnpinMessage={handleUnpinMessage}
                        messageSentByYou={messageSentByYou} />
                    <ProfileImage user={message.sender} />
                </div>
            );
        })}
    </div>
}

const Message = ({ 
  message,
  pinnedMessageIds,
  updateMessage,
  handleDeleteMessage,
  messageSentByYou,
  handleDeleteOption,
  closePoll,
  isShowPollModals,
  addOrRemoveVoice,
  handlePinMessage,
  handleUnpinMessage,
 }) => {
    const messageSentByCurrentUser = message.sender.userId === sb.currentUser.userId;
    const isPinnedMessage = pinnedMessageIds.includes(message.messageId);

    if(message._poll) {
      const {
        id,
        createdAt,
        title,
        options,
        voterCount,
        allowMultipleVotes,
        allowUserSuggestion,
        votedPollOptionIds,
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
              {
                isPinnedMessage ?
                  <button className="control-button" onClick={() => handleUnpinMessage(message)}>
                    <img className="message-icon" src='/icon_unpin.png' alt=''/>
                  </button> :
                  <button className="control-button" onClick={() => handlePinMessage(message)}>
                    <img className="message-icon" src='/icon_pin.png' alt=''/>
                  </button>}
                  <button className="control-button" onClick={() => updateMessage(message)}><img className="message-icon" src='/icon_edit.png' alt=''/></button>
                  <button className="control-button" onClick={() => handleDeleteMessage(message)}><img className="message-icon" src='/icon_delete.png' alt=''/></button>
                </div>
              }
          </div>
          <div className='poll-info'>
            <div>Poll ID: {id}</div>
            <div>Poll CreatedAt: {timestampToDateTime(createdAt)}</div>
          </div>
          <div>Title: {title}</div>
          <div>
            {options.map((option, i) => {
              return (
                <div key={option.id} className="freeze-channel input_wrapper option_wrapper">
                  <span style={{ marginRight: "5px" }}>{option.voteCount}({(voterCount ? option.voteCount/voterCount : 0) * 100}%):</span>
                  {(status === "open") && 
                    <input
                      type={allowMultipleVotes ? "checkbox" : "radio"}
                      onClick={(e) => addOrRemoveVoice(e, option, message, message._poll)}
                      defaultChecked={votedPollOptionIds.includes(option.id)}
                      name="option" />
                  }
                  <label htmlFor="option">{option.text}</label>
                  {(messageSentByCurrentUser && status === "open") &&
                    <>
                      <button className="control-button" onClick={() => isShowPollModals(option, "open", "isUpdateOptionModal", "optionToUpdate")}><img className="option-icon" src='/icon_edit.png' alt=''/></button>
                      <button className="control-button" onClick={() => handleDeleteOption(option)}><img className="option-icon" src='/icon_delete.png' alt=''/></button>
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
                <img src={message.url} alt=''/>
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
                            <img className="message-icon" src='/icon_unpin.png' alt=''/>
                          </button> :
                          <button className="control-button" onClick={() => handlePinMessage(message)}>
                            <img className="message-icon" src='/icon_pin.png' alt=''/>
                          </button>
                        }
                        <button className="control-button" onClick={() => updateMessage(message)}><img className="message-icon" src='/icon_edit.png' alt=''/></button>
                        <button className="control-button" onClick={() => handleDeleteMessage(message)}><img className="message-icon" src='/icon_delete.png' alt=''/></button>
                    </div>}
            </div>
            <div>{message.message}</div>
        </div>
    );
}

const ProfileImage = ({ user }) => {
    if (user.plainProfileUrl) {
        return <img className="profile-image" src={user.plainProfileUrl} alt=''/>
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

const ChannelDetails = ({
  currentlyUpdatingChannel,
  toggleChannelDetails,
  handleUpdateChannel,
  onChannelNamenIputChange
}) => {
  if (currentlyUpdatingChannel) {
      return <div className="overlay">
          <div className="overlay-content">
              <h3>Update Channel Details</h3>
              <div> Channel name</div>
              <input className="form-input" onChange={onChannelNamenIputChange} />
              <button className="form-button" onClick={() => toggleChannelDetails(null)}>Close</button>
              <button onClick={() => handleUpdateChannel()}>Update channel name</button>
          </div>
      </div>;
  }
  return null;
}

const ChannelCreate = ({
  showChannelCreate,
  toggleShowCreateChannel,
  handleCreateChannel,
  onChannelNamenIputChange
}) => {
  if (showChannelCreate) {
      return <div className="overlay">
          <div className="overlay-content">
              <div>
                  <h3>Create Channel</h3>
              </div>
              <div>Name</div>
              <input className="form-input" onChange={onChannelNamenIputChange} onKeyDown={(event) => handleEnterPress(event, handleCreateChannel)} />
              <div>
                  <button className="form-button" onClick={handleCreateChannel}>Create</button>
                  <button className="form-button" onClick={toggleShowCreateChannel}>Cancel</button>
              </div>
          </div>
      </div>;
  }
  return null;
}

const MembersList = ({ toggleMembersList, isShowMembersList, users, registerUnregisterAnOperator, userIdInputValue, operators, muteUnmuteUser }) => {
  if (isShowMembersList && users) {
      return <div className="members-list">
          <button onClick={toggleMembersList}>Close</button>
          {users.map((user) => {
              const isOperator = operators.find((operator) => user.userId === operator.userId);
              const userIsNotSender = (user.userId !== userIdInputValue);
              return(
                <div key={user.userId}>
                  <div key={user.userId} className="member-item-wrapper">
                    <div className="member-item">
                      {user.nickname}
                      {isOperator && <img className="message-icon" src='/operator_icon.png' alt=''/>}
                    </div>
                    {userIsNotSender && <button onClick={() => registerUnregisterAnOperator(user, isOperator)}>
                      {isOperator ? "Unregister as operator" : "Register as operator"}
                    </button>}
                    {userIsNotSender && <button className="mute-button" onClick={() => muteUnmuteUser(user, isOperator)}>
                      {user.isMuted ? "Unmute" : "Mute"}
                    </button>}
                  </div>
                </div>
              )
            })}
      </div>;
  } else {
      return null;
  }
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

const PinnedMessage = ({ message, handleUnpinMessage, messageSentByYou, addOrRemoveVoice, handleDeleteOption, closePoll, isShowPollModals }) => {
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
                      <img className="message-icon" src='/icon_unpin.png' alt=''/>
                    </button>
                  </div>}
              </div>
            </div>
            <img className="message-img" src={message.url} alt=''/>
          </div >);
  }

  if (message._poll) {
    const {
      id,
      createdAt,
      title,
      options,
      voterCount,
      allowMultipleVotes,
      allowUserSuggestion,
      votedPollOptionIds,
      status
    } = message._poll;

    return (
      <div className={`message  ${messageSentByYou ? 'message-from-you' : ''}`}>
          <div className="message-info">
              <div className="message-user-info">
                  <div className="message-sender-name">{message.sender.nickname}{' '}</div>
                  <div>{timestampToTime(message.createdAt)}</div>
              </div>
              {messageSentByCurrentUser &&
                  <div>
                      <button className="control-button" onClick={() => handleUnpinMessage(message)}><img className="message-icon" src='/icon_unpin.png' alt=''/></button>
                  </div>}
          </div>
          <div className='poll-info'>
            <div>Poll ID: {id}</div>
            <div>Poll CreatedAt: {timestampToDateTime(createdAt)}</div>
          </div>
          <div>Title: {title}</div>
          <div>
            {options.map((option, i) => {
              return (
                <div key={option.id} className="freeze-channel input_wrapper option_wrapper">
                <span style={{ marginRight: "5px" }}>{option.voteCount}({(voterCount ? option.voteCount/voterCount : 0) * 100}%):</span>
                  {(status === "open") && 
                    <input
                      type={allowMultipleVotes ? "checkbox" : "radio"}
                      onClick={(e) => addOrRemoveVoice(e, option, message, message._poll)}
                      defaultChecked={votedPollOptionIds.includes(option.id)}
                      name="option" />
                  }
                  <label htmlFor="option">{option.text}</label>
                  {(messageSentByYou && status === "open") &&
                    <>
                      <button className="control-button" onClick={() => isShowPollModals(option, "open", "isUpdateOptionModal", "optionToUpdate")}><img className="option-icon" src='/icon_edit.png' alt=''/></button>
                      <button className="control-button" onClick={() => handleDeleteOption(option)}><img className="option-icon" src='/icon_delete.png' alt=''/></button>
                    </>
                  }
                </div>
              )
            })}
          </div>
          <div className="poll-status_wrapper">
            {((messageSentByYou || allowUserSuggestion) && status === "open") &&
              <button onClick={() => isShowPollModals(message._poll, "open", "isAddNewOptionModal", "currentPoll" )} className="add-new-option">Add new option</button>}
            {(messageSentByYou && status === "open") && 
              <button className="add-new-option" onClick={() => closePoll(message._poll)}>Close poll</button>
            }
            <span className="poll-status">Poll status: {status}</span>
          </div>
      </div>
    );
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
                      <button className="control-button" onClick={() => handleUnpinMessage(message)}><img className="message-icon" src='/icon_unpin.png' alt=''/></button>
                  </div>}
          </div>
          <div>{message.message}</div>
      </div>
  );
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
  pinnedMessageIds,
  addOrRemoveVoice,
  handleDeleteOption,
  closePoll,
  isShowPollModals,
}) => {
  const pinnedMessages = messages.filter(message => pinnedMessageIds.includes(message.messageId))
  
  if (showPinnedMessagesListModal) {
      return <div className="overlay ">
          <div className="overlay-content scheduled-messages-list-modal">
              <div className="scheduled-message-header">Pinned messages</div>

              <div className="message-list">
                  {pinnedMessages.map(message => {
                    const messageSentByYou = message.sender.userId === sb.currentUser.userId;
                    return (
                      <div key={message.messageId} className={`message-item ${messageSentByYou ? 'message-from-you' : ''}`}>
                          <PinnedMessage
                              message={message}
                              handleUnpinMessage={handleUnpinMessage}
                              messageSentByYou={messageSentByYou} 
                              addOrRemoveVoice={addOrRemoveVoice}
                              handleDeleteOption={handleDeleteOption}
                              closePoll={closePoll}
                              isShowPollModals={isShowPollModals}
                          />
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
const loadChannels = async () => {
  try {
      const openChannelQuery = sb.openChannel.createOpenChannelListQuery({ limit: 30 });
      const channels = await openChannelQuery.next();
      return [channels, null];

  } catch (error) {
      return [null, error];
  }
}

const joinChannel = async (channel) => {
  try {
      await channel.enter();
      //list all messages
      const messageListParams = {};
      messageListParams.nextResultSize = 20;
      const messages = await channel.getMessagesByTimestamp(0, messageListParams);
      return [channel, messages, null];
  } catch (error) {
      return [null, null, error]
  }
}

const createChannel = async (channelName, userIdsToInvite) => {
  try {
      const openChannelParams = {};
      openChannelParams.name = channelName;
      openChannelParams.operatorUserIds = [sb.currentUser.userId];
      const openChannel = await sb.openChannel.createChannel(openChannelParams);
      return [openChannel, null];
  } catch (error) {
      return [null, error];
  }
}

const deleteChannel = async (channelUrl) => {
  try {
      const channel = await sb.openChannel.getChannel(channelUrl);
      await channel.delete();
      return [channel, null];
  } catch (error) {
      return [null, error];
  }
}

const updateChannel = async (currentlyUpdatingChannel, channelNameInputValue) => {
  try {
      const channel = await sb.openChannel.getChannel(currentlyUpdatingChannel.url);
      const openChannelParams = {};
      openChannelParams.name = channelNameInputValue;

      openChannelParams.operatorUserIds = [sb.currentUser.userId];

      const updatedChannel = await channel.updateChannel(openChannelParams);
      return [updatedChannel, null];
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

const getChannelOperators = async (channel) => {
  try {
    const query = channel.createOperatorListQuery();
    const operators = await query.next();
    return [operators, null];
  } catch (error) {
    return [null, error];
  }
}

export default OpenChannelPolls;
