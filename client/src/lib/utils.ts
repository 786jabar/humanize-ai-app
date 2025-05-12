import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  // Average reading speed: 200 words per minute
  return Math.max(1, Math.ceil(words / 200));
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
