import { apiClient } from '../client';
import type { UserProfile, UserProfileUpdateRequest } from '../../../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const userService = {
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      '/user-profiles/me',
    );
    return response.data.data;
  },

  updateMyProfile: async (
    request: UserProfileUpdateRequest,
  ): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      '/user-profiles/me',
      request,
    );
    return response.data.data;
  },

  replaceMySkills: async (skills: string[]): Promise<string[]> => {
    const response = await apiClient.put<ApiResponse<string[]>>(
      '/user-profiles/me/skills',
      skills,
    );
    return response.data.data;
  },

  replaceMyInterests: async (interests: string[]): Promise<string[]> => {
    const response = await apiClient.put<ApiResponse<string[]>>(
      '/user-profiles/me/interests',
      interests,
    );
    return response.data.data;
  },

  getUserById: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      `/user-profiles/${encodeURIComponent(userId)}`,
    );
    return response.data.data;
  },
};
