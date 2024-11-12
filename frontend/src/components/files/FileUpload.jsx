import { useState, useRef, useCallback } from 'react';
import { useFiles } from '../../hooks/useFiles';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { uploadFile } = useFiles();


  const handleFileSelect = useCallback((selectedFile) => {
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/'))) {
      setFile(selectedFile);
      setUploadSuccess(false);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', tags);

      await uploadFile(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setUploadSuccess(true);
      setFile(null);
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Add a small delay before refreshing
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1 second delay to show success message
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Upload File</h2>
      <form onSubmit={handleSubmit}>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mb-4 p-6 border-2 border-dashed rounded-lg text-center transition-colors duration-300 ${
            file 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label 
            htmlFor="fileInput" 
            className="cursor-pointer"
          >
            {file ? (
              <div className="flex items-center justify-between">
                <span className="truncate">{file.name}</span>
                <button 
                  type="button"
                  onClick={clearFile}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">
                  Drag and drop a file here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  (Images and videos only)
                </p>
              </div>
            )}
          </label>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={uploading}
            className="w-full p-2 border rounded"
          />
        </div>

        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            File uploaded successfully!
          </div>
          
        )}

        <button
          type="submit"
          disabled={!file || uploading}
          className={`w-full py-2 px-4 rounded transition-colors duration-300 ${
            uploading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}