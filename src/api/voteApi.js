import api from './authApi';

export const castVote = async (messageId, voteData) => {
  const response = await api.post(`/votes/${messageId}`, voteData);
  return response.data;
};

export const getMessageVotes = async (messageId) => {
  const response = await api.get(`/votes/${messageId}`);
  return response.data;
};

export const getDebateVotes = async (debateId) => {
  const response = await api.get(`/votes/debate/${debateId}`);
  return response.data;
};
