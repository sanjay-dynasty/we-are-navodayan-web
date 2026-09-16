const env = {
  appName: import.meta.env.VITE_APP_NAME,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appEnv: import.meta.env.VITE_APP_ENV,
} as const;

if (!env.appName) {
  throw new Error('VITE_APP_NAME is not configured.');
}

if (!env.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not configured.');
}

if (!env.appEnv) {
  throw new Error('VITE_APP_ENV is not configured.');
}

export default env;
