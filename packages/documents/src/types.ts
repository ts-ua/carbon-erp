import type { Database } from "@carbon/database";

export interface Email {
  company: Company;
  recipient: {
    name: string;
    email: string;
  };
  sender: {
    name: string;
    email: string;
  };
}

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

export type Company = Database["public"]["Tables"]["company"]["Row"];
