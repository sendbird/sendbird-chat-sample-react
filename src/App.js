import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import BasicOpenChannelSample from './samples/BasicOpenChannelSample';
import BasicGroupChannelSample from './samples/BasicGroupChannelSample';
import GroupChannelTypingIndicatorSample from './samples/GroupChannelTypingIndicatorSample';
import OpenChannelMessageThreading from './samples/OpenChannelMessageThreading';
import FreezeOpenChannelSample from './samples/FreezeOpenChannelSample';
import GroupChannelMessageThreading from './samples/GroupChannelMessageThreading'
import OpenChannelSendAnAdminMessage from './samples/OpenChannelSendAnAdminMessage'
import CopyMessageOpenChannelSample from './samples/CopyMessageOpenChannelSample';
import GroupChannelSendAnAdminMessage from './samples/GroupChannelSendAnAdminMessage';
import OpenChannelDisplayOGTags from './samples/OpenChannelDisplayOGTags';
import GroupChannelFreezeUnfreeze from './samples/GroupChannelFreezeUnfreeze';

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/open-channel' element={<BasicOpenChannelSample />} />
        <Route path='/group-channel' element={<BasicGroupChannelSample />} />
        <Route path='/group-channel-typing-indicator' element={<GroupChannelTypingIndicatorSample />} />
        <Route path='/freeze-open-channel' element={<FreezeOpenChannelSample />} />
        <Route path='/group-channel-message-threading' element={<GroupChannelMessageThreading />} />
        <Route path='/open-channel-send-an-admin-message' element={<OpenChannelSendAnAdminMessage />} />
        <Route path='/open-channel-message-threading' element={<OpenChannelMessageThreading />} />
        <Route path='/open-channel-copy-message' element={<CopyMessageOpenChannelSample />} />
        <Route path='/group-channel-send-an-admin-message' element={<GroupChannelSendAnAdminMessage />} />
        <Route path='/open-channel-display-og-tags' element={<OpenChannelDisplayOGTags />} />
        <Route path='/group-channel-freeze-unfreeze' element={<GroupChannelFreezeUnfreeze />} />
      </Routes>
    </div>
  );
}

export default App;
