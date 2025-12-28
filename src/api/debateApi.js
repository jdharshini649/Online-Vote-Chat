import api from './authApi';

export const createDebate = async (debateData) => {
  const response = await api.post('/debates/create', debateData);
  return response.data;
};

export const getAllDebates = async () => {
  const response = await api.get('/debates');
  return response.data;
};

export const getDebateById = async (id) => {
  const response = await api.get(`/debates/${id}`);
  return response.data;
};

export const joinDebate = async (id, teamName) => {
  const response = await api.post(`/debates/${id}/join`, { teamName });
  return response.data;
};

export const startDebate = async (id) => {
  const response = await api.patch(`/debates/${id}/start`);
  return response.data;
};

export const endDebate = async (id) => {
  const response = await api.patch(`/debates/${id}/end`);
  return response.data;
};
