import axios from 'axios';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export enum UserType {
  CONTENT_CREATOR = 'Content Creator/Influencer',
  JOURNALIST = 'Journalist/Reporter',
  EDUCATOR = 'Educator/Teacher',
  RESEARCHER = 'Researcher/Academic',
  FREELANCER = 'Freelancer/Consultant',
  STUDENT = 'Student',
  INDIVIDUAL = 'Individual User',
  OTHER = 'Other',
}

export interface WaitlistData {
  email: string;
  firstName: string;
  lastName: string;
  userType?: UserType;
  organization?: string;
  useCase?: string;
  referralSource?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    status: string;
  };
}

export const joinWaitlist = async (
  data: WaitlistData,
): Promise<WaitlistResponse> => {
  try {
    const response = await axios.post<WaitlistResponse>(
      `${BACKEND_BASE_URL}/api/waitlist`,
      data,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to join waitlist');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Admin API methods
import api from '@/lib/api';
import type {
  ApproveRejectInput,
  UpdateWaitlistInput,
  WaitlistEntriesResponse,
  WaitlistEntry,
  WaitlistQueryParams,
  WaitlistStats,
} from '@/types/waitlist-admin';

export const waitlistAdminApi = {
  // Get all entries with pagination and filters
  async getAllEntries(
    params?: WaitlistQueryParams,
  ): Promise<WaitlistEntriesResponse> {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: WaitlistEntriesResponse;
    }>('/api/waitlist', { params });
    return response.data.data;
  },

  // Get statistics
  async getStats(): Promise<WaitlistStats> {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: WaitlistStats;
    }>('/api/waitlist/stats');
    return response.data.data;
  },

  // Get single entry
  async getEntry(id: string): Promise<WaitlistEntry> {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: WaitlistEntry;
    }>(`/api/waitlist/${id}`);
    return response.data.data;
  },

  // Update entry
  async updateEntry(
    id: string,
    data: UpdateWaitlistInput,
  ): Promise<WaitlistEntry> {
    const response = await api.patch<{
      success: boolean;
      message: string;
      data: WaitlistEntry;
    }>(`/api/waitlist/${id}`, data);
    return response.data.data;
  },

  // Approve entry
  async approveEntry(
    id: string,
    input?: ApproveRejectInput,
  ): Promise<WaitlistEntry> {
    const response = await api.patch<{
      success: boolean;
      message: string;
      data: WaitlistEntry;
    }>(`/api/waitlist/${id}/approve`, input || {});
    return response.data.data;
  },

  // Reject entry
  async rejectEntry(
    id: string,
    input?: ApproveRejectInput,
  ): Promise<WaitlistEntry> {
    const response = await api.patch<{
      success: boolean;
      message: string;
      data: WaitlistEntry;
    }>(`/api/waitlist/${id}/reject`, input || {});
    return response.data.data;
  },

  // Delete entry
  async deleteEntry(id: string): Promise<void> {
    await api.delete(`/api/waitlist/${id}`);
  },
};
