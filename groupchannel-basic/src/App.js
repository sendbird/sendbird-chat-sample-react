import {useState} from 'react';
import SendbirdChat from '@sendbird/chat';
import {GroupChannelModule} from '@sendbird/chat/groupChannel';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const App = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [userId, setUserId] = useState(null)

  const sb = SendbirdChat.init({
      appId: "43A36A3F-6248-4CDE-84F8-DC91436DECF8",
      modules: [
        new GroupChannelModule(),
      ],
    }
  );

  if (isLogin) {
    return <Chat sb={sb} userId={userId}/>;
  } else {
    return <Login sb={sb} setUserId={setUserId} setIsLogin={setIsLogin}/>;
  }
}

export default App;
