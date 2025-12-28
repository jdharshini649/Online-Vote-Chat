import api from './authApi';

export const sendMessage = async (debateId, messageData) => {
  const response = await api.post(`/messages/${debateId}`, messageData);
  return response.data;
};

export const getMessages = async (debateId) => {
  const response = await api.get(`/messages/${debateId}`);
  return response.data;
};
