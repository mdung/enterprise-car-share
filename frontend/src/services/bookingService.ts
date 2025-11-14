import apiClient from './apiClient';
import { Booking, BookingCreateRequest, BookingStatus, CheckoutRequest, CheckinRequest, BookingUsage } from '../types/booking';
import { PageResponse } from '../types/common';

export const bookingService = {
  create: async (data: BookingCreateRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', data);
    return response.data;
  },

  getMyBookings: async (page = 0, size = 10): Promise<PageResponse<Booking>> => {
    const response = await apiClient.get<PageResponse<Booking>>('/bookings/my-bookings', {
      params: { page, size },
    });
    return response.data;
  },

  getAll: async (page = 0, size = 10, status?: BookingStatus): Promise<PageResponse<Booking>> => {
    const response = await apiClient.get<PageResponse<Booking>>('/bookings', {
      params: { page, size, status },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  approve: async (id: number): Promise<Booking> => {
    const response = await apiClient.post<Booking>(`/bookings/${id}/approve`);
    return response.data;
  },

  reject: async (id: number): Promise<Booking> => {
    const response = await apiClient.post<Booking>(`/bookings/${id}/reject`);
    return response.data;
  },

  cancel: async (id: number): Promise<Booking> => {
    const response = await apiClient.post<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  checkout: async (id: number, data: CheckoutRequest): Promise<BookingUsage> => {
    const response = await apiClient.post<BookingUsage>(`/bookings/${id}/checkout`, data);
    return response.data;
  },

  checkin: async (id: number, data: CheckinRequest): Promise<BookingUsage> => {
    const response = await apiClient.post<BookingUsage>(`/bookings/${id}/checkin`, data);
    return response.data;
  },
};

