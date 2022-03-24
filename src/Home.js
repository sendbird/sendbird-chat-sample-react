import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Code Samples</h1>
      <Link to="/basic-samples/open-channel">Basic Open Channel</Link>
      <Link to="/basic-samples/group-channel">Basic Group Channel</Link>

    </div>
  );
}

export default Home;
