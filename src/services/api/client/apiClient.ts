import axios from 'axios';
import env from '../../../config/env';
import { normalizeApiError } from '../../../utils/error';

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(normalizeApiError(error));
  },
);

export default apiClient;
