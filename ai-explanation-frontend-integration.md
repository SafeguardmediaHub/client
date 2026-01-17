# AI Explanation Layer - Frontend Integration Guide

This guide details how to integrate the AI Explanation Layer into the UI.
**Update:** The backend now handles data retrieval internally. You only need to send the `analysisId` and `featureType`.

## 1. API Service Implementation

Create or update `src/services/api/explanationService.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export type AnalysisFeatureType = 
  | 'timeline_verification'
  | 'geolocation_verification'
  | 'metadata_extraction'
  | 'c2pa_verification'
  | 'deepfake_detection';

export interface ExplanationRequest {
  analysisId: string;
  featureType: AnalysisFeatureType;
  options?: {
    tone?: 'professional' | 'casual' | 'technical';
    audience?: 'general' | 'expert' | 'legal';
    length?: 'brief' | 'standard' | 'detailed';
  };
}

export interface ExplanationResponse {
  success: true;
  message: string;
  jobId: string;
  statusUrl: string;
}

export const explanationService = {
  /**
   * Request a new explanation generation
   */
  async generateExplanation(payload: ExplanationRequest): Promise<ExplanationResponse> {
    const response = await axios.post(`${API_BASE_URL}/explanations/generate`, payload);
    return response.data;
  },

  /**
   * Poll for explanation status
   */
  async getExplanationStatus(jobId: string) {
    const response = await axios.get(`${API_BASE_URL}/explanations/status/${jobId}`);
    return response.data;
  },

  /**
   * Get cached explanation directly (if available)
   */
  async getExplanation(analysisId: string) {
    const response = await axios.get(`${API_BASE_URL}/explanations/${analysisId}`);
    return response.data;
  }
};
```

## 2. React Hook (`useExplanation`)

Create `src/hooks/useExplanation.ts` to manage the polling lifecycle:

```typescript
import { useState, useCallback, useRef } from 'react';
import { explanationService, ExplanationRequest } from '../services/api/explanationService';

const POLL_INTERVAL = 2000; // 2 seconds

export function useExplanation() {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollActive = useRef(false);

  const requestExplanation = useCallback(async (req: ExplanationRequest) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // 1. Trigger Generation
      const { jobId, statusUrl } = await explanationService.generateExplanation(req);
      
      // 2. Start Polling
      pollActive.current = true;
      pollJobStatus(jobId);
      
    } catch (err: any) {
      // Handle "Budget Exceeded" specifically if needed
      if (err.response?.status === 429) {
        setError('Daily AI budget exceeded. Please try again tomorrow.');
      } else {
        setError(err.message || 'Failed to generate explanation');
      }
      setIsLoading(false);
    }
  }, []);

  const pollJobStatus = async (jobId: string) => {
    if (!pollActive.current) return;

    try {
      const status = await explanationService.getExplanationStatus(jobId);

      if (status.state === 'completed') {
        setData(status.output);
        setIsLoading(false);
        pollActive.current = false;
      } else if (status.state === 'failed') {
        setError(status.error || 'Explanation generation failed');
        setIsLoading(false);
        pollActive.current = false;
      } else {
        // Continue polling
        setTimeout(() => pollJobStatus(jobId), POLL_INTERVAL);
      }
    } catch (err) {
      // If polling fails transiently, keep trying (or limit retries)
      setTimeout(() => pollJobStatus(jobId), POLL_INTERVAL);
    }
  };

  return {
    explanation: data,
    isLoading,
    error,
    requestExplanation
  };
}
```

## 3. Usage in Component

In your `TimelineVerificationResults.tsx` or `GeolocationResults.tsx`:

```tsx
import { useExplanation } from '@/hooks/useExplanation';

// ... inside component

const { explanation, isLoading, error, requestExplanation } = useExplanation();

const handleGenerateExplanation = () => {
    // PASS ONLY THE ID AND TYPE - No complex data mapping needed!
    requestExplanation({
        analysisId: mediaId, // or your analysis ID
        featureType: 'timeline_verification', // or 'geolocation_verification'
        options: { tone: 'professional' }
    });
};

return (
  <div>
    {/* Trigger Button */}
    {!explanation && !isLoading && (
        <button onClick={handleGenerateExplanation}>
           Analyze with AI
        </button>
    )}

    {/* Loading State */}
    {isLoading && <p>Generating explanation...</p>}

    {/* Display Result */}
    {explanation && (
        <div className="ai-explanation-card">
            <h3>AI Summary</h3>
            <p>{explanation.content.summary}</p>
            {/* ... render key factors, etc ... */}
        </div>
    )}
  </div>
);
```

## 4. Key Notes

- **Simplified Payload**: Do NOT send `analysisData`, `score`, `timeline`, or `evidence`. The backend fetches all this from the database using the `analysisId`.
- **Error Handling**: 404 means the analysis wasn't found in the DB. 429 means budget exceeded.
- **Geolocation**: This works even if geolocation data is in a separate collection. Just send the `mediaId` as the `analysisId` and feature type `geolocation_verification`.
