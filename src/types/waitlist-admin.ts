import type { UserType } from '@/lib/api/waitlist';

export type WaitlistStatus = 'pending' | 'approved' | 'rejected' | 'invited';

export interface WaitlistEntry {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  organization?: string;
  useCase?: string;
  referralSource?: string;
  status: WaitlistStatus;
  priority: number;
  approvedAt?: string;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  invitedAt?: string;
  notes?: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    signupSource?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistQueryParams {
  page?: number;
  limit?: number;
  status?: WaitlistStatus;
  userType?: UserType;
  sortBy?: 'createdAt' | 'priority' | 'email';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WaitlistEntriesResponse {
  pagination: PaginationData;
  data: WaitlistEntry[];
}

export interface WaitlistStats {
  total: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
    invited: number;
  };
  byUserType: Record<string, number>;
  recentSignups: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface UpdateWaitlistInput {
  status?: WaitlistStatus;
  priority?: number;
  notes?: string;
  userType?: UserType;
  organization?: string;
}

export interface ApproveRejectInput {
  notes?: string;
  sendEmail?: boolean;
}
