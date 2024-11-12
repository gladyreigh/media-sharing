export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  export const generateShareableLink = (shareLink) => {
    return `${window.location.origin}/share/${shareLink}`;
  };
  
  export const isValidFileType = (file) => {
    const validTypes = ['image/', 'video/'];
    return validTypes.some(type => file.type.startsWith(type));
  };