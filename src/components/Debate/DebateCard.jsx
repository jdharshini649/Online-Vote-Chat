import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import { formatDate } from '../../utils/formatDate';

const DebateCard = ({ debate }) => {
  const navigate = useNavigate();

  const statusColors = {
    upcoming: 'gray',
    live: 'success',
    ended: 'danger',
  };

  const teamA = debate.teams?.find((t) => t.name === 'Team A');
  const teamB = debate.teams?.find((t) => t.name === 'Team B');

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-3">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">{debate.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{debate.description || 'No description'}</p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <Badge variant={statusColors[debate.status]} className="uppercase text-xs py-1 px-2">
            {debate.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-700">Team A</span>
            <Badge variant="primary">{teamA?.members?.length || 0}</Badge>
          </div>
          <div className="text-xs text-primary-600 mt-1">Votes: {teamA?.totalVotes || 0}</div>
        </div>

        <div className="bg-secondary-50 rounded-lg p-3 border border-secondary-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary-700">Team B</span>
            <Badge variant="secondary">{teamB?.members?.length || 0}</Badge>
          </div>
          <div className="text-xs text-secondary-600 mt-1">Votes: {teamB?.totalVotes || 0}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto mb-4">
        <span>Duration: {debate.duration} min</span>
        {debate.startTime && <span>Started: {formatDate(debate.startTime)}</span>}
      </div>

      {debate.winnerTeam && (
        <div className="bg-accent-100 border border-accent-300 rounded-lg p-3 mb-4">
          <span className="text-accent-800 font-semibold">🏆 Winner: {debate.winnerTeam}</span>
        </div>
      )}

      <Button onClick={() => navigate(`/debate/${debate._id}`)} className="w-full mt-2">
        {debate.status === 'upcoming' ? 'Join Debate' : 'View Debate'}
      </Button>
    </article>
  );
};

export default DebateCard;
