import apiClient from './apiClient';
import { MaintenanceTask, MaintenanceTaskCreateRequest, MaintenanceStatus } from '../types/maintenance';
import { PageResponse } from '../types/common';

export const maintenanceService = {
  getAll: async (page = 0, size = 10): Promise<PageResponse<MaintenanceTask>> => {
    const response = await apiClient.get<PageResponse<MaintenanceTask>>('/maintenance', {
      params: { page, size },
    });
    return response.data;
  },

  getByVehicle: async (vehicleId: number, page = 0, size = 10): Promise<PageResponse<MaintenanceTask>> => {
    const response = await apiClient.get<PageResponse<MaintenanceTask>>(`/maintenance/vehicle/${vehicleId}`, {
      params: { page, size },
    });
    return response.data;
  },

  getById: async (id: number): Promise<MaintenanceTask> => {
    const response = await apiClient.get<MaintenanceTask>(`/maintenance/${id}`);
    return response.data;
  },

  create: async (data: MaintenanceTaskCreateRequest): Promise<MaintenanceTask> => {
    const response = await apiClient.post<MaintenanceTask>('/maintenance', data);
    return response.data;
  },

  updateStatus: async (id: number, status: MaintenanceStatus): Promise<MaintenanceTask> => {
    const response = await apiClient.patch<MaintenanceTask>(`/maintenance/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};

