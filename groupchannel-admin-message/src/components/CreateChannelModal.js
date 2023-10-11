import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';

function UserCheckbox({ user, handleCheckboxChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input
        type="checkbox"
        id={user.userId}
        onChange={(e) => handleCheckboxChange(user.userId, e.target.checked)}
      />
      <label htmlFor={user.userId} style={{ marginLeft: '10px' }}>
        {`${user.userId} (${user.nickname})`}
      </label>
    </div>
  );
}

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  content: {
    color: 'lightsteelblue',
    width: '500px',
    height: 'auto',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px'
  }
};

function CreateChannelModal({ sb, isOpen, handleCloseModal, handleCreateChannel }) {
  const channelNameRef = useRef();
  const [invitedUserIds, setInvitedUserIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState(null);
  const scrollDiv = useRef();

  const handleCheckboxChange = (userId, isChecked) => {
    setInvitedUserIds((prevUserIds) => {
      if (isChecked) return [...prevUserIds, userId];
      return prevUserIds.filter(id => id !== userId);
    });
  };

  const onCreate = () => {
    const channelName = channelNameRef.current.value;
    handleCreateChannel(channelName, invitedUserIds);
    handleCloseModal();
  };

  const handleScroll = async (e) => {
    const currentDiv = e.target;
    if (!loading && hasMore && currentDiv.scrollTop + currentDiv.clientHeight >= currentDiv.scrollHeight - 5) {
      setLoading(true);
      const moreUsers = await query.next();
      setUsers(prevUsers => [...prevUsers, ...moreUsers]);
      setLoading(false);
      setHasMore(query.hasNext);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        const queryParams = { limit: 20 };
        const newQuery = sb.createApplicationUserListQuery(queryParams);
        const userList = await newQuery.next();
        setUsers(userList);
        setQuery(newQuery);
        setHasMore(newQuery.hasNext);
      };
      fetchUsers();
    } else {
      setInvitedUserIds([]);
    }
  }, [isOpen, sb]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Create Channel"
      style={modalStyle}
    >
      <h2>Create Channel</h2>
      <label htmlFor='channelName'>Channel Name</label>
      <input
        id='channelName'
        ref={channelNameRef}
        type="text"
        style={{ width: '50%', padding: '10px', fontSize: '16px', marginBottom: '15px', marginLeft: '10px' }}
      />
      <div style={{ maxHeight: '300px', overflow: 'auto', marginTop: '15px' }} ref={scrollDiv} onScroll={handleScroll}>
        {users.map(user => <UserCheckbox key={user.userId} user={user} handleCheckboxChange={handleCheckboxChange} />)}
        {loading && <div>Loading...</div>}
      </div>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onCreate} style={{ padding: '10px 20px', cursor: 'pointer' }}>Create</button>
        <button onClick={handleCloseModal} style={{ padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </Modal>
  );
}

export default CreateChannelModal;
