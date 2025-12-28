import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebate } from '../hooks/useDebate';
import DebateList from '../components/Debate/DebateList';
import Button from '../components/UI/Button';

const Home = () => {
  const { debates, loading, getAllDebates } = useDebate();
  const [filter, setFilter] = useState('all'); // all | live | upcoming | ended

  useEffect(() => {
    getAllDebates();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">All Debates</h1>
          <p className="text-gray-600">Join live debates or create your own</p>
        </div>
        <Link to="/create">
          <Button variant="accent" className="flex items-center space-x-2">
            <span>➕</span>
            <span>Create Debate</span>
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {['all', 'live', 'upcoming', 'ended'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg font-medium ${filter === f ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* compute filtered debates */}
      

      {/** Filter debates according to selected filter */}
      <DebateList
        debates={useMemo(() => {
          if (!debates) return [];
          if (filter === 'all') return debates;
          return debates.filter((d) => d.status === (filter === 'live' ? 'live' : filter === 'upcoming' ? 'upcoming' : 'ended'));
        }, [debates, filter])}
        loading={loading}
      />
    </div>
  );
};

export default Home;
