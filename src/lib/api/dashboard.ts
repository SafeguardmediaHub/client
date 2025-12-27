import api from '@/lib/api';
import type {
  DashboardOverviewData,
  DashboardOverviewResponse,
} from '@/types/dashboard';
import { mockDashboardData } from '@/lib/data';

// Use mock data when the environment variable is set or backend is not available
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DASHBOARD === 'true' ||
  !process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

/**
 * Fetch dashboard overview data including quotas, usage, processing stats,
 * integrity breakdown, recent activity, and trends
 */
export const getDashboardOverview =
  async (): Promise<DashboardOverviewData> => {
    if (USE_MOCK_DATA) {
      // Simulate network delay for realistic testing
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockDashboardData;
    }

    const response = await api.get<DashboardOverviewResponse>(
      '/api/dashboard/overview'
    );
    return response.data.data;
  };
