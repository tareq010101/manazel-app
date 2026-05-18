import { UnitStatus } from './unit.interface';

export interface CreateUnitDTO {
  unitNumber: string;
  floor: number;
  rooms: number;
  bathrooms: number;
  area: number;
  price: number;
  description?: string;
}

export interface UpdateUnitDTO {
  unitNumber?: string;
  floor?: number;
  rooms?: number;
  bathrooms?: number;
  area?: number;
  price?: number;
  status?: UnitStatus;
  description?: string;
}