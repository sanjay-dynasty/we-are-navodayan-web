import { apiClient } from '../client';
import type { Jnv } from '../../../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const jnvService = {
  getAll: async (): Promise<Jnv[]> => {
    const response = await apiClient.get<ApiResponse<Jnv[]>>('/jnvs');
    return response.data.data;
  },

  getById: async (jnvId: string): Promise<Jnv> => {
    const response = await apiClient.get<ApiResponse<Jnv>>(
      `/jnvs/${encodeURIComponent(jnvId)}`,
    );
    return response.data.data;
  },
};
