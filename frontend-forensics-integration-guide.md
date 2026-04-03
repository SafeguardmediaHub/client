# Frontend Forensics Integration Guide

## Purpose

This document explains how the frontend should communicate with this backend to use the forensic-analysis feature.

This guide reflects the current backend state:

- image forensics: implemented
- audio forensics: implemented
- video forensics: implemented
- frame forensics: implemented

The frontend should integrate only with this backend.

Do not call the forensic service directly from the browser.

## Update Additions

The following are new updates to the forensic contract and should be treated as frontend changes, not just documentation notes:

- forensic create requests now support:
  - `rerun`
  - `retry`
- forensic create responses now include freshness metadata:
  - `resultGeneratedAt`
  - `reusedExistingResult`
  - `isFreshRun`
  - `rerunnable`
- forensic status responses now include:
  - `resultGeneratedAt`
  - `triggerType`
  - `rerunnable`
- new media-scoped history endpoints now exist:
  - `GET /api/forensics/media/:mediaId/latest`
  - `GET /api/forensics/media/:mediaId/history`

If the frontend already integrated the older forensic endpoints, these additions should now be incorporated into the UI behavior.

## Backend Endpoints

The frontend should use these endpoints:

- `POST /api/media/presigned-url`
- `PUT <uploadUrl>` to S3
- `POST /api/media/confirm-upload`
- `POST /api/forensics/image`
- `POST /api/forensics/audio`
- `POST /api/forensics/video`
- `POST /api/forensics/frames`
- `GET /api/forensics/media/:mediaId/latest`
- `GET /api/forensics/media/:mediaId/history`
- `GET /api/forensics/:id/status`
- `GET /api/forensics/:id`
- `GET /api/subscription/usage`

Also available:

- `GET /api/forensics/api-info`

## Feature Availability

Before enabling forensic actions in the UI, the frontend should load:

```http
GET /api/subscription/usage
```

and check:

- `featureAvailability.forensicsImage.available`
- `featureAvailability.forensicsAudio.available`
- `featureAvailability.forensicsVideo.available`
- `featureAvailability.forensicsFrames.available`

The frontend should also use:

- `usage.analyses`
- `usage.files`

to show remaining monthly capacity.

See:

- [frontend-feature-access-and-usage-guide.md](/home/finzyphinzy/finzyphinzy/projects/gigs/safeguardmedia/server/docs/frontend-feature-access-and-usage-guide.md)
- [frontend-senior-feature-access-rollout-guide.md](/home/finzyphinzy/finzyphinzy/projects/gigs/safeguardmedia/server/docs/frontend-senior-feature-access-rollout-guide.md)

## Result Model

Forensics is separate from deepfake analysis.

Do not render forensic results using deepfake-specific language like:

- `deepfake`
- `synthetic`
- `real`

The forensic result model is:

- `verdict`
- `verdictLabel`
- `probability`
- `confidence`
- `findings`
- `summary`

## Auth Requirements

All forensic endpoints require:

- authenticated user
- verified email
- `Authorization: Bearer <token>`

## High-Level Flow

All forensic modes use the same first half of the flow:

1. user picks a file
2. frontend requests a presigned upload URL
3. frontend uploads the file to S3
4. frontend confirms the upload
5. backend returns `media.id`
6. frontend creates a forensic analysis using `media.id`

After that:

- image/audio usually complete synchronously
- video/frames are asynchronous and should be polled

## Upload Flow

The frontend must not upload files directly to `/api/forensics/*`.

Use the media-upload flow first.

## Step 1: Request a presigned upload URL

Endpoint:

```http
POST /api/media/presigned-url
```

Request body:

```json
{
  "filename": "sample.mp4",
  "contentType": "video/mp4",
  "fileSize": 2372820
}
```

Frontend should keep:

- `uploadUrl`
- `s3Key`
- `correlationId`

## Step 2: Upload the file to S3

Use the returned `uploadUrl` with `PUT`.

Example:

```ts
await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type,
    'Content-Length': String(file.size),
  },
  body: file,
});
```

## Step 3: Confirm the upload

Endpoint:

```http
POST /api/media/confirm-upload
```

Request body:

```json
{
  "s3Key": "users/.../file.mp4",
  "correlationId": "uuid-value"
}
```

The success response contains:

- `data.media.id`

