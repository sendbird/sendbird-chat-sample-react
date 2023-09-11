import React, {useState, useEffect, useCallback} from 'react';
import {TbRefresh} from 'react-icons/tb';

function MemberList({channel}) {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const loadMoreMembers = useCallback(async () => {
    if (loading || !channel || !query || !query.hasNext) return;

    setLoading(true);
    try {
      const _members = await query.next();
      setMembers(prevMembers => [...prevMembers, ..._members]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [channel, query, loading, setMembers]);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!channel) {
        setMembers([]);
        setQuery(null);
        return;
      }

      const memberQuery = channel.createParticipantListQuery(
        params => params.limit = 20,
      );
      setQuery(memberQuery);

      if (memberQuery.hasNext) {
        try {
          setLoading(true);
          const _members = await memberQuery.next();
          setMembers(_members);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [channel, refresh, setMembers]);

  return (
    <div className="members">
      <h1>Members</h1>
      <TbRefresh onClick={handleRefresh} size="2.5em"/>
      <div className="members-list">
        {members && members.map((member) => (
          <div className="member-item" key={member.userId}>
            {member.nickname}({member.userId})
          </div>
        ))}
      </div>
      {query && query.hasNext && (
        <button onClick={loadMoreMembers}>More</button>
      )}
    </div>
  );
}

export default MemberList;
