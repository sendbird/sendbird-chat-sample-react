import React from 'react';
import { Routes, Route } from 'react-router-dom';

import BasicOpenChannelSample from './samples/basic-samples/BasicOpenChannelSample';

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path='/' element={<BasicOpenChannelSample />} />
        <Route path='/basic-samples/open-channel' element={<BasicOpenChannelSample />} />
      </Routes>
    </div>
  );
}

export default App;
