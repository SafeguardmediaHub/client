import type { FileValidationResult } from '@/types/batch';

// Allowed file types by category
export const ALLOWED_FILE_TYPES = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/heic',
    'image/heif',
  ],
  video: [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/mpeg',
  ],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'],
  document: ['application/pdf'],
} as const;

// File size limits
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_BATCH_SIZE = 100; // Maximum files per batch

// MIME type to extension mapping
const MIME_TO_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
  'image/bmp': ['bmp'],
  'image/heic': ['heic'],
  'image/heif': ['heif'],
  'video/mp4': ['mp4'],
  'video/webm': ['webm'],
  'video/quicktime': ['mov'],
  'video/x-msvideo': ['avi'],
  'video/mpeg': ['mpeg', 'mpg'],
  'audio/mpeg': ['mp3'],
  'audio/wav': ['wav'],
  'audio/ogg': ['ogg'],
  'audio/mp4': ['m4a'],
  'audio/webm': ['weba'],
  'application/pdf': ['pdf'],
};

/**
 * Validate a single file
 */
export function validateFile(file: File): FileValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File too large (max ${sizeMB}MB)` };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  // Get file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension) {
    return { valid: false, error: 'File has no extension' };
  }

  // Special handling for HEIC/HEIF files - browsers often don't set correct MIME type
  let mimeType = file.type;
  if ((extension === 'heic' || extension === 'heif') &&
      (!mimeType || mimeType === 'application/octet-stream' || mimeType === '')) {
    mimeType = extension === 'heic' ? 'image/heic' : 'image/heif';
  }

  // Check MIME type
  const allowedTypes: string[] = Object.values(ALLOWED_FILE_TYPES).flat();
  if (!allowedTypes.includes(mimeType)) {
    return { valid: false, error: 'Unsupported file type' };
  }

  // Check file extension matches MIME type
  const allowedExtensions = MIME_TO_EXTENSIONS[mimeType];
  if (!allowedExtensions || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'File extension does not match file type',
    };
  }

  return { valid: true };
}

/**
 * Check if files array exceeds batch limit
 */
export function validateBatchSize(files: File[]): FileValidationResult {
  if (files.length === 0) {
    return { valid: false, error: 'No files selected' };
  }

  if (files.length > MAX_BATCH_SIZE) {
    return {
      valid: false,
      error: `Too many files (max ${MAX_BATCH_SIZE} per batch)`,
    };
  }

  return { valid: true };
}

/**
 * Check for duplicate files in the batch
 */
export function findDuplicateFiles(files: File[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const file of files) {
    const key = `${file.name}-${file.size}`;
    if (seen.has(key)) {
      duplicates.push(file.name);
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Calculate total size of files
 */
export function calculateTotalSize(files: File[]): number {
  return files.reduce((total, file) => total + file.size, 0);
}

/**
 * Get file icon based on MIME type
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '📷';
  if (mimeType.startsWith('video/')) return '📹';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.startsWith('application/pdf')) return '📄';
  return '📎';
}

/**
 * Get media type category from MIME type
 */
export function getMediaType(
  mimeType: string,
): 'image' | 'video' | 'audio' | 'document' | 'unknown' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'document';
  return 'unknown';
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Calculate estimated completion time based on average processing time
 */
export function estimateCompletionTime(
  remainingItems: number,
  avgProcessingTimeMs: number = 3000,
): string {
  const totalMs = remainingItems * avgProcessingTimeMs;
  const minutes = Math.ceil(totalMs / 60000);

  if (minutes < 1) return 'Less than a minute';
  if (minutes === 1) return '1 minute';
  if (minutes < 60) return `${minutes} minutes`;

  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours > 1 ? 's' : ''}`;
}

/**
 * Get status badge variant for UI
 */
export function getStatusVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'COMPLETED':
      return 'default'; // Will be styled as success
    case 'PROCESSING':
    case 'UPLOADING':
      return 'secondary';
    case 'FAILED':
    case 'PARTIAL_FAILURE':
      return 'destructive';
    default:
      return 'outline';
  }
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Format GPS coordinates to a readable string
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Formatted coordinate string (e.g., "7.4819°N, 5.7420°E")
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

/**
 * Generate Google Static Maps API URL
 * @param lat - Latitude
 * @param lng - Longitude
 * @param zoom - Zoom level (default 12)
 * @param width - Image width in pixels (default 600)
 * @param height - Image height in pixels (default 300)
 * @returns Static map image URL
 */
export function generateStaticMapUrl(
  lat: number,
  lng: number,
  zoom: number = 12,
  width: number = 600,
  height: number = 300,
): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set');
    return '';
  }

  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: zoom.toString(),
    size: `${width}x${height}`,
    markers: `color:red|${lat},${lng}`,
    key: apiKey,
  });

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

/**
 * Generate Google Maps link for opening in new tab
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Google Maps URL
 */
export function generateGoogleMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