That `media.id` is what all forensic create endpoints use.

## Create Endpoints

## Shared request shape

All forensic create endpoints accept:

```json
{
  "mediaId": "69c54169c7bf039a59c4a2db",
  "options": {},
  "rerun": false,
  "retry": false
}
```

`options` is optional.

`rerun` and `retry` are also optional.

### Update: `rerun` and `retry`

- `rerun: true`
  - always create a fresh forensic run
- `retry: true`
  - intended for rerunning a failed analysis
- if both are omitted:
  - the backend reuses the latest matching result by default

This means the frontend now has a clean way to distinguish:

- normal open/use flow
- run again
- retry failed run

For:

- image
- audio
- video

the frontend should normally omit `options` unless a backend-supported option is explicitly introduced.

For:

- frames

`options` is the place for frame-analysis controls such as sampling mode.

## Image forensics

Endpoint:

```http
POST /api/forensics/image
```

Typical behavior:

- request completes in one response
- result is usually immediately available

Typical success status:

- `201 Created`

Typical frontend handling:

- show in-request loading
- then render the returned analysis

## Audio forensics

Endpoint:

```http
POST /api/forensics/audio
```

Typical behavior:

- request completes in one response
- result is usually immediately available

Typical success status:

- `201 Created`

Typical frontend handling:

- show in-request loading
- then render the returned analysis

## Video forensics

Endpoint:

```http
POST /api/forensics/video
```

Typical behavior:

- backend creates or reuses a forensic analysis
- new work is queued asynchronously
- frontend must poll status until terminal

Typical success status:

- `202 Accepted` for new or in-progress work
- `200 OK` if the backend is reusing an already completed result

### Update: cached reuse behavior

By default, if the same user runs the same media and same effective options again, the backend may return the previously generated result instead of creating a new run.

The frontend should use the returned freshness fields to communicate that clearly.

Typical `202` response:

```json
{
  "success": true,
  "message": "Video forensic analysis queued successfully",
  "data": {
    "analysis": {
      "id": "69f000000000000000000010",
      "mediaId": "69c54169c7bf039a59c4a2db",
      "fileName": "evidence-video.mp4",
      "originalFileName": "evidence-video.mp4",
      "mediaType": "video",
      "fileSize": 2372820,
      "mimeType": "video/mp4",
      "uploadDate": "2026-03-31T...",
      "status": "pending",
      "analysisStartedAt": null,
      "analysisCompletedAt": null,
      "createdAt": "2026-03-31T...",
      "updatedAt": "2026-03-31T...",
      "thumbnailUrl": "https://...",
      "previewUrl": "https://...",
      "processing": {
        "processingMode": "async",
        "processingMetadata": {}
      },
      "forensics": {
        "findings": []
      },
      "errorInfo": null
    },
    "job": {
      "id": "forensics-video-69f000000000000000000010"
    }
  }
}
```

The frontend should store:

- `analysis.id`

The frontend does not need the queue job id for normal UI behavior.

## Frame forensics

Endpoint:

```http
POST /api/forensics/frames
```

Typical behavior:

- same async lifecycle as video forensics
- frontend must poll until terminal

Typical success status:

- `202 Accepted` for queued or in-progress work
- `200 OK` if a completed result is being reused

### Update: frames also support rerun/retry

Frames follow the same create semantics:

- default request may reuse a stored result
- `rerun: true` forces a new run
- `retry: true` reruns a failed one

Example request with options:

```json
{
  "mediaId": "69c54169c7bf039a59c4a2db",
  "options": {
    "sampling_mode": "uniform"
  }
}
```

Frontend note:

- only send frame-analysis options that the backend and forensic service actually support
- do not invent arbitrary frame option structures client-side

## Status Polling

For:

- video forensics
- frame forensics

the frontend should poll:

```http
GET /api/forensics/:id/status
```

Example:

```http
GET /api/forensics/69f000000000000000000010/status
```

Typical response shape:

```json
{
  "success": true,
  "message": "Forensic analysis status retrieved successfully",
  "data": {
    "analysis": {
      "id": "69f000000000000000000010",
      "mediaId": "69c54169c7bf039a59c4a2db",
      "mediaType": "video",
      "status": "processing",
      "effectiveStatus": "processing",
      "resultGeneratedAt": null,
      "rerunnable": true,
      "triggerType": "initial",
      "analysisStartedAt": "2026-03-31T...",
      "analysisCompletedAt": null,
      "createdAt": "2026-03-31T...",
      "updatedAt": "2026-03-31T...",
      "errorInfo": null
    },
    "processing": {
      "processingMode": "async"
    },
    "forensics": null
  }
}
```

