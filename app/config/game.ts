/**
 * Central Game Configuration
 * Use environment variables with fallbacks to avoid hardcoding sensitive or changing values.
 */

export const GAME_CONFIG = {
  TREASURY_WALLET: (import.meta as any).env.VITE_TREASURY_WALLET || "0x7AcbaEf80145c363941F480072b260909A64B294",
  API_URL: (import.meta as any).env.VITE_API_URL || "",
} as const;
