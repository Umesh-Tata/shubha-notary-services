const isDev = import.meta.env.DEV;

export const API_BASE_URL = isDev
  ? 'http://localhost:5000'
  : 'https://your-production-api.com'; // ← replace later with real backend URL