## Which field should drive UI state

Use:

- `data.analysis.effectiveStatus`

Do not rely only on:

- `data.analysis.status`

Recommended mapping:

- `pending` => queued / waiting
- `processing` => actively processing
- `completed` => done
- `failed` => failed

### Update: status response fields the frontend should now use

The frontend should also pay attention to:

- `analysis.resultGeneratedAt`
- `analysis.triggerType`
- `analysis.rerunnable`

These are useful for showing:

- when a completed result was actually produced
- whether the result came from an initial run, rerun, or retry
- whether the UI should show a `Run Again` action

## Polling recommendation

Recommended frontend polling interval:

- every 3 to 5 seconds

Stop polling when:

- `effectiveStatus === "completed"`
- `effectiveStatus === "failed"`

When polling reaches `completed`, fetch the full detail endpoint:

```http
GET /api/forensics/:id
```

## Full Result Endpoint

Endpoint:

```http
GET /api/forensics/:id
```

Use it for:

- forensic result detail pages
- refreshing a completed result
- loading result history items

Typical response:

```json
{
  "success": true,
  "message": "Forensic analysis retrieved successfully",
  "data": {
    "analysis": {
      "id": "69f000000000000000000010",
      "mediaId": "69c54169c7bf039a59c4a2db",
      "fileName": "evidence-video.mp4",
      "originalFileName": "evidence-video.mp4",
      "mediaType": "video",
      "fileSize": 2372820,
      "mimeType": "video/mp4",
      "uploadDate": "2026-03-31T...",
      "status": "completed",
      "analysisStartedAt": "2026-03-31T...",
      "analysisCompletedAt": "2026-03-31T...",
      "createdAt": "2026-03-31T...",
      "updatedAt": "2026-03-31T...",
      "thumbnailUrl": "https://...",
      "previewUrl": "https://...",
      "processing": {
        "processingMode": "async",
        "processingMetadata": {
          "startTime": "2026-03-31T...",
          "endTime": "2026-03-31T...",
          "processingTimeMs": 15422,
          "gpuUsed": false,
          "memoryUsageMB": 2,
          "cpuUsagePercent": 0
        }
      },
      "freshness": {
        "resultGeneratedAt": "2026-03-31T...",
        "rerunnable": true,
        "triggerType": "initial"
      },
      "forensics": {
        "verdict": "likely_tampered",
        "verdictLabel": "Likely Tampered",
        "probability": 0.72,
        "confidence": 0.88,
        "findings": [
          {
            "title": "Frame anomaly detected",
            "module": "frames",
            "severity": "high",
            "confidence": 0.86,
            "description": "..."
          }
        ],
        "summary": "Assessment based on forensic analysis",
        "file": {
          "filename": "evidence-video.mp4",
          "sha256": "..."
        }
      },
      "errorInfo": null
    }
  }
}
```

## Important Public Contract Notes

Public forensic responses intentionally do not expose:

- provider name
- upstream job id
- upstream job status
- forensic engine internals
- raw upstream payload

The frontend should not expect:

- `processing.provider`
- `processing.upstreamJobId`
- `processing.upstreamStatus`
- `forensics.engine`
- `forensics.engineDetail`

The frontend should use only the product-safe public fields already returned.

## Update: Latest And History Endpoints

The frontend can now fetch latest and historical runs for a media item.

### Get latest forensic result for a media item

Endpoint:

```http
GET /api/forensics/media/:mediaId/latest
```

Optional query:

```http
GET /api/forensics/media/:mediaId/latest?mediaType=video
```

Use cases:

- preload the latest result when opening a forensic tab for a media item
- decide whether to show an existing result before prompting for rerun

### Get forensic history for a media item

Endpoint:

```http
GET /api/forensics/media/:mediaId/history
```

Optional query params:

- `mediaType`
- `page`
- `limit`

Example:

```http
GET /api/forensics/media/69c54169c7bf039a59c4a2db/history?mediaType=video&page=1&limit=10
```

