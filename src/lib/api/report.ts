import axios from 'axios';
import api from '../api';

export async function generateReport(payload: {
  analysisId: string;
  title: string;
}) {
  return axios.post('/api/reports', payload);
}

export const handleDownload = async (reportId: string, title: string) => {
  try {
    const response = await api.get(`/api/reports/${reportId}/download`, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' },
    });

    const blob = response.data as Blob;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download error:', err);
  }
};
