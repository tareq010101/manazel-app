export interface CreatePropertyDTO {
  name: string;
  description?: string;
  address: {
    street: string;
    city: string;
    district: string;
  };
}

export interface UpdatePropertyDTO {
  name?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
  };
}