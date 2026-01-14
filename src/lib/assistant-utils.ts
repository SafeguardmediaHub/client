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
export const getToolIcon = (toolName: string | undefined | null): LucideIcon => {
  if (!toolName) return FileSearch;
  
  const toolIconMap: Record<string, LucideIcon> = {
    'metadata extraction': Camera,
    'metadata': Camera,
    'tamper detection': Shield,
    'tampering': Shield,
    'tampering detection': Shield,
    'reverse lookup': Search,
    'reverse image lookup': Search,
    'timeline verification': Clock,
    'timeline': Clock,
    'geolocation': MapPin,
    'geo': MapPin,
    'visual forensics': Microscope,
    'deepfake detection': Microscope,
    'deepfake': Microscope,
    'fact check': FileSearch,
    'c2pa verification': Shield,
    'c2pa': Shield,
  };

  const normalizedName = toolName.toLowerCase().trim();
  return toolIconMap[normalizedName] || FileSearch;
};

/**
 * Format time in seconds to human-readable string
 */
export const formatTime = (seconds: number | undefined | null): string => {
  if (typeof seconds !== 'number') return '0s';
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
export const formatCost = (amount: number | undefined | null): string => {
  if (typeof amount !== 'number') return 'Free';
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

/**
 * Transform backend workflow response to frontend format
 * Backend sends: { tool_id, description }
 * Frontend expects: { id, name, toolName, why, estimatedTime, cost, order }
 */
export const transformBackendWorkflow = (backendWorkflow: any): any => {
  // Helper to convert tool_id to human-readable name
  const toolIdToName = (toolId: string): string => {
    const nameMap: Record<string, string> = {
      'c2pa_verification': 'C2PA Verification',
      'metadata_extraction': 'Metadata Extraction',
      'tampering_detection': 'Tampering Detection',
      'deepfake_detection': 'Deepfake Detection',
      'reverse_lookup': 'Reverse Image Lookup',
      'timeline_verification': 'Timeline Verification',
      'geolocation': 'Geolocation Analysis',
      'fact_check': 'Fact Check',
    };
    return nameMap[toolId] || toolId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return {
    id: backendWorkflow.workflow_id || backendWorkflow.id || 'unknown',
    name: backendWorkflow.name || 'Workflow',
    explanation: backendWorkflow.explanation || '',
    totalCost: backendWorkflow.total_cost || backendWorkflow.totalCost || 0,
    totalTime: backendWorkflow.total_time || backendWorkflow.totalTime || 0,
    steps: (backendWorkflow.steps || []).map((step: any, index: number) => ({
      id: step.tool_id || step.id || `step_${index}`,
      name: step.name || toolIdToName(step.tool_id || ''),
      toolName: step.tool_name || step.tool_id || step.toolName || '',
      why: step.why || step.description || '',
      limitation: step.limitation || undefined,
      estimatedTime: step.estimated_time || step.estimatedTime || 0,
      cost: step.cost || 0,
      order: step.order !== undefined ? step.order : index,
      frontendLink: step.frontend_link || step.frontendLink || undefined,
    })),
    blindSpots: backendWorkflow.blind_spots || backendWorkflow.blindSpots || [],
  };
};
