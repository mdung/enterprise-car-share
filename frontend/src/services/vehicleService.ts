import apiClient from './apiClient';
import { Vehicle, VehicleCreateRequest, VehicleType, VehicleStatus } from '../types/vehicle';
import { PageResponse } from '../types/common';

export const vehicleService = {
  getAll: async (page = 0, size = 10, sortBy = 'id', direction = 'asc'): Promise<PageResponse<Vehicle>> => {
    const response = await apiClient.get<PageResponse<Vehicle>>('/vehicles', {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },

  getAvailable: async (
    page = 0,
    size = 10,
    department?: string,
    vehicleType?: VehicleType
  ): Promise<PageResponse<Vehicle>> => {
    const response = await apiClient.get<PageResponse<Vehicle>>('/vehicles/available', {
      params: { page, size, department, vehicleType },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Vehicle> => {
    const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  create: async (data: VehicleCreateRequest): Promise<Vehicle> => {
    const response = await apiClient.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  update: async (id: number, data: VehicleCreateRequest): Promise<Vehicle> => {
    const response = await apiClient.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },

  updateStatus: async (id: number, status: VehicleStatus): Promise<Vehicle> => {
    const response = await apiClient.patch<Vehicle>(`/vehicles/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};

