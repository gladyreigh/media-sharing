import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function FileViewer() {
  const { shareLink } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const viewRecorded = useRef(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        // Only record view if not already recorded
        if (!viewRecorded.current) {
          const response = await api.get(`/files/share/${shareLink}`);
          setFile(response.data);
          setViewCount(response.data.viewCount);
          viewRecorded.current = true;
        }
      } catch (err) {
        console.error('Error fetching file:', err);
        setError('File not found or access denied');
      }
    };

    fetchFile();
  }, [shareLink]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{file.original_name}</h1>
          <div className="text-sm text-gray-600">
            Views: {viewCount}
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          <span>File Type: {file.mime_type}</span>
          <span className="ml-4">Size: {formatFileSize(file.size)}</span>
        </div>

        <div className="aspect-w-16 aspect-h-9">
          {file.mime_type.startsWith('image/') ? (
            <img
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${file.filename}`}
              alt={file.original_name}
              className="w-full h-auto rounded object-contain"
              loading="lazy"
            />
          ) : (
            <video
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${file.filename}`}
              controls
              className="w-full rounded"
              preload="metadata"
            />
          )}
        </div>

        {file.mime_type.startsWith('image/') && (
          <div className="mt-4 text-center">
            <a 
              href={`http://localhost:5000/uploads/${file.filename}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Open Original Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}