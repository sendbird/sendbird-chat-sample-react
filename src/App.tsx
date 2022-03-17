import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SendBirdError, User } from 'sendbird';

import BasicGroupChannelSample from './samples/basic-samples/BasicGroupChannelSample';
import BasicOpenChannelSample from './samples/basic-samples/BasicOpenChannelSample';
import './styles/styles';

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path='/' element={<BasicOpenChannelSample />} />
        <Route path='/basic-samples/group-channel' element={<BasicGroupChannelSample />} />
        <Route path='/basic-samples/open-channel' element={<BasicOpenChannelSample />} />
      </Routes>
    </div>
  );
}

export default App;
