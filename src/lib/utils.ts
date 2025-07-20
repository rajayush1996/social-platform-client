import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// src/utils/formatDuration.ts

/**
 * Convert a length in seconds into a string like "MM:SS" or "H:MM:SS"
 * @param totalSeconds  total duration in seconds (can be fractional)
 * @returns formatted duration string
 */
export function formatDuration(totalSeconds: number): string {
  // round to nearest second
  const secs = Math.round(totalSeconds);

  const hours   = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;

  // pad helper
  const pad2 = (n: number) => n.toString().padStart(2, "0");

  if (hours > 0) {
    // H:MM:SS
    return `${hours}:${pad2(minutes)}:${pad2(seconds)}`;
  } else {
    // MM:SS
    return `${minutes}:${pad2(seconds)}`;
  }
}
