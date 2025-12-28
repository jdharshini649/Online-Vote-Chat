import React from 'react';
import DebateCard from './DebateCard';

const DebateList = ({ debates, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!debates || debates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏛️</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No debates yet</h3>
        <p className="text-gray-500">Be the first to create a debate!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {debates.map((debate) => (
        <DebateCard key={debate._id} debate={debate} />
      ))}
    </div>
  );
};

export default DebateList;
