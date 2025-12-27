/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Media } from "../hooks/useMedia";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenFilename(
  filename: string,
  keepStart = 5,
  keepEnd = 3,
): string {
  const parts = filename.split(".");
  if (parts.length < 2) return filename;

  const ext = parts.pop();
  const name = parts.join(".");

  if (name.length <= keepStart + keepEnd) {
    return filename;
  }

  return `${name.slice(0, keepStart)}...${name.slice(-keepEnd)}.${ext}`;
}

export function timeAgo(isoString: Date) {
  const date: any = new Date(isoString);
  const now: any = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
};

export const getStatusColor = (status: Media["status"]) => {
  switch (status) {
    case "analyzed":
      return "bg-[#e1feea] border-[#049d35] text-[#049d35]";
    case "processing":
      return "bg-[#fdfbe1] border-[#d5c70a] text-[#d5c70a]";
    case "error":
      return "bg-[#fee1e1] border-[#d50a0a] text-[#d50a0a]";
    case "pending":
      return "bg-[#e1f0fe] border-[#0a7bd5] text-[#0a7bd5]";
    default:
      return "bg-gray-100 border-gray-400 text-gray-600";
  }
};

/**
 * Validates password strength matching backend validation rules
 * @param password - The password to validate
 * @returns Object containing validation status and error messages
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for repeated characters (3 or more)
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
  }

  // Check for common patterns
  if (/123|abc|qwe|password|admin/i.test(password)) {
    errors.push('Password cannot contain common patterns');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
