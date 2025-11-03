import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export interface GeolocationVerificationResponse {
  success: boolean;
  message: string;
  data: {
    verificationId: string;
    status: string;
    estimatedTime: string;
  };
}

export interface Gelocation {
  id: string;
}

const initiateVerification = async (id: string, claimedLocation: string) => {
  const { data } = await api.post(
    `/api/geolocation/verify/${id}`,
    {
      claimedLocation,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('this is response', data);

  return data;
};

export const useGeolocationVerification = () => {
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
