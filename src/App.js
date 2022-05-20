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
import OpenChannelCategorizeMessagesByCustomType from './samples/OpenChannelCategorizeMessagesByCustomType';
import OpenChannelMetadataAndMetacounter from './samples/OpenChannelMetadataAndMetacounter';
import OpenChannelReportAMessageUserChannel from './samples/OpenChannelReportAMessageUserChannel'

// Group channel samples
import GroupChannelTypingIndicatorSample from './samples/GroupChannelTypingIndicatorSample';
import GroupChannelMessageThreading from './samples/GroupChannelMessageThreading'
import GroupChannelSendAnAdminMessage from './samples/GroupChannelSendAnAdminMessage';
import GroupChannelFreezeUnfreeze from './samples/GroupChannelFreezeUnfreeze';
import GroupChannelDisplayOGTags from './samples/GroupChannelDisplayOGTags';
import GroupChannelMarkMessagesAsRead from './samples/GroupChannelMarkMessagesAsRead';
import GroupChannelReactToAMessage from './samples/GroupChannelReactToAMessage';
import GroupChannelCategorizeByCustomType from './samples/GroupChannelCategorizeByCustomType';
import OpenChannelCategorizeMessagesByCustomType  from './samples/OpenChannelCategorizeMessagesByCustomType';
import GroupChannelReportAMessageUserChannel from './samples/GroupChannelReportAMessageUserChannel'

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
        <Route path='/group-channel-mark-messages-as-read' element={<GroupChannelMarkMessagesAsRead />} />
        <Route path='/group-channel-categorize-by-custom-type' element={<GroupChannelCategorizeByCustomType />} />
        <Route path='/open-channel-report-a-message-user-channel' element={<OpenChannelReportAMessageUserChannel />} />
        <Route path='/open-channel-categorize-messages-by-custom-type' element={<OpenChannelCategorizeMessagesByCustomType />} />
        <Route path='/open-channel-metadata-and-metacounter' element={<OpenChannelMetadataAndMetacounter />} />
        <Route path='/group-channel-report-a-message-user-channel' element={<GroupChannelReportAMessageUserChannel />} />
      </Routes>
    </div>
  );
}

export default App;
