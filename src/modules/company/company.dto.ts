export interface CreateCompanyDTO {
  name: string;
  email: string;
  phone: string;
  address?: string;
  planSlug: string;
}

export interface UpdateCompanyDTO {
  name?: string;
  phone?: string;
  address?: string;
  logo?: string;
}