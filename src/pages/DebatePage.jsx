import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebate } from '../hooks/useDebate';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import DebateRoom from '../components/Debate/DebateRoom';
import Timer from '../components/UI/Timer';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { formatDate } from '../utils/formatDate';
import { getTeamColor } from '../utils/colorScheme';
import {toast} from 'react-toastify'

const DebatePage = () => {
  const { id } = useParams();
  const { currentDebate, getDebateById, joinDebate, startDebate } = useDebate();
  const { socket, joinDebateRoom, startDebateTimer } = useSocket();
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  console.log(currentDebate);
  
  useEffect(() => {
    loadDebate();
  }, [id]);


  useEffect(() => {
    if (!socket || !currentDebate) return;

    socket.on('user_joined', ({ username, teamName }) => {
      console.log(`${username} joined ${teamName}`);
    });

    // When server broadcasts an updated debate document, refresh local state
    socket.on('debate_updated', (updatedDebate) => {
      try {
        if (updatedDebate?._id === currentDebate._id) {
          getDebateById(currentDebate._id);
        }
      } catch (e) {
        console.error('Failed to refresh debate after update:', e);
      }
    });

    // Timer start now includes endTime so clients can sync across reloads
    socket.on('timer_start', ({ endTime }) => {
      setTimerActive(true);
      // refresh debate to get server side start/end times
      loadDebate();
    });

    socket.on('debate_ended', ({ winnerTeam }) => {
      setTimerActive(false);
      toast.success(`Debate ended! Winner: ${winnerTeam || 'Tie'}`);
      loadDebate();
    });

    return () => {
      socket.off('user_joined');
      socket.off('debate_updated');
      socket.off('timer_start');
      socket.off('debate_ended');
    };
  }, [socket, currentDebate]);

  useEffect(() => {
    if (currentDebate && user) {
      const teamA = currentDebate.teams?.find((t) => t.name === 'Team A');
      const teamB = currentDebate.teams?.find((t) => t.name === 'Team B');
      
      const isInA = teamA?.members?.some((m) => String(m) === String(user._id));
      const isInB = teamB?.members?.some((m) => String(m) === String(user._id));
      if (isInA) {
        setUserTeam('Team A');
      } else if (isInB) {
        setUserTeam('Team B');
      } else {
        setUserTeam(null);
      }
    }
  }, [currentDebate, user]);

  // Keep timer UI in sync with debate status
  useEffect(() => {
    if (!currentDebate) return;
    if (currentDebate.status === 'live') setTimerActive(true);
    if (currentDebate.status === 'ended') setTimerActive(false);
  }, [currentDebate?.status]);

  // Auto-join socket room when we know user's team
  useEffect(() => {
    if (!socket || !currentDebate || !user || !userTeam) return;
    joinDebateRoom(currentDebate._id, user.username, userTeam);
  }, [socket, currentDebate?._id, user?._id, userTeam]);

  const loadDebate = async () => {
    try {
      await getDebateById(id);
    } catch (err) {
      console.error('Failed to load debate:', err);
    }
  };

  const handleJoinTeam = async () => {
    if (!selectedTeam) return;
    try {
      await joinDebate(id, selectedTeam);
      setUserTeam(selectedTeam);
      joinDebateRoom(id, user.username, selectedTeam);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join team');
    }
  };

  const handleStartDebate = async () => {
    try {
      await startDebate(id);
      startDebateTimer(id);
      setTimerActive(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start debate');
    }
  };

  // When the timer ends, the server will mark the debate ended and broadcast
  // 'debate_ended'/'debate_updated' events. We refresh local state here.
  const handleTimerEnd = async () => {
    try {
      setTimerActive(false);
      await loadDebate();
    } catch (err) {
      console.error('Failed to refresh debate after timer end:', err);
    }
  };

  if (!currentDebate) {
    return <div className="container mx-auto px-4 py-8">Loading debate...</div>;
  }

  const teamA = currentDebate.teams?.find((t) => t.name === 'Team A');
  const teamB = currentDebate.teams?.find((t) => t.name === 'Team B');
  const teamAColor = getTeamColor('Team A');
  const teamBColor = getTeamColor('Team B');
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{currentDebate.title}</h1>
            <p className="text-gray-600">{currentDebate.description}</p>
          </div>
          <Badge variant={currentDebate?.status === 'live' ? 'success' : 'gray'}>
            {(currentDebate?.status || 'upcoming').toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`${teamAColor.bg} rounded-lg p-6 border ${teamAColor.border}`}>
            <h3 className={`text-2xl font-bold ${teamAColor.text} mb-4`}>Team A {" "} ({currentDebate?.teams[0]?.tName &&  <span>{currentDebate?.teams[0]?.tName}</span>})</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Members:</span>
              <Badge variant="primary">{teamA?.members?.length || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Votes:</span>
              <span className="text-2xl font-bold text-primary-600">{teamA?.totalVotes || 0}</span>
            </div>
          </div>

          <div className={`${teamBColor.bg} rounded-lg p-6 border ${teamBColor.border}`}>
            <h3 className={`text-2xl font-bold ${teamBColor.text} mb-4`}>Team B {" "}({currentDebate?.teams[1]?.tName &&  <span>{currentDebate?.teams[1]?.tName}</span>})</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Members:</span>
              <Badge variant="secondary">{teamB?.members?.length || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Votes:</span>
              <span className="text-2xl font-bold text-secondary-600">{teamB?.totalVotes || 0}</span>
            </div>
          </div>
        </div>

        {currentDebate.status !== 'ended' && !userTeam && (
          <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-accent-800 mb-4">Join a Team</h3>
            <div className="flex space-x-4">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a team...</option>
                <option value="Team A">Team A {" "}({currentDebate?.teams[0]?.tName &&  <span>{currentDebate?.teams[0]?.tName}</span>})</option>
                <option value="Team B">Team B{" "}({currentDebate?.teams[1]?.tName &&  <span>{currentDebate?.teams[1]?.tName}</span>})  </option>
              </select>
              <Button onClick={handleJoinTeam} disabled={!selectedTeam}>
                Join Team
              </Button>
            </div>
          </div>
        )}

        {userTeam && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <span className="text-green-800 font-semibold">
              ✓ You are in {userTeam}
            </span>
          </div>
        )}

        {currentDebate.status === 'upcoming' && userTeam && (
          <Button onClick={handleStartDebate} variant="success" className="w-full mb-6">
            Start Debate
          </Button>
        )}

        {currentDebate.status === 'live' && (
          <>
            <Timer
              duration={currentDebate.duration}
              endTime={currentDebate.endTime}
              onEnd={handleTimerEnd}
              isActive={timerActive}
            />
            {/* Manual early ending removed: debates end only by timer */}
          </>
        )}

        {currentDebate.winnerTeam && (
          <div className="bg-gradient-to-r from-accent-100 to-accent-200 border-2 border-accent-400 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-2xl font-bold text-accent-800">
              Winner: {currentDebate.winnerTeam}
            </h3>
          </div>
        )}
      </div>

      <DebateRoom debate={currentDebate} userTeam={userTeam} />
    </div>
  );
};

export default DebatePage;
