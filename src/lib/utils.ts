import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenFilename(
  filename: string,
  keepStart = 5,
  keepEnd = 3
): string {
  const parts = filename.split('.');
  if (parts.length < 2) return filename;

  const ext = parts.pop();
  const name = parts.join('.');

  if (name.length <= keepStart + keepEnd) {
    return filename;
  }

  return `${name.slice(0, keepStart)}...${name.slice(-keepEnd)}.${ext}`;
}
