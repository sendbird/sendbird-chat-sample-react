import React, { useEffect, useState } from 'react';
import './styles/styles';
import { Routes, Route } from 'react-router-dom';
import BasicGroupChannelSample from './samples/basic-samples/BasicGroupChannelSample';
import BasicOpenChannelSample from './samples/basic-samples/BasicOpenChannelSample';
import {
  connectSendbird,
  createSendbird,
  setupDefaultSendbirdSettings
} from './sendbird-actions/SendbirdActions';
import { SendBirdError, User } from 'sendbird';
import { appRoot } from './styles/styles';
import SampleListComponent from './components/SampleListComponent';

const Home = () => {
  return (
    <div>
      <h1>
        Home
      </h1>
      <p>
        Welcome to SendBird Chat SDK samples for React.
      </p>
    </div>
  );
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    createSendbird();
    connectSendbird()
      .then(() => setupDefaultSendbirdSettings())
      .then((user: User) => setUser(user))
      .catch((error: SendBirdError) => alert('getUserList error: ' + error))
      .finally(() => setLoading(false));
  }, []);

  return (
    loading
      ? null
      : <div className="container">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/basic-samples/group-channel' element={<BasicGroupChannelSample />} />
          <Route path='/basic-samples/open-channel' element={<BasicOpenChannelSample />} />
        </Routes>
      </div>
  );
}

export default App;
