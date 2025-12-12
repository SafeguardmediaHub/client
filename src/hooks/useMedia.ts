/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

export interface Media {
  id: string;
  filename: string;
  fileSize: string;
  mimeType: string;
  uploadType: string;
  status: string;
  visibility: string;
  publicUrl: string;
  thumbnailUrl: string;
  uploadedAt: Date;
  createdAt: Date;
  metadata?: any;
  timeline?: any;
  analysis?: {
    possibleTampering?: boolean;
    strippedMetadata: boolean;
    missingFields: string[];
    reasons?: string[];
  };
  user?: {
    name: string;
  };
  extractedText?: string;
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

interface UploadKeyframeParams {
  file: File;
  metadata?: {
    isKeyframe: boolean;
    sourceVideo: string;
    frameIndex: number;
    timestamp: string;
  };
}

interface PresignedUrlResponse {
  upload: {
    uploadUrl: string;
    s3Key: string;
    correlationId: string;
  };
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

const urlUpload = async ({ url }: { url: string }) => {
  const { data } = await api.post(
    `/api/media/upload-url`,
    { url },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return data;
};

const requestPresignedUrl = async (
  filename: string,
  contentType: string,
  fileSize: number,
  uploadType: string
) => {
  const { data } = await api.post('/api/media/presigned-url', {
    filename,
    contentType,
    fileSize,
    uploadType,
  });

  return data.data as PresignedUrlResponse;
};

const uploadToS3 = async (file: File, uploadUrl: string): Promise<void> => {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  });
};

const confirmUpload = async (s3Key: string, correlationId: string) => {
  const { data } = await api.post('/api/media/confirm-upload', {
    s3Key,
    correlationId,
  });

  return data;
};

const uploadKeyframe = async ({
  file,
  metadata,
}: UploadKeyframeParams): Promise<any> => {
  // Request presigned URL
  const presignedData = await requestPresignedUrl(
    file.name,
    file.type,
    file.size,
    'general_image'
  );

  const { uploadUrl, s3Key, correlationId } = presignedData.upload;

  // Upload to S3
  await uploadToS3(file, uploadUrl);

  // Confirm upload
  const result = await confirmUpload(s3Key, correlationId);

  return result;
};

export const useGetMedia = () => {
  return useQuery({
    queryKey: ['userMedia'],
    queryFn: () => fetchUserMedia(),
    staleTime: 5000,
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
    mutationFn: ({ url }: { url: string }) => urlUpload({ url }),
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

export function useUploadKeyframe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UploadKeyframeParams) => uploadKeyframe(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] });
    },
    onError: (error) => {
      console.error('Error uploading keyframe:', error);
      throw error;
    },
  });
}
