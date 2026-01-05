import api from '@/lib/api';

interface CreateFeedbackPayload {
  type: string;
  rating: number;
  email?: string;
  description: string;
}

interface CreateFeedbackResponse {
  success: boolean;
  message: string;
  feedback: {
    id: string;
    type: string;
    rating: number;
    email?: string;
    description: string;
    status: string;
    createdAt: string;
  };
}

export const createFeedback = async (
  payload: CreateFeedbackPayload
): Promise<CreateFeedbackResponse> => {
  const response = await api.post('/api/feedback', payload);
  return response.data;
};

// New types and functions for admin feedback
export interface Feedback {
  id: string;
  _id: string;
  userId: string;
  userName: string;
  email: string;
  type: string;
  rating: number;
  message: string;
  description: string;
  status: string;
  priority: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AllFeedbackParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  type?: string;
}

export interface AllFeedbackResponse {
  success: boolean;
  message: string;
  data: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: Feedback[];
  };
  timestamp: string;
}

export interface FeedbackStats {
    total: number;
    pending: number;
    inProgress: number;
    averageRating: number;
}

export interface UpdateFeedbackPayload {
  type?: string;
  rating?: number;
  email?: string;
  description?: string;
  status?: string;
}

export interface UpdateFeedbackResponse {
    success: boolean;
    message: string;
    data: Feedback;
}

export const getAllFeedback = async (params?: AllFeedbackParams): Promise<AllFeedbackResponse> => {
  const response = await api.get('/api/feedback', { params });
  return response.data;
}

export const getFeedbackStats = async (): Promise<{data: FeedbackStats}> => {
  const response = await api.get('/api/feedback/stats');
  return response.data;
}

export const getFeedback = async (id: string): Promise<{data: Feedback}> => {
  const response = await api.get(`/api/feedback/${id}`);
  return response.data;
}

export const updateFeedback = async (id: string, payload: UpdateFeedbackPayload): Promise<UpdateFeedbackResponse> => {
  const response = await api.put(`/api/feedback/${id}`, payload);
  return response.data;
}

export const deleteFeedback = async (id: string): Promise<{success: boolean, message: string}> => {
  const response = await api.delete(`/api/feedback/${id}`);
  return response.data;
}
