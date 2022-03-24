import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import BasicOpenChannelSample from './samples/basic-samples/BasicOpenChannelSample';
import BasicGroupChannelSample from './samples/basic-samples/BasicGroupChannelSample';


const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/basic-samples/open-channel' element={<BasicOpenChannelSample />} />
        <Route path='/basic-samples/group-channel' element={<BasicGroupChannelSample />} />

      </Routes>
    </div>
  );
}

export default App;
