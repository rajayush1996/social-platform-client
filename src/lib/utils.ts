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

export function formatCount(count: number): string {
  if (count >= 1e6) {
    return `${(count / 1e6).toFixed(1)}M`;
  }
  if (count >= 1e3) {
    return `${(count / 1e3).toFixed(1)}K`;
  }
  return `${count}`;
}


export function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; Secure; HttpOnly; SameSite=Strict`;
}

export function getCookie(name: string): string | null {
  const nameEq = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length); // Remove leading spaces
    }
    if (c.indexOf(nameEq) == 0) {
      return c.substring(nameEq.length, c.length);
    }
  }
  return null;
}