Typical response shape:

```json
{
  "success": true,
  "message": "Forensic analysis history retrieved successfully",
  "data": {
    "analyses": [
      {
        "id": "69f000000000000000000020",
        "mediaId": "69c54169c7bf039a59c4a2db",
        "mediaType": "video",
        "status": "completed",
        "freshness": {
          "resultGeneratedAt": "2026-04-03T12:01:10.000Z",
          "rerunnable": true,
          "triggerType": "rerun"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

Use cases:

- show previous forensic runs
- show whether the current result is old
- let users compare old vs new runs later

## UI State Machine

Recommended state machine:

- `idle`
- `requesting_upload_url`
- `uploading_to_s3`
- `confirming_upload`
- `creating_forensic_analysis`
- `polling_forensic_status`
- `completed`
- `failed`

### Update: additional UX states worth modeling

The frontend should now also be prepared to represent:

- `showing_cached_result`
- `rerunning_forensics`
- `retrying_failed_forensics`

Recommended flow:

### Image / audio

1. `idle`
2. `requesting_upload_url`
3. `uploading_to_s3`
4. `confirming_upload`
5. `creating_forensic_analysis`
6. `completed` or `failed`

### Video / frames

1. `idle`
2. `requesting_upload_url`
3. `uploading_to_s3`
4. `confirming_upload`
5. `creating_forensic_analysis`
6. `polling_forensic_status`
7. `completed` or `failed`

## Rendering Guidance

## Primary fields to display

Show these first:

- `forensics.verdictLabel`
- `forensics.summary`
- `forensics.confidence`
- `forensics.probability`
- `forensics.findings`

Recommended result card:

- Title: `verdictLabel`
- Subtitle: `summary`
- Meta:
  - `Confidence`
  - `Probability`

## Findings

Each finding can render:

- `title`
- `module`
- `severity`
- `confidence`
- `description`
- `timestamp_s` if present

For video/frame results, `timestamp_s` is especially useful and should be shown when provided.

## Preview handling

### Image

Use:

- `previewUrl`
- `thumbnailUrl`

### Audio

Use:

- frontend audio placeholder
- audio icon
- waveform if the UI has one

### Video / frames

Use:

- `thumbnailUrl`
- `previewUrl`

if present from the uploaded media record.

## Error Handling

The create request can fail with:

- `403` feature not available on current plan
- `429` monthly analysis limit reached
- `503` feature globally disabled
- `400` wrong media type or bad request
- `404` media not found
- `413` file too large

The frontend should treat `403`, `429`, and `503` as normal product states, not generic backend failures.

## Update: Suggested UI Behavior For Cached Results

If a create request returns a reused result:

- show that it is a saved result
- show when it was generated
- show a `Run Again` action

Suggested UI copy:

- `Showing saved result`
- `Generated on Apr 3, 2026`
- `Run again for a fresh result`

If a result failed previously:

- show the failure state
- show `Retry`

The `Retry` action should call the same endpoint with:

```json
{
  "mediaId": "...",
  "retry": true
}
```

The `Run Again` action should call:

```json
{
  "mediaId": "...",
  "rerun": true
}
```

### Create-request failures

If create fails:

- show backend message
- keep the user on the current screen
- allow retry only when the error is retryable from a product perspective

### Status failures

If `GET /api/forensics/:id/status` fails:

- keep the current UI state
- show `Unable to refresh status`
- allow retry

### Analysis failures

If `effectiveStatus === "failed"`:

- stop polling
- show `analysis.errorInfo.message`
- optionally show a retry button if product wants one later

## Suggested TypeScript Contracts

```ts
type CreateForensicsRequest = {
  mediaId: string;
  options?: Record<string, unknown>;
  rerun?: boolean;
  retry?: boolean;
};

type ForensicsFinding = {
  title: string;
  module: string;
  severity: string;
  confidence: number;
  description: string;
  timestamp_s?: number;
};

