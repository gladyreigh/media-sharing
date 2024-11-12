// useFiles.js
import { useState } from 'react';
import api from '../services/api'; // Assuming you have a configured axios instance

export function useFiles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/files');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch files');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilePosition = async (fileId, x, y) => {
    try {
      await api.patch(`/files/${fileId}/position`, { x, y });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update position');
      throw err;
    }
  };

  return {
    loading,
    error,
    uploadFile,
    getUserFiles,
    updateFilePosition,
  };
}
