import { Role } from '@shared/constants/roles';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}