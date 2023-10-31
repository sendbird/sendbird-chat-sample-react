import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-modal';

function MemberInviteModal({sb, isOpen, onRequestClose, onCreate, members = []}) {
  const [invitedUserIds, setInvitedUserIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState(null);
  const scrollDiv = useRef();

  const handleCheckboxChange = (userId, isChecked) => {
    setInvitedUserIds((prevUserIds) => {
      if (isChecked) {
        return [...prevUserIds, userId];
      } else {
        return prevUserIds.filter(id => id !== userId);
      }
    });
  };

  const handleInvite = () => {
    onCreate(invitedUserIds);
    onRequestClose();
  };

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        const queryParams = {limit: 20};
        const newQuery = sb.createApplicationUserListQuery(queryParams);
        const userList = await newQuery.next();
        const newUsers = userList.filter(user => !members.includes(user.userId));
        setUsers(newUsers);
        setQuery(newQuery);
        setHasMore(newQuery.hasNext);
      };

      fetchUsers();
    } else {
      setInvitedUserIds([]);
    }
  }, [isOpen, sb, members]);

  useEffect(() => {
    const currentDiv = scrollDiv.current;

    const checkScroll = async () => {
      if (!loading && hasMore && currentDiv.scrollTop + currentDiv.clientHeight >= currentDiv.scrollHeight - 5) {
        setLoading(true);
        const moreUsers = await query.next();
        const newMoreUsers = moreUsers.filter(user => !members.includes(user.userId));
        setUsers(prevUsers => [...prevUsers, ...newMoreUsers]);
        setLoading(false);
        setHasMore(query.hasNext);
      }
    };

    if (currentDiv) {
      currentDiv.addEventListener('scroll', checkScroll);
    }

    return () => {
      if (currentDiv) {
        currentDiv.removeEventListener('scroll', checkScroll);
      }
    };
  }, [loading, hasMore, query, members]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Invite Members"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'  // 배경을 약간 어둡게
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
          padding: '20px',
        }
      }}
    >
      <h2>Invite Members</h2>
      <div style={{maxHeight: '300px', overflow: 'auto', marginTop: '15px'}} ref={scrollDiv}>
        {members.map(member => (
          <div key={member.userId} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
            <input
              type="checkbox"
              id={member.userId}
              checked={true}
              disabled={true}
            />
            <label htmlFor={member.userId}
                   style={{marginLeft: '10px'}}>{`${member.userId} (${member.nickname})`}</label>
          </div>
        ))}
        {users.map(user => (
          <div key={user.userId} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
            <input
              type="checkbox"
              id={user.userId}
              onChange={(e) => handleCheckboxChange(user.userId, e.target.checked)}
            />
            <label htmlFor={user.userId} style={{marginLeft: '10px'}}>{`${user.userId} (${user.nickname})`}</label>
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
        <button onClick={handleInvite} style={{padding: '10px 20px', cursor: 'pointer'}}>Invite</button>
        <button onClick={onRequestClose} style={{padding: '10px 20px', cursor: 'pointer'}}>Cancel</button>
      </div>
    </Modal>
  );
}

export default MemberInviteModal;
