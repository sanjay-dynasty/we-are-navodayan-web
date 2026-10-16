import apiClient from '../client/apiClient';
import type { ApiResponse } from '../../../types/api/apiResponse';
import type {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisteredUserResponse,
  RegistrationRequest,
} from '../../../types/auth/auth';
import { tokenStorage } from './tokenStorage';

export const authService = {
  register: async (
    request: RegistrationRequest,
  ): Promise<ApiResponse<RegisteredUserResponse>> => {
    const response = await apiClient.post<
      ApiResponse<RegisteredUserResponse>
    >('/auth/register', request);

    return response.data;
  },

  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      request,
    );

    tokenStorage.saveLogin(response.data);

    return response.data;
  },

  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await apiClient.get<CurrentUserResponse>('/auth/me');

    return response.data;
  },

  refreshToken: async (
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh',
      request,
    );

    tokenStorage.saveRefreshedAccessToken(response.data);

    return response.data;
  },

  logout: async (): Promise<void> => {
    // The backend logout endpoint has not been confirmed.
    // Clear local tokens without calling an unverified endpoint.
    tokenStorage.clear();
  },
};
