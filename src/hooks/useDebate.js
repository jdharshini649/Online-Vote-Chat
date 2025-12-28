import { useContext } from 'react';
import { DebateContext } from '../context/DebateContext';

export const useDebate = () => {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebate must be used within DebateProvider');
  }
  return context;
};
