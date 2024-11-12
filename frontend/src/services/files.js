import api from './api';

export const fileService = {
  async uploadFile(formData) {
    const response = await api.post('/files/upload', formData);
    return response.data;
  },

  async getUserFiles() {
    const response = await api.get('/files');
    return response.data;
  },

  async getFileByShareLink(shareLink) {
    const response = await api.get(`/files/share/${shareLink}`);
    return response.data;
  },

  async updateFilePosition(fileId, x, y) {
    const response = await api.patch(`/files/${fileId}/position`, { x, y });
    return response.data;
  },

  async getFileStats(fileId) {
    const response = await api.get(`/stats/file/${fileId}`);
    return response.data;
  },
};