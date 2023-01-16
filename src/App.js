import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
// Basic samples
import BasicOpenChannelSample from './samples/BasicOpenChannelSample';
import BasicGroupChannelSample from './samples/BasicGroupChannelSample';

// Open channel samples
import OpenChannelCategorizeByCustomType from './samples/OpenChannelCategorizeByCustomType';
import OpenChannelThumbnails from './samples/OpenChannelThumbnails';
import OpenChannelMessageThreading from './samples/OpenChannelMessageThreading';
import OpenChannelSendAnAdminMessage from './samples/OpenChannelSendAnAdminMessage'
import OpenChannelFreeze from './samples/OpenChannelFreeze';
import OpenChannelSendAndReceiveVariousTypesOfFiles from './samples/OpenChannelSendAndReceiveVariousTypesOfFiles'
import OpenChannelCopyMessage from './samples/OpenChannelCopyMessage';
import OpenChannelDisplayOGTags from './samples/OpenChannelDisplayOGTags';
import OpenChannelMetadataAndMetacounter from './samples/OpenChannelMetadataAndMetacounter';
import OpenChannelAddExtraDataToMessage from './samples/OpenChannelAddExtraDataToMessage';
import OpenChannelReportAMessageUserChannel from './samples/OpenChannelReportAMessageUserChannel'
import OpenChannelUsersOnlineStatus from './samples/OpenChannelUsersOnlineStatus';
import OpenChannelCategorizeMessagesByCustomType from './samples/OpenChannelCategorizeMessagesByCustomType';
import OpenChannelUserProfileUpdate from './samples/OpenChannelUserProfileUpdate';
import OpenChannelStructuredData from './samples/OpenChannelStructuredData';
import OpenChannelUserDoNotDisturbOrSnooze from './samples/OpenChannelUserDoNotDisturbOrSnooze';
import OpenChannelRegisterUnregisterOperator from './samples/OpenChannelRegisterUnregisterOperator';
import OpenChannelMuteUnmuteUsers from './samples/OpenChannelMuteUnmuteUsers';
import OpenChannelBanUnbanUsers from './samples/OpenChannelBanUnbanUsers';
import OpenChannelUpdateDeleteMessageByOperator from './samples/OpenChannelUpdateDeleteMessageByOperator';
import OpenChannelMembersListOrder from './samples/OpenChannelMembersListOrder';

