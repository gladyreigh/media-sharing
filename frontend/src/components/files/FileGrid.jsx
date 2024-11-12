import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FileCard from './FileCard';
import api from '../../services/api';


export default function FileGrid() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const moveFile = async (id, x, y) => {
    try {
      await api.patch(`/files/${id}/position`, { x, y });
      loadFiles();
    } catch (error) {
      console.error('Error updating file position:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onMove={moveFile}
          />
        ))}
      </div>
    </DndProvider>
  );
}