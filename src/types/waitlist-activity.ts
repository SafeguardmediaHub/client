export interface WaitlistUserSummary {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  signupDate: string;
  lastActive: string;
  totalMediaUploads: number;
  totalAnalyses: number;
  engagementScore: number;
}

export interface ActivitySummaryResponse {
  success: boolean;
  data: WaitlistUserSummary[];
  count: number;
}

export interface UserActivityResponse {
  user: {
    id: string;
    email: string;
    name: string;
    accountStatus: 'active' | 'inactive' | 'suspended';
    createdAt: string;
    lastLoginAt: string | null;
  };
  waitlist: {
    approvedAt: string;
    signedUpAt: string | null;
    daysSinceApproval: number;
    hasSignedUp: boolean;
  };
  activity: {
    mediaUploads: {
      total: number;
      byType: { image: number; video: number; audio: number };
      recent: Array<{
        id: string;
        filename: string;
        mimeType: string;
        uploadedAt: string;
      }>;
    };
    analyses: {
      tamperDetection: number;
      claimResearch: number;
      factCheck: number;
      geolocationVerification: number;
    };
  };
  engagementScore: number;
}
