import axios from 'axios';
import type { ApiError } from '../../types';

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data;

    if (responseData && typeof responseData === 'object') {
      const data = responseData as Record<string, unknown>;

      return {
        message: typeof data.message === 'string' ? data.message : getDefaultErrorMessage(status),
        status,
        code: typeof data.code === 'string' ? data.code : error.code,
        timestamp: typeof data.timestamp === 'string' ? data.timestamp : undefined,
        path: typeof data.path === 'string' ? data.path : undefined,
      };
    }

    return {
      message: getDefaultErrorMessage(status),
      status,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred.',
  };
}

function getDefaultErrorMessage(status?: number): string {
  switch (status) {
    case 400:
      return 'Invalid request.';
    case 401:
      return 'Authentication is required.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'The request conflicts with the current state.';
    case 422:
      return 'The submitted data is invalid.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error.';
    case 502:
    case 503:
    case 504:
      return 'The service is temporarily unavailable.';
    default:
      return 'Unable to complete the request.';
  }
}
