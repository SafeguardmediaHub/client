import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface InitiateGeoVerificationResponse {
  success: boolean;
  message: string;
  data: {
    verificationId: string;
    status: "queued" | "processing" | "completed" | "failed";
    estimatedTime: number;
  };
}

export interface GeoVerificationResult {
  success: boolean;
  message: string;
  data: {
    _id: string;
    mediaId: {
      _id: string;
      originalFilename: string;
      fileExtension: string;
      humanFileSize?: string;
    };
    userId: string;
    claimedLocation: {
      parsed: {
        region: string;
        country: string;
        coordinates: {
          lat: number;
          lng: number;
        };
      };
      raw: string;
    };
    verification: {
      confidenceExplanation: {
        missingData: {
          gpsCoordinates: boolean;
          geocodedLocation: boolean;
        };
        summary: string;
        reasons: string[];
      };
      discrepancies: {
        addressMismatch: boolean;
      };
      status: string;
      match: boolean;
      confidence: number;
    };
    mapData: {
      centerCoordinates: {
        lat: number;
        lng: number;
      };
      zoom: number;
      markers: {
        type: string;
        coordinates: {
          lat: number;
          lng: number;
        };
        label: string;
      }[];
    };
    processingTime: number;
    apiCosts: {
      geocoding: number;
      staticMap: number;
      total: number;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserGeoVerifications {
  success: boolean;
  message: string;
  data: {
    verifications: GeoVerificationResult["data"][];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

const initiateVerification = async (
  id: string,
  claimedLocation: string,
): Promise<InitiateGeoVerificationResponse> => {
  const response = await api.post(
    `/api/geolocation/verify/${id}`,
    {
      claimedLocation,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  // console.log('initiate geo verification response', response.data);

  return response.data;
};

const fetchGeoVerificationResult = async (
  verificationId: string,
): Promise<GeoVerificationResult> => {
  const response = await api.get(`/api/geolocation/verify/${verificationId}`);

  // console.log('geo verification result response', response.data);
  return response.data;
};

const fetchUserVerifications = async (): Promise<UserGeoVerifications> => {
  const response = await api.get("/api/geolocation/verify");

  // console.log('user geo verifications response', response.data);
  return response.data;
};

const fetchGeoVerificationByMedia = async (mediaId: string) => {
  const response = await api.get(
    `/api/geolocation/media/${mediaId}/verification`,
  );
  console.log("geo verification response", response.data);
  return response.data;
};

const deleteGeoVerification = async (verificationId: string) => {
  const response = await api.delete(
    `/api/geolocation/verify/${verificationId}`,
  );
  return response.data;
};

export const useStartGeoVerification = () => {
  return useMutation({
    mutationFn: ({
      id,
      claimedLocation,
    }: {
      id: string;
      claimedLocation: string;
    }) => initiateVerification(id, claimedLocation),
  });
};

export const useGeoVerificationResult = (
  verificationId: string,
  options?: {
    pollingInterval?: number;
    enabled?: boolean;
  },
) => {
  const pollingInterval = options?.pollingInterval ?? 10000; // 10 seconds default

  return useQuery({
    queryKey: ["geoVerificationResult", verificationId],
    queryFn: () => fetchGeoVerificationResult(verificationId),
    enabled: options?.enabled ?? !!verificationId,
    refetchInterval: (query) => {
      // Access the data from the query state
      const data = query.state.data;

      if (!data?.data?.verification?.status) {
        // If we don't have status yet, keep polling
        return pollingInterval;
      }

      const status = data.data.verification.status;

      // Only poll when status is queued or processing
      if (["queued", "processing"].includes(status)) {
        return pollingInterval;
      }

      // Stop polling when completed or failed
      return false;
    },
    retry: (failureCount, error) => {
      // Don't retry on 404 - verification not found
      if ((error as any)?.response?.status === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    staleTime: 0, // Always fetch fresh data when queried
  });
};

export const useUserGeoVerifications = () => {
  return useQuery({
    queryKey: ["userGeoVerifications"],
    queryFn: fetchUserVerifications,
    staleTime: 60 * 1000, // cache for 1 minute
  });
};

export const useGeoVerificationByMedia = (mediaId: string) => {
  return useQuery({
    queryKey: ["geoVerificationByMedia", mediaId],
    queryFn: () => fetchGeoVerificationByMedia(mediaId),
    enabled: !!mediaId,
  });
};

export const useDeleteGeoVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (verificationId: string) => deleteGeoVerification(verificationId),
    onSuccess: () => {
      // Invalidate and refetch user verifications list
      queryClient.invalidateQueries({
        queryKey: ["userGeoVerifications"],
        refetchType: "active",
      });
    },
  });
};
