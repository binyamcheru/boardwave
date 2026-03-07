export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000';

export const WS_BASE =
  (import.meta.env.VITE_WS_URL as string | undefined) || 'ws://localhost:3000';