// Group channel samples
import GroupChannelTypingIndicatorSample from './samples/GroupChannelTypingIndicatorSample';
import GroupChannelMessageThreading from './samples/GroupChannelMessageThreading'
import GroupChannelSendAnAdminMessage from './samples/GroupChannelSendAnAdminMessage';
import GroupChannelFreezeUnfreeze from './samples/GroupChannelFreezeUnfreeze';
import GroupChannelDisplayOGTags from './samples/GroupChannelDisplayOGTags';
import GroupChannelMarkMessagesAsRead from './samples/GroupChannelMarkMessagesAsRead';
import GroupChannelReactToAMessage from './samples/GroupChannelReactToAMessage';
import GroupChannelCategorizeByCustomType from './samples/GroupChannelCategorizeByCustomType';
import GroupChannelReportAMessageUserChannel from './samples/GroupChannelReportAMessageUserChannel'
import GroupChannelCategorizeMessagesByCustomType from './samples/GroupChannelCategorizeMessagesByCustomType';
import GroupChannelRetrieveOnlineStatus from './samples/GroupChannelRetrieveOnlineStatus';
import GroupChannelRegisterUnregisterOperator from './samples/GroupChannelRegisterUnregisterOperator';
import GroupChannelReactChannelTypes from './samples/GroupChannelTypes';
import GroupChannelUpdateDeleteMessageByOperator from './samples/GroupChannelUpdateDeleteMessageByOperator';
import GroupChannelArchive from './samples/GroupChannelArchive'
import GroupChannelMuteUnmuteUsers from './samples/GroupChannelMuteUnmuteUsers';
import GroupChannelBanUnbanUsers from './samples/GroupChannelBanUnbanUsers';
import GroupChannelRetrieveNumberOfMembersHaventReceivedMessage from './samples/GroupChannelRetrieveNumberOfMembersHaventReceivedMessage';
import GroupChannelOperatorsList from './samples/GroupChannelOperatorsList';
import GroupChannelMembersListOrder from './samples/GroupChannelMembersListOrder';
import GroupChannelRetrieveAListOfBannedOrMutedUsers from './samples/GroupChannelRetrieveAListOfBannedOrMutedUsers';
import GroupChannelUserProfileUpdate from './samples/GroupChannelUserProfileUpdate';
import GroupChannelRetrieveNumberOfMembersHaventReadMessage from './samples/GroupChannelRetrieveNumberOfMembersHaventReadMessage';
import GroupChannelUserDoNotDisturbOrSnooze from './samples/GroupChannelUserDoNotDisturbOrSnooze';
import GroupChannelStructuredData from './samples/GroupChannelStructuredData';
import GroupChannelPolls from './samples/GroupChannelPolls.js';
import GroupChannelUsersOnlineStatus from './samples/GroupChannelUsersOnlineStatus';
import GroupChannelScheduledMessages from './samples/GroupChannelScheduledMessages';
import GroupChannelPinnedMessages from './samples/GroupChannelPinnedMessages';

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/open-channel' element={<BasicOpenChannelSample />} />
        <Route path='/group-channel' element={<BasicGroupChannelSample />} />
        <Route path='/group-channel-typing-indicator' element={<GroupChannelTypingIndicatorSample />} />
        <Route path='/freeze-open-channel' element={<OpenChannelFreeze />} />
        <Route path='/group-channel-message-threading' element={<GroupChannelMessageThreading />} />
        <Route path='/open-channel-send-an-admin-message' element={<OpenChannelSendAnAdminMessage />} />
        <Route path='/open-channel-message-threading' element={<OpenChannelMessageThreading />} />
        <Route path='/open-channel-copy-message' element={<OpenChannelCopyMessage />} />
        <Route path='/open-channel-send-and-receive-various-types-of-files' element={<OpenChannelSendAndReceiveVariousTypesOfFiles />} />
        <Route path='/group-channel-send-an-admin-message' element={<GroupChannelSendAnAdminMessage />} />
        <Route path='/open-channel-display-og-tags' element={<OpenChannelDisplayOGTags />} />
        <Route path='/group-channel-freeze-unfreeze' element={<GroupChannelFreezeUnfreeze />} />
        <Route path='/group-channel-display-og-tags' element={<GroupChannelDisplayOGTags />} />
        <Route path='/group-channel-react-to-a-message' element={<GroupChannelReactToAMessage />} />
        <Route path='/open-channel-categorize-by-custom-type' element={<OpenChannelCategorizeByCustomType />} />
        <Route path='/open-channel-thumbnails' element={<OpenChannelThumbnails />} />
        <Route path='/open-channel-structured-data' element={<OpenChannelStructuredData />} />
        <Route path='/group-channel-mark-messages-as-read' element={<GroupChannelMarkMessagesAsRead />} />
        <Route path='/group-channel-categorize-by-custom-type' element={<GroupChannelCategorizeByCustomType />} />
        <Route path='/open-channel-report-a-message-user-channel' element={<OpenChannelReportAMessageUserChannel />} />
        <Route path='/open-channel-categorize-messages-by-custom-type' element={<OpenChannelCategorizeMessagesByCustomType />} />
        <Route path='/open-channel-metadata-and-metacounter' element={<OpenChannelMetadataAndMetacounter />} />
        <Route path='/group-channel-report-a-message-user-channel' element={<GroupChannelReportAMessageUserChannel />} />
        <Route path='/open-channel-add-extra-data-to-message' element={<OpenChannelAddExtraDataToMessage />} />
        <Route path='/group-channel-categorize-messages-by-custom-type' element={<GroupChannelCategorizeMessagesByCustomType />} />
        <Route path='/group-channel-retrieve-online-status' element={<GroupChannelRetrieveOnlineStatus />} />
        <Route path='/group-channel-register-unregister-operator' element={<GroupChannelRegisterUnregisterOperator />} />
        <Route path='/group-channel-types' element={<GroupChannelReactChannelTypes />} />
        <Route path='/group-channel-update-delete-message-by-operator' element={<GroupChannelUpdateDeleteMessageByOperator />} />
        <Route path='/group-channel-archive' element={<GroupChannelArchive />} />
        <Route path='/group-channel-mute-unmute-users' element={<GroupChannelMuteUnmuteUsers />} />
        <Route path='/group-channel-retrieve-number-of-members-havent-received-message' element={<GroupChannelRetrieveNumberOfMembersHaventReceivedMessage />} />
        <Route path='/group-channel-operators-list' element={<GroupChannelOperatorsList />} />
        <Route path='/group-channel-members-list-order' element={<GroupChannelMembersListOrder />} />
        <Route path='/open-channel-users-online-status' element={<OpenChannelUsersOnlineStatus />} />
        <Route path='/open-channel-user-profile-update' element={<OpenChannelUserProfileUpdate />} />
        <Route path='/group-channel-user-profile-update' element={<GroupChannelUserProfileUpdate />} />
        <Route path='/group-channel-retrieve-number-of-members-havent-read-message' element={<GroupChannelRetrieveNumberOfMembersHaventReadMessage />} />
        <Route path='/group-channel-user-do-not-disturb-or-snooze' element={<GroupChannelUserDoNotDisturbOrSnooze />} />
        <Route path='/open-channel-user-do-not-disturb-or-snooze' element={<OpenChannelUserDoNotDisturbOrSnooze />} />
        <Route path='/open-channel-register-unregister-operator' element={<OpenChannelRegisterUnregisterOperator />} />
        <Route path='/open-channel-mute-unmute-users' element={<OpenChannelMuteUnmuteUsers />} />
        <Route path='/open-channel-bun-unban-users' element={<OpenChannelBanUnbanUsers />} />
        <Route path='/open-channel-update-delete-message-by-operator' element={<OpenChannelUpdateDeleteMessageByOperator />} />
        <Route path='/open-channel-members-list-order' element={<OpenChannelMembersListOrder />} />
        <Route path='/group-channel-retrieve-banned-or-muted-users' element={<GroupChannelRetrieveAListOfBannedOrMutedUsers />} />
        <Route path='/group-channel-retrieve-number-of-members-havent-read-message' element={<GroupChannelRetrieveNumberOfMembersHaventReadMessage />} />
        <Route path='/group-channel-user-do-not-disturb-or-snooze' element={<GroupChannelUserDoNotDisturbOrSnooze />} />
        <Route path='/open-channel-user-do-not-disturb-or-snooze' element={<OpenChannelUserDoNotDisturbOrSnooze />} />
        <Route path='/group-channel-structured-data' element={<GroupChannelStructuredData />} />
        <Route path='/group-channel-users-online-status' element={<GroupChannelUsersOnlineStatus />} />
        <Route path='/group-channel-polls' element={<GroupChannelPolls />} />
        <Route path='/group-channel-scheduled-messages' element={<GroupChannelScheduledMessages />} />
        <Route path='/group-channel-pinned-messages' element={<GroupChannelPinnedMessages />} />
      </Routes>
    </div>
  );
}

export default App;
