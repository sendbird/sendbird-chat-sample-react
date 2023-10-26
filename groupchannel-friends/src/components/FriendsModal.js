import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';

function UserCheckbox({ user, handleDeleteFriend }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <label htmlFor={user.userId} style={{ marginLeft: '10px' }}>
        {`${user.userId} (${user.nickname})`}
      </label>
      <span onClick={() => handleDeleteFriend(user.userId)} style={{ marginLeft: '10px', cursor: 'pointer' }}>
        X
      </span>
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

function FriendsModal({ sb, isOpen, handleCloseModal }) {
  const [users, setUsers] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(0); // 추가된 상태
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState(null);
  const scrollDiv = useRef();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addFriend = async () => {
    console.log(`Added friend with userId: ${inputValue}`);
    await sb.addFriends([inputValue])
    setInputValue("");
    setFetchTrigger(prev => prev + 1);
  };

  const deleteFriend = async (userId) => {
    console.log(`Deleted friend with userId: ${userId}`);
    await sb.deleteFriend(userId);
    setFetchTrigger(prev => prev + 1);
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
        const newQuery = sb.createFriendListQuery(queryParams);
        const userList = await newQuery.next();
        setUsers(userList);
        setQuery(newQuery);
        setHasMore(newQuery.hasNext);
      };

      fetchUsers(); // useEffect 내에서 호출
    }
  }, [isOpen, sb, fetchTrigger]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Manage Friends"
      style={modalStyle}
    >
      <h2 style={{textAlign:'center'}}>Manage Friends</h2>
      <h3>Add a friend</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={'Enter userId'}
          style={{
            flex: 1,
            marginRight: '10px',
            padding: '5px',
            border: '1px solid lightgray'
          }}
        />
        <button onClick={addFriend}>Add</button>
      </div>
      <h3>Friend List</h3>
      <div style={{ maxHeight: '300px', overflow: 'auto', marginTop: '15px' }} ref={scrollDiv} onScroll={handleScroll}>
        {users.map(user => (
          <UserCheckbox
            key={user.userId}
            user={user}
            handleDeleteFriend={deleteFriend}
          />
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={handleCloseModal} style={{ padding: '10px 20px', cursor: 'pointer' }}>Close</button>
      </div>
    </Modal>
  );
}

export default FriendsModal;

