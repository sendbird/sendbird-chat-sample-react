import React, {useEffect, useState } from 'react';
import './App.css';
import './styles/styles';
import { Routes, Route } from 'react-router-dom';
import BasicGroupChannelSample from './samples/basic-samples/group-channel/BasicGroupChannelSample';
import BasicOpenChannelSample from './samples/basic-samples/open-channel/BasicOpenChannelSample';
import {connectSendbird, createSendbird } from './sendbird-actions/SendbirdActions';
import {SendBirdError, User} from 'sendbird';
import { homeStyle } from './styles/styles';
import SampleListComponent from './components/SampleListComponent';

const Home = () => {
  return (
    <div className={homeStyle}>
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

  console.log('## user: ', user);

  useEffect(() => {
    createSendbird();
    connectSendbird()
      .then((user: User) => setUser(user))
      .catch((error: SendBirdError) => alert('getUserList error: ' + error))
      .finally(() => setLoading(false));
  }, []);

  return (
    loading
      ? null
      : <div className='App'>
        <SampleListComponent/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/basic-samples/group-channel' element={<BasicGroupChannelSample/>} />
            <Route path='/basic-samples/open-channel' element={<BasicOpenChannelSample/>} />
          </Routes>
      </div>
  );
}

export default App;
