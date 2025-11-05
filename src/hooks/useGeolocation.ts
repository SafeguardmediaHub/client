import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export interface InitiateGeoVerificationResponse {
  success: boolean;
  message: string;
  data: {
    verificationId: string;
    status: string;
    estimatedTime: number;
  };
}

export interface GeoVerificationResult {
  success: boolean;
  message: string;
  data: {
    id: string;
    mediaId: {
      id: string;
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

export interface Gelocation {
  id: string;
}

const initiateVerification = async (
  id: string,
  claimedLocation: string
): Promise<InitiateGeoVerificationResponse> => {
  const response = await api.post(
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

  console.log('initiate geo verification response', response.data);

  return response.data;
};

const geoVerificationResult = async (
  id: string
): Promise<GeoVerificationResult> => {
  const response = await api.get(`/api/geolocation/verify/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('geo verification result response', response.data);

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

export const useGeoVerificationResult = () => {
  return useMutation({
    mutationFn: geoVerificationResult,
  });
};

// {
//   "success": true,
//   "message": "Verification retrieved successfully",
//   "data": {
//       "_id": "690a9fbfd5a504d0ca4d2982",
//       "mediaId": {
//           "_id": "6904de787563783bc2eabf51",
//           "originalFilename": "shooting-1024x683.jpg",
//           "id": "6904de787563783bc2eabf51",
//           "fileExtension": "jpg",
//           "humanFileSize": "NaN undefined"
//       },
//       "userId": "68cd61fde04d94bd94cfb5f5",
//       "claimedLocation": {
//           "parsed": {
//               "region": "Pennsylvania",
//               "country": "United States of America",
//               "coordinates": {
//                   "lat": 40.9699889,
//                   "lng": -77.7278831
//               }
//           },
//           "raw": "Pennsylvania, USA"
//       },
//       "verification": {
//           "confidenceExplanation": {
//               "missingData": {
//                   "gpsCoordinates": true,
//                   "geocodedLocation": false
//               },
//               "summary": "Low confidence (25%) due to missing data required for location verification",
//               "reasons": [
//                   "No GPS coordinates extracted from media metadata",
//                   "Successfully geocoded claimed location"
//               ]
//           },
//           "discrepancies": {
//               "addressMismatch": false
//           },
//           "status": "partial",
//           "match": false,
//           "confidence": 25
//       },
//       "mapData": {
//           "centerCoordinates": {
//               "lat": 40.9699889,
//               "lng": -77.7278831
//           },
//           "zoom": 12,
//           "markers": [
//               {
//                   "type": "claimed",
//                   "coordinates": {
//                       "lat": 40.9699889,
//                       "lng": -77.7278831
//                   },
//                   "label": "Claimed: Pennsylvania, USA"
//               }
//           ]
//       },
//       "processingTime": 13209,
//       "apiCosts": {
//           "geocoding": 0.001,
//           "staticMap": 0,
//           "total": 0.001
//       },
//       "createdAt": "2025-11-05T00:52:15.082Z",
//       "updatedAt": "2025-11-05T00:52:28.297Z",
//       "__v": 0,
//       "extractionFailure": {
//           "reason": "no_gps_metadata",
//           "details": "No GPS coordinates found in media metadata. The file does not contain embedded location information.",
//           "checkedSources": [
//               "EXIF GPS data",
//               "Video metadata geolocation",
//               "Legacy GPS metadata format",
//               "S3 file-based extraction"
//           ]
//       },
//       "geocoding": {
//           "forwardGeocode": {
//               "coordinates": {
//                   "lat": 40.9699889,
//                   "lng": -77.7278831
//               },
//               "confidence": 80,
//               "provider": "nominatim"
//           }
//       },
//       "insights": [
//           "Low confidence match"
//       ]
//   },
//   "timestamp": "2025-11-05T00:53:23.028Z"
// }
