export interface CreateContractDTO {
  unitId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
}

export interface TerminateContractDTO {
  reason: string;
}