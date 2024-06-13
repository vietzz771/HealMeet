import { useEffect, useState } from 'react';
import * as instance from '../utils/http';
import { getToken } from '../config';

const useInstanceData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = getToken();
      try {
        const res = await instance.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.data;
        setData(result);
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        setLoading(false);
        setError(errorMessage);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useInstanceData;
