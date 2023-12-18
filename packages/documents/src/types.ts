export interface PDF {
  title?: string;
  meta?: Meta;
  company: Company;
}

export type Meta = {
  author?: string;
  keywords?: string;
  subject?: string;
};

export type Company = {
  name: string;
  logo?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
};
