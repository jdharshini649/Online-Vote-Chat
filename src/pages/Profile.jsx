import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDebate } from '../hooks/useDebate';
import Badge from '../components/UI/Badge';

const Profile = () => {
  const { user } = useAuth();
  const { debates, getAllDebates } = useDebate();

  // Ensure debates are loaded so we can compute stats
  useEffect(() => {
    if (!debates || debates.length === 0) {
      getAllDebates().catch(() => {});
    }
  }, []);

  const stats = useMemo(() => {
    if (!user || !debates) return { joined: 0, won: 0, votes: 0 };

    const userId = String(user._id || user.id || user?.id || user?._id);

    let joined = 0;
    let won = 0;
    let votes = 0;

    debates.forEach((d) => {
      // Joined: user is present in any team members
      const isJoined = (d.teams || []).some((t) => (t.members || []).some((m) => String(m) === userId));
      if (isJoined) joined += 1;

      // Won: debate.winnerTeam matches a team the user was in
      if (d.status === 'ended' && d.winnerTeam) {
        const winnerTeam = d.winnerTeam;
        const userInWinner = (d.teams || []).some((t) => t.name === winnerTeam && (t.members || []).some((m) => String(m) === userId));
        if (userInWinner) won += 1;
      }

      // Votes: sum totalVotes for teams where the user participated
      (d.teams || []).forEach((t) => {
        if ((t.members || []).some((m) => String(m) === userId)) {
          votes += Number(t.totalVotes || 0);
        }
      });
    });

    return { joined, won, votes };
  }, [debates, user]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-4xl">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <Badge variant="success" className="mt-2">Active Debater</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.joined}
            </div>
            <div className="text-primary-700 font-medium">Debates Joined</div>
          </div>

          <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
            <div className="text-3xl font-bold text-secondary-600 mb-2">{stats.won}</div>
            <div className="text-secondary-700 font-medium">Debates Won</div>
          </div>

          <div className="bg-accent-50 rounded-lg p-6 border border-accent-200">
            <div className="text-3xl font-bold text-accent-600 mb-2">{stats.votes}</div>
            <div className="text-accent-700 font-medium">Total Votes</div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
