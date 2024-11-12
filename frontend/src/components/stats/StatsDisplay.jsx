import { useEffect, useState } from 'react';
import api from '../services/api';

export default function StatsDisplay({ fileId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/stats/file/${fileId}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [fileId]);

  if (!stats) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">File Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-xl font-semibold">{stats.total_views}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">First Viewed</p>
          <p className="text-sm">
            {stats.first_view
              ? new Date(stats.first_view).toLocaleDateString()
              : 'Never'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Last Viewed</p>
          <p className="text-sm">
            {stats.last_view
              ? new Date(stats.last_view).toLocaleDateString()
              : 'Never'}
          </p>
        </div>
      </div>
    </div>
  );
}