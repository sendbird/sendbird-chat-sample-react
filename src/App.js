import React from 'react';
import { Routes, Route } from 'react-router-dom';

import BasicOpenChannelSample from './samples/basic-samples/BasicOpenChannelSample';
import BasicGroupChannelSample from './samples/basic-samples/BasicGroupChannelSample';


const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path='/' element={<BasicOpenChannelSample />} />
        <Route path='/basic-samples/open-channel' element={<BasicOpenChannelSample />} />
        <Route path='/basic-samples/group-channel' element={<BasicGroupChannelSample />} />

      </Routes>
    </div>
  );
}

export default App;
