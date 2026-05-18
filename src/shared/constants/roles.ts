export const ROLES = {
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  ADMIN: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];