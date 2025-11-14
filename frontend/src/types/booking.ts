import { Vehicle } from './vehicle';

export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface BookingUsage {
  id: number;
  bookingId: number;
  startMileage?: number;
  endMileage?: number;
  startFuelLevel?: number;
  endFuelLevel?: number;
  distanceTravelled?: number;
  damageReported: boolean;
  damageDescription?: string;
  preTripPhotos?: string[];
  postTripPhotos?: string[];
  checkoutComments?: string;
  checkinComments?: string;
  checkedOutAt?: string;
  checkedInAt?: string;
}

export interface Booking {
  id: number;
  vehicleId: number;
  vehicle?: Vehicle;
  userId: number;
  userEmail: string;
  userName: string;
  approverId?: number;
  approverEmail?: string;
  startDateTime: string;
  endDateTime: string;
  pickupLocation: string;
  returnLocation: string;
  purpose?: string;
  status: BookingStatus;
  approvalRequired: boolean;
  createdAt: string;
  updatedAt: string;
  usage?: BookingUsage;
}

export interface BookingCreateRequest {
  vehicleId: number;
  startDateTime: string;
  endDateTime: string;
  pickupLocation: string;
  returnLocation: string;
  purpose?: string;
}

export interface CheckoutRequest {
  startMileage: number;
  startFuelLevel: number;
  preTripPhotos?: string[];
  checkoutComments?: string;
}

export interface CheckinRequest {
  endMileage: number;
  endFuelLevel: number;
  damageReported?: boolean;
  damageDescription?: string;
  postTripPhotos?: string[];
  checkinComments?: string;
}

