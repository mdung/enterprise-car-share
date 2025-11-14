import { Vehicle } from './vehicle';

export enum MaintenanceStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface MaintenanceTask {
  id: number;
  vehicleId: number;
  vehicle?: Vehicle;
  createdById: number;
  createdByEmail: string;
  title: string;
  description?: string;
  status: MaintenanceStatus;
  plannedDate?: string;
  completedDate?: string;
  cost?: number;
  workshopName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTaskCreateRequest {
  vehicleId: number;
  title: string;
  description?: string;
  status?: MaintenanceStatus;
  plannedDate?: string;
  cost?: number;
  workshopName?: string;
}

