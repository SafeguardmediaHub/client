import axios from 'axios';

export async function generateReport(payload: {
  analysisId: string;
  title: string;
}) {
  return axios.post('/api/reports', payload);
}
