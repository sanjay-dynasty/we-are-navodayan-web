const env = {
  appName: import.meta.env.VITE_APP_NAME,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appEnv: import.meta.env.VITE_APP_ENV,
} as const;

export default env;
