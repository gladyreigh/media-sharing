import { useState } from 'react';
import { formatFileSize } from '../../utils/helpers';

export default function FileCard({ file: initialFile }) {
  const [showShareLink, setShowShareLink] = useState(false);
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [localFile, setLocalFile] = useState(initialFile);
  const [isCountAnimating, setIsCountAnimating] = useState(false);

  const handleShare = () => {
    setShowShareLink(!showShareLink);
    setShowViewOptions(false);
  };

  const handleViewClick = () => {
    setShowViewOptions(!showViewOptions);
    setShowShareLink(false);
  };

  const copyShareLink = () => {
    const shareUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${localFile.filename}`;
    
    // Check if clipboard API is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert('Share link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          fallbackCopyTextToClipboard(shareUrl);
        });
    } else {
      // Fallback method for older browsers
      fallbackCopyTextToClipboard(shareUrl);
    }
  };
  
  // Fallback copy method
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      const successful = document.execCommand('copy');
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Fallback copy failed', err);
      alert('Unable to copy share link');
    }
  
    document.body.removeChild(textArea);
  };

  const handleDirectView = async () => {
    const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${localFile.filename}`;
  
    try {
      // Record the view
      await fetch(`${window.location.origin}/share/${localFile.share_link}/view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Fetch updated file data using the API base URL
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/files/share/${localFile.share_link}`);
      //const updatedFile = await response.json();
  
      // Open file in new tab
      window.open(fileUrl, '_blank');
  
      // Update local state with server data
      setIsCountAnimating(true);
      setLocalFile(prev => ({
        ...prev,
        view_count: (prev.view_count || 0) + 1
      }));
      
      setTimeout(() => setIsCountAnimating(false), 1000);
    } catch (error) {
      console.error('Error updating view count:', error);
      // Still open the file even if tracking fails
      window.open(fileUrl, '_blank');
    }
  };
  

  const handleTrackedView = () => {
    const shareUrl = `${window.location.origin}/share/${localFile.share_link}`;
    window.open(shareUrl, '_blank');
    
    setIsCountAnimating(true);
    setLocalFile(prev => ({
      ...prev,
      view_count: (prev.view_count || 0) + 1
    }));
    
    setTimeout(() => setIsCountAnimating(false), 1000);
  };

  const renderMediaPreview = () => {
    
    const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${localFile.filename}`;

    if (localFile.mime_type.startsWith('image/')) {
      return (
        <div className="w-full aspect-w-16 aspect-h-9">
          <img
            src={fileUrl}
            alt={localFile.original_name}
            className="object-cover w-full h-full rounded-t-lg"
          />
        </div>
      );
    }

    if (localFile.mime_type.startsWith('video/')) {
      return (
        <div className="w-full aspect-w-16 aspect-h-9">
          <video
            src={fileUrl}
            controls
            className="object-cover w-full h-full rounded-t-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return null;
  };

  const adjustedViewCount = localFile.view_count ? Math.floor(localFile.view_count / 1) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105">
      {renderMediaPreview()}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate mb-2">
          {localFile.original_name}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {localFile.tags && localFile.tags.split(',').map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{formatFileSize(localFile.size)}</span>
          <div className="relative group">
            <span className={`transition-all duration-300 ${isCountAnimating ? 'text-green-600 scale-110' : ''}`}>
              Views: {adjustedViewCount}
            </span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-10">
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded text-center">
                Views are counted when using the Tracked View option
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="space-x-2">
            <button
              onClick={handleShare}
              className="text-indigo-600 hover:text-indigo-800 text-sm px-3 py-1 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Share
            </button>
            <button
              onClick={handleViewClick}
              className="text-green-600 hover:text-green-800 text-sm px-3 py-1 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
            >
              View
            </button>
          </div>
        </div>
        
        {showShareLink && (
          <div className="mt-2 flex items-center">
            <input
              type="text"
              readOnly
              value={`${import.meta.env.VITE_API_BASE_URL}/uploads/${localFile.filename}`}
              className="flex-grow p-2 text-xs border rounded mr-2"
            />
            <button
              onClick={copyShareLink}
              className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 transition-colors"
            >
              Copy
            </button>
          </div>
        )}

        {showViewOptions && (
          <div className="mt-2 space-y-2">
            <button
              onClick={handleDirectView}
              className="w-full text-left text-sm px-3 py-2 hover:bg-gray-100 rounded-md transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Direct View
            </button>
            <button
              onClick={handleTrackedView}
              className="w-full text-left text-sm px-3 py-2 hover:bg-gray-100 rounded-md transition-colors flex items-center group"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Tracked View
              <span className="ml-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                (+1 view)
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}