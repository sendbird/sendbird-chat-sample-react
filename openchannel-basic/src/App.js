import {useState} from 'react';
import SendbirdChat from '@sendbird/chat';
import {OpenChannelModule} from "@sendbird/chat/openChannel";
import Chat from './pages/Chat';
import Login from './pages/Login';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const App = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [userId, setUserId] = useState(null)

  const sb = SendbirdChat.init({
      appId: "DE295D7F-DCE0-4D86-8F22-D551FD00ADCC",
      modules: [
        new OpenChannelModule(),
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
