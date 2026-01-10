import {
  Camera,
  FileSearch,
  MapPin,
  Microscope,
  Search,
  Shield,
  Clock,
  type LucideIcon,
} from 'lucide-react';

/**
 * Map tool names to their corresponding icons
 */
export const getToolIcon = (toolName: string): LucideIcon => {
  const toolIconMap: Record<string, LucideIcon> = {
    'metadata extraction': Camera,
    'metadata': Camera,
    'tamper detection': Shield,
    'tampering': Shield,
    'reverse lookup': Search,
    'reverse image lookup': Search,
    'timeline verification': Clock,
    'timeline': Clock,
    'geolocation': MapPin,
    'geo': MapPin,
    'visual forensics': Microscope,
    'deepfake detection': Microscope,
    'fact check': FileSearch,
  };

  const normalizedName = toolName.toLowerCase().trim();
  return toolIconMap[normalizedName] || FileSearch;
};

/**
 * Format time in seconds to human-readable string
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Format cost for display
 */
export const formatCost = (amount: number): string => {
  if (amount === 0) {
    return 'Free';
  }
  if (amount < 1) {
    return `$${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(0)}`;
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Save session to localStorage
 */
export const saveSessionToStorage = (sessionId: string, data: unknown): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `assistant_session_${sessionId}`,
        JSON.stringify(data)
      );
      localStorage.setItem('assistant_last_session', sessionId);
    }
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
};

/**
 * Load session from localStorage
 */
export const loadSessionFromStorage = (sessionId: string): unknown | null => {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(`assistant_session_${sessionId}`);
      return data ? JSON.parse(data) : null;
    }
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
  }
  return null;
};

/**
 * Get last session ID from localStorage
 */
export const getLastSessionId = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('assistant_last_session');
    }
  } catch (error) {
    console.error('Failed to get last session ID:', error);
  }
  return null;
};

/**
 * Clear session from localStorage
 */
export const clearSession = (sessionId: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`assistant_session_${sessionId}`);
    }
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};
