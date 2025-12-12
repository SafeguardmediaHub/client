// Verdict types
export type VerdictStatus =
	| "authentic" // 85-100
	| "likely_authentic" // 60-84
	| "suspicious" // 40-59
	| "likely_manipulated" // 20-39
	| "manipulated"; // 0-19

export type CategoryStatus =
	| "pass"
	| "info"
	| "warning"
	| "alert"
	| "fail"
	| "not_available"
	| "pending";

export type FindingSeverity = "info" | "low" | "medium" | "high" | "critical";

// Core interfaces
export interface IntegrityVerdict {
	status: VerdictStatus;
	confidence: number; // 0-100
	summary: string;
	scoreBreakdown?: {
		baseScore: number;
		deductions: Record<string, number>;
		bonuses: Record<string, number>;
		finalScore: number;
	};
}

export interface Finding {
	type: string;
	severity: FindingSeverity;
	impact: number;
	explanation: string;
	details?: Record<string, unknown>;
}

export interface Category {
	name: string;
	status: CategoryStatus;
	score: number | null;
	findings: Finding[];
}

export interface IntegrityReport {
	verdict: IntegrityVerdict;
	categories?: Category[];
	flags?: string[];
	recommendations?: string;
	rawData?: Record<string, unknown>;
}

export interface MediaInfo {
	originalFilename: string;
	mimeType: string;
	fileSize: number;
	uploadedAt: string;
	processedAt: string;
}

// API Response types
export interface IntegrityReportResponse {
	success: boolean;
	message: string;
	data: {
		mediaId: string;
		detail: "simple" | "full";
		report: IntegrityReport;
		mediaInfo: MediaInfo;
	};
	timestamp: string;
}

export interface IntegrityReportError {
	success: false;
	message: string;
	timestamp: string;
}

export interface IntegrityReportProcessing {
	success: false;
	message: string;
	data: {
		status: "processing";
		message: string;
		estimatedWaitSeconds?: number;
	};
	timestamp: string;
}
