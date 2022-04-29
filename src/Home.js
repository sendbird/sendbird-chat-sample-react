import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Code Samples</h1>
      <ul>
        <li><Link to="/open-channel">Basic Open Channel</Link></li>
        <li><Link to="/group-channel">Basic Group Channel</Link></li>
        <li><Link to="/group-channel-typing-indicator">Group Channel with Typing Indicator</Link></li>
        <li><Link to="/freeze-open-channel">Open Channel with Freeze feature</Link></li>
        <li><Link to="/group-channel-message-threading">Group Channel Message Threading</Link></li>
      </ul>

    </div>
  );
}

export default Home;
