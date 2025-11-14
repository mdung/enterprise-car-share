export enum VehicleType {
  CAR = 'CAR',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
  capacity: number;
  vin?: string;
  departmentOwner?: string;
  costCenter?: string;
  status: VehicleStatus;
  currentMileage: number;
  lastServiceDate?: string;
  nextServiceDue?: string;
  insuranceExpiryDate?: string;
  registrationExpiryDate?: string;
}

export interface VehicleCreateRequest {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
  capacity: number;
  vin?: string;
  departmentOwner?: string;
  costCenter?: string;
  lastServiceDate?: string;
  nextServiceDue?: string;
  insuranceExpiryDate?: string;
  registrationExpiryDate?: string;
}

