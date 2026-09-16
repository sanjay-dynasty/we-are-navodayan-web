import { apiClient } from '../client';
import type { Jnv } from '../../../types';

export const jnvService = {
  getAll: async (): Promise<Jnv[]> => {
    const response = await apiClient.get<Jnv[]>('/jnvs');
    return response.data;
  },

  getById: async (jnvId: string): Promise<Jnv> => {
    const response = await apiClient.get<Jnv>(`/jnvs/${jnvId}`);
    return response.data;
  },
};
