import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Report } from '@/types/report';

type ReportsResponse = {
  reports: Report[];
  pagination: {
    pages: number;
    total: number;
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
    offset: number;
    limit: number;
  };
};

const fetchReports = async ({ page }: { page: number }) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/reports`,
    {
      params: { page },
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return data.data;
};

export const useReports = (page: number) => {
  return useQuery<ReportsResponse>({
    queryKey: ['reports', page],
    queryFn: () => fetchReports({ page }),
    placeholderData: keepPreviousData,
  });
};
