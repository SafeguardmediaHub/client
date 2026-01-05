import api from '@/lib/api';

interface CreateFeedbackPayload {
  type: string;
  rating: number;
  email?: string;
  description: string;
}

interface CreateFeedbackResponse {
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
