import React, { useState } from 'react';

const VoteButton = ({ votes, onVote, disabled }) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (disabled || isVoting) return;
    setIsVoting(true);
    try {
      await onVote();
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={disabled || isVoting}
      aria-label="Vote"
      className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-white border border-gray-200 hover:bg-primary-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-lg">👍</span>
      <span className="font-semibold text-gray-700">{votes || 0}</span>
    </button>
  );
};

export default VoteButton;
