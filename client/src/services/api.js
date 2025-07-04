import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class API {
  static async uploadPDF(file) {
    const formData = new FormData();
    formData.append('pdf', file);
    
    return axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async getPDFInfo(fileId) {
    return axios.get(`${API_BASE_URL}/pdf/${fileId}/info`);
  }

  static async addText(fileId, textData) {
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/add-text`, textData);
  }

  static async addImage(fileId, imageFile, position) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('x', position.x);
    formData.append('y', position.y);
    formData.append('pageIndex', position.pageIndex);
    formData.append('width', position.width || 100);
    formData.append('height', position.height || 100);
    
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/add-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async addShape(fileId, shapeData) {
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/add-shape`, shapeData);
  }

  static async rotatePage(fileId, pageIndex, rotation) {
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/rotate`, {
      pageIndex,
      rotation
    });
  }

  static async deletePages(fileId, pageIndices) {
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/delete-pages`, {
      pageIndices
    });
  }

  static async splitPDF(fileId, startPage, endPage) {
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/split`, {
      startPage,
      endPage
    });
  }

  static async mergePDFs(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('pdfs', file);
    });
    
    return axios.post(`${API_BASE_URL}/pdf/merge`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async addWatermark(fileId, watermarkData) {
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/watermark`, watermarkData);
  }

  static async passwordProtect(fileId, password) {
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/password`, { password });
  }

  static async compressPDF(fileId) {
    return axios.post(`${API_BASE_URL}/pdf/${fileId}/compress`);
  }

  static async downloadPDF(fileId, fileName) {
    const response = await axios.get(`${API_BASE_URL}/pdf/${fileId}/download`, {
      responseType: 'blob',
      params: { name: fileName }
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  static async getPDFPreview(fileId) {
    return axios.get(`${API_BASE_URL}/pdf/${fileId}/preview`);
  }
}

export default API;