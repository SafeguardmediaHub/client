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
