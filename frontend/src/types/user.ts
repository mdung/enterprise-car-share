export enum Role {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_EMPLOYEE = 'ROLE_EMPLOYEE',
  ROLE_APPROVER = 'ROLE_APPROVER',
  ROLE_MAINTENANCE = 'ROLE_MAINTENANCE',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  department?: string;
  costCenter?: string;
  role: Role;
  enabled: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  costCenter?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