type PublicForensicAnalysis = {
  id: string;
  mediaId: string;
  fileName: string;
  originalFileName: string;
  mediaType: 'image' | 'audio' | 'video' | 'frames';
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  analysisStartedAt?: string | null;
  analysisCompletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  processing: {
    processingMode: 'sync' | 'async';
    processingMetadata?: {
      startTime?: string;
      endTime?: string;
      processingTimeMs?: number;
      gpuUsed?: boolean;
      memoryUsageMB?: number;
      cpuUsagePercent?: number;
    };
  };
  freshness?: {
    resultGeneratedAt?: string | null;
    rerunnable: boolean;
    triggerType?: 'initial' | 'rerun' | 'retry';
  };
  forensics: {
    verdict?: string;
    verdictLabel?: string;
    probability?: number;
    confidence?: number;
    findings: ForensicsFinding[];
    summary?: string;
    file?: {
      filename?: string;
      sha256?: string | null;
    };
  };
  errorInfo?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    retryCount: number;
  } | null;
};

type ForensicStatusResponse = {
  analysis: {
    id: string;
    mediaId: string;
    mediaType: 'image' | 'audio' | 'video' | 'frames';
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
    effectiveStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
    resultGeneratedAt?: string | null;
    rerunnable: boolean;
    triggerType?: 'initial' | 'rerun' | 'retry';
    analysisStartedAt?: string | null;
    analysisCompletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    errorInfo?: {
      code: string;
      message: string;
      details?: Record<string, unknown>;
      retryCount: number;
    } | null;
  };
  processing: {
    processingMode: 'sync' | 'async';
  };
  forensics:
    | {
        verdict?: string;
        verdictLabel?: string;
        probability?: number;
        confidence?: number;
        findings: ForensicsFinding[];
        summary?: string;
      }
    | null;
};
```

## Example Frontend Flows

## Image/audio

```ts
async function runImageForensics(file: File, token: string) {
  const presigned = await api.post('/api/media/presigned-url', {
    filename: file.name,
    contentType: file.type,
    fileSize: file.size,
  }, token);

  const { uploadUrl, s3Key, correlationId } = presigned.data.upload;

  await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Content-Length': String(file.size),
    },
    body: file,
  });

  const confirmed = await api.post(
    '/api/media/confirm-upload',
    { s3Key, correlationId },
    token
  );

  const mediaId = confirmed.data.media.id;

  const created = await api.post(
    '/api/forensics/image',
    { mediaId },
    token
  );

  return created.data.analysis;
}
```

## Video/frames

```ts
async function runVideoForensics(file: File, token: string) {
  const presigned = await api.post('/api/media/presigned-url', {
    filename: file.name,
    contentType: file.type,
    fileSize: file.size,
  }, token);

  const { uploadUrl, s3Key, correlationId } = presigned.data.upload;

  await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Content-Length': String(file.size),
    },
    body: file,
  });

  const confirmed = await api.post(
    '/api/media/confirm-upload',
    { s3Key, correlationId },
    token
  );

  const mediaId = confirmed.data.media.id;

  const created = await api.post(
    '/api/forensics/video',
    { mediaId, rerun: false },
    token
  );

  const analysisId = created.data.analysis.id;

  for (;;) {
    const status = await api.get(`/api/forensics/${analysisId}/status`, token);
    const effectiveStatus = status.data.analysis.effectiveStatus;

    if (effectiveStatus === 'completed') {
      const detail = await api.get(`/api/forensics/${analysisId}`, token);
      return detail.data.analysis;
    }

    if (effectiveStatus === 'failed') {
      throw new Error(
        status.data.analysis.errorInfo?.message || 'Forensic analysis failed'
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));
  }
}
```

## What The Frontend Should Not Do

- do not call the forensic service directly
- do not upload files directly to the forensic service
- do not expect provider names in public responses
- do not expect upstream job ids in public responses
- do not render deepfake-specific terminology for forensic results
- do not assume video/frame analysis completes in the create response

## Summary Of The Updates

Frontend additions you should implement now:

- support `rerun` and `retry` in create requests
- show freshness metadata from create/detail/status responses
- use `GET /api/forensics/media/:mediaId/latest`
- use `GET /api/forensics/media/:mediaId/history` where history UI is needed
- show `Run Again` for cached or completed results
- show `Retry` for failed results

## Summary

Frontend integration should now support:

- sync image forensics
- sync audio forensics
- async video forensics
- async frame forensics

The correct model is:

1. upload media through `/api/media/*`
2. create forensic analysis through `/api/forensics/*`
3. if sync, render returned result
4. if async, poll `/api/forensics/:id/status`
5. fetch `/api/forensics/:id` for the final result view
