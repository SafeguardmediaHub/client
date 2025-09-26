/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/lib/api';

export interface Media {
  id: string;
  filename: string;
  mimeType: string;
  uploadType: string;
  status: string;
  visibility: string;
  publicUrl: string;
  thumbnailUrl: string;
  uploadedAt: Date;
  createdAt: Date;
  metadata: any;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UserMediaResponse {
  pagination: Pagination;
  media: Media[];
}

interface DeleteMediaResponse {
  success: boolean;
  message: string;
}

const fetchUserMedia = async (params?: {
  page?: number;
  limit?: number;
  sort?: string;
  type?: string;
  status?: string;
}): Promise<UserMediaResponse> => {
  const { data } = await api.get('/api/media', {
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data.data;
};

const deleteMedia = async (id: string): Promise<DeleteMediaResponse> => {
  const { data } = await api.delete(`/api/media/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
};

const urlUpload = async ({
  url,
  uploadType,
}: {
  url: string;
  uploadType: 'video' | 'general_image';
}) => {
  const { data } = await api.post(
    `/api/media/upload-url`,
    { url, uploadType },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return data;
};

export const useGetMedia = () => {
  return useQuery({
    queryKey: ['userMedia'],
    queryFn: () => fetchUserMedia(),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteMedia'],
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] });
      toast.success('Media deleted successfully.');
    },
    onError: (error) => {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media. Please try again.');
    },
  });
};

export function useUrlUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      url,
      uploadType,
    }: {
      url: string;
      uploadType: 'general_image' | 'video';
    }) => urlUpload({ url, uploadType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] });
      toast.success('Media uploaded successfully.');
    },
    onError: (error) => {
      console.error('Error uploading media:', error);
      toast.error('Failed to start media upload. Please try again.');
    },
  });
}
