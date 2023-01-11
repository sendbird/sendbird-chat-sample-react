import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div>
        <h1>Basic Code Samples</h1>
        <ul>
          <li><Link to="/open-channel">Basic Open Channel</Link></li>
          <li><Link to="/group-channel">Basic Group Channel</Link></li>
        </ul>
      </div>
      <div>
        <h1>Open Channel Code Samples</h1>
        <ul>
          <li><Link to="/open-channel-send-an-admin-message">Open Channel Send an Admin message</Link></li>
          <li><Link to="/open-channel-message-threading">Open Channel Message Threading</Link></li>
          <li><Link to="/open-channel-copy-message">Open Channel Copy Message</Link></li>
          <li><Link to="/open-channel-send-and-receive-various-types-of-files">Open Channel Send and Receive Various Types of Files</Link></li>
          <li><Link to="/open-channel-display-og-tags">Open Channel Display OG-tags</Link></li>
          <li><Link to="/open-channel-categorize-by-custom-type">Open Channel with Categorize by custom type feature</Link></li>
          <li><Link to="/open-channel-thumbnails">Open Channel with auto generated Thumbnails feature</Link></li>
          <li><Link to="/freeze-open-channel">Open Channel with Freeze feature</Link></li>
          <li><Link to="/open-channel-report-a-message-user-channel">Open Channel Report a message,user or channel</Link></li>
          <li><Link to="/open-channel-categorize-messages-by-custom-type">Open Channel with Categorize messages by custom type feature</Link></li>
          <li><Link to="/open-channel-metadata-and-metacounter">Open Channel Metadata and Metacounter</Link></li>
          <li><Link to="/open-channel-add-extra-data-to-message">Open Channel Add extra data to message</Link></li>
          <li><Link to="/open-channel-users-online-status">Open Channel Users online status</Link></li>
          <li><Link to="/open-channel-user-profile-update">Open Channel User Profile update</Link></li>
          <li><Link to="/open-channel-structured-data">Open Channel Structured Data</Link></li>
          <li><Link to="/open-channel-user-do-not-disturb-or-snooze">Open Channel User do not disturb or snooze</Link></li>
          <li><Link to="/open-channel-register-unregister-operator">Open Channel Register and Unregister operator</Link></li>
          <li><Link to="/open-channel-mute-unmute-users">Open Channel Mute and Unmute users</Link></li>
          <li><Link to="/open-channel-bun-unban-users">Open Channel Ban and Unban users</Link></li>
          <li><Link to="/open-channel-update-delete-message-by-operator">Open Channel Update and delete message by operator</Link></li>
          <li><Link to="/open-channel-members-list-order">Open Channel Members list order</Link></li>
        </ul>
      </div>
      <div>
        <h1>Group Channel Code Samples</h1>
        <ul>
          <li><Link to="/group-channel-typing-indicator">Group Channel with Typing Indicator</Link></li>
          <li><Link to="/group-channel-message-threading">Group Channel Message Threading</Link></li>
          <li><Link to="/group-channel-send-an-admin-message">Group Channel Send An Admin Message</Link></li>
          <li><Link to="/group-channel-freeze-unfreeze">Group Channel with Freeze feature</Link></li>
          <li><Link to="/group-channel-display-og-tags">Group Channel Display OG-tags</Link></li>
          <li><Link to="/group-channel-react-to-a-message">Group Channel React to a message</Link></li>
          <li><Link to="/group-channel-categorize-by-custom-type">Group Channel with Categorize by custom type feature</Link></li>
          <li><Link to="/group-channel-report-a-message-user-channel">Group Channel Report a message,user, or channel</Link></li>
          <li><Link to="/group-channel-mark-messages-as-read">Group Channel mark messages as read</Link></li>
          <li><Link to="/group-channel-retrieve-online-status">Group Channel retrieve online status</Link></li>
          <li><Link to="/group-channel-local-caching">Group Channel local caching</Link></li>
          <li><Link to="/group-channel-categorize-messages-by-custom-type">Group Channel with Categorize messages by custom type feature</Link></li>
          <li><Link to="/group-channel-register-unregister-operator">Group Channel Register and Unregister operator</Link></li>
          <li><Link to="/group-channel-types">Group Channel Types</Link></li>
          <li><Link to="/group-channel-update-delete-message-by-operator">Group Channel Update and delete message by operator</Link></li>
          <li><Link to="/group-channel-archive">Group Channel Archive</Link></li>
          <li><Link to="/group-channel-mute-unmute-users">Group Channel Mute Unmute users</Link></li>
          <li><Link to="/group-channel-bun-unban-users">Group Channel Ban and Unban users</Link></li>
          <li><Link to="/group-channel-retrieve-number-of-members-havent-received-message">Group Channel Retrieve number of members haven't received message</Link></li>
          <li><Link to="/group-channel-operators-list">Group Channel Operators List</Link></li>
          <li><Link to="/group-channel-members-list-order">Group Channel Members list order</Link></li>
          <li><Link to="/group-channel-retrieve-banned-or-muted-users">Group Channel Retrieve banned or muted users</Link></li>
          <li><Link to="/group-channel-users-online-status">Group Channel Users online status</Link></li>
          <li><Link to="/group-channel-user-profile-update">Group Channel User Profile update</Link></li>
          <li><Link to="/group-channel-retrieve-number-of-members-havent-read-message">Group Channel Retrieve number of members haven't read message</Link></li>
          <li><Link to="/group-channel-user-do-not-disturb-or-snooze">Group Channel User do not disturb or snooze</Link></li>
          <li><Link to="/group-channel-structured-data">Group Channel Structured Data</Link></li>
          <li><Link to="/group-channel-polls">Group Channel Polls</Link></li>
          <li><Link to="/group-channel-scheduled-messages">Group Channel Scheduled Messages</Link></li>
          <li><Link to="/group-channel-pinned-messages">Group Channel Pinned Messages</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
