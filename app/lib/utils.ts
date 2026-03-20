import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  if (num >= 1000000) {
    // 1,234,567 -> 1.2m
    return (Math.floor(num / 100000) / 10).toFixed(1) + "m";
  }
  if (num >= 1000) {
    // 4,568 -> 4.5k
    return (Math.floor(num / 100) / 10).toFixed(1) + "k";
  }
  return num.toLocaleString();
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
