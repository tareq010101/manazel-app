import { MaintenancePriority, MaintenanceStatus } from './maintenance.interface';

export interface CreateMaintenanceDTO {
  title: string;
  description: string;
  priority?: MaintenancePriority;
}

export interface UpdateMaintenanceStatusDTO {
  status: MaintenanceStatus;
  rejectionReason?: string;
}