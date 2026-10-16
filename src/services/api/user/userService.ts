import { apiClient } from '../client';
import type { UserProfile, UserProfileUpdateRequest } from '../../../types';

export const userService = {
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<{ success: boolean; data: UserProfile; message: string }>(
      '/user-profiles/me',
    );
    return response.data.data;
  },

  updateMyProfile: async (
    request: UserProfileUpdateRequest,
  ): Promise<UserProfile> => {
    const response = await apiClient.put<{ success: boolean; data: UserProfile; message: string }>(
      '/user-profiles/me',
      request,
    );
    return response.data.data;
  },

  getUserById: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get<{ success: boolean; data: UserProfile; message: string }>(
      `/user-profiles/${encodeURIComponent(userId)}`,
    );
    return response.data.data;
  },
};
