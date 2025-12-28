import React, { createContext, useState } from 'react';
import {
  getAllDebates as fetchDebates,
  getDebateById as fetchDebateById,
  createDebate as createDebateApi,
  joinDebate as joinDebateApi,
  startDebate as startDebateApi,
  endDebate as endDebateApi,
} from '../api/debateApi';

export const DebateContext = createContext();

export const DebateProvider = ({ children }) => {
  const [debates, setDebates] = useState([]);
  const [currentDebate, setCurrentDebate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllDebates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDebates();
      setDebates(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch debates');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDebateById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDebateById(id);
      setCurrentDebate(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch debate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createDebate = async (debateData) => {
    try {
      setError(null);
      const data = await createDebateApi(debateData);
      setDebates((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create debate');
      throw err;
    }
  };

  const joinDebate = async (id, teamName) => {
    try {
      setError(null);
      const data = await joinDebateApi(id, teamName);
      setCurrentDebate(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join debate');
      throw err;
    }
  };

  const startDebate = async (id) => {
    try {
      setError(null);
      const data = await startDebateApi(id);
      setCurrentDebate(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start debate');
      throw err;
    }
  };

  const endDebate = async (id) => {
    try {
      setError(null);
      const result = await endDebateApi(id);
      // The /end endpoint returns a summary, not the full debate document.
      // Refetch the full debate to update UI state safely.
      try {
        const refreshed = await fetchDebateById(id);
        setCurrentDebate(refreshed);
      } catch (e) {
        // If refetch fails, keep current state but still return the result
        console.error('Failed to refresh debate after ending:', e);
      }
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end debate');
      throw err;
    }
  };

  return (
    <DebateContext.Provider
      value={{
        debates,
        currentDebate,
        loading,
        error,
        getAllDebates,
        getDebateById,
        createDebate,
        joinDebate,
        startDebate,
        endDebate,
        setCurrentDebate,
      }}
    >
      {children}
    </DebateContext.Provider>
  );
};
