import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Code Samples</h1>
      <ul>
        <li><Link to="/open-channel">Basic Open Channel</Link></li>
        <li><Link to="/group-channel">Basic Group Channel</Link></li>
        <li><Link to="/group-channel-typing-indicator">Typing Indicator</Link></li>
      </ul>

    </div>
  );
}

export default Home;
