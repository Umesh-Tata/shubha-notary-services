const isDev = import.meta.env.DEV;

export const API_BASE_URL = isDev
  ? 'http://localhost:5000'
  : 'https://shubha-notary-services.onrender.com';  // <- Use your actual Render URL
