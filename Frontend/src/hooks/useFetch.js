import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch data from the backend.
 *
 * @param {string|null} actionPath - API endpoint (e.g. '/api/auth/login') or full URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object|null} body - Request body
 * @param {object} headers - Request headers
 *
 * @returns {object} { data, loading, error, refetch }
 */
const useFetch = (
  actionPath,
  method = 'GET',
  body = null,
  headers = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // Do nothing if trigger is not set
    if (!actionPath) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const baseURL = import.meta.env.VITE_BACKEND_SERVER;

      const cleanBaseURL = baseURL?.replace(/\/$/, '');
      const cleanActionPath = actionPath.startsWith('/')
        ? actionPath
        : `/${actionPath}`;

      const url = actionPath.startsWith('http')
        ? actionPath
        : `${cleanBaseURL}${cleanActionPath}`;

      const response = await axios({
        method,
        url,
        data: body,
        headers,
      });

      setData(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  }, [actionPath, method]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;