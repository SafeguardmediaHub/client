import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useGenerateReport(payload: {
  analysisId: string;
  title: string;
}) {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['generateReport'],
    queryFn: async () => {
      const response = await axios.post(`/api/reports/generate`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      });

      return response.data;
    },
  });
}

// export async function handleDownload(reportId: string) {
//     const res = await downloadReport(reportId);
//     const url = window.URL.createObjectURL(new Blob([res.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `report-${reportId}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   }
