import type { ContactSource, ContactStatus, Prisma } from "@prisma/client";

export interface IContact {
  id?: string;
  tenantId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  picture?: string | null;
  address?: string | null;
  status?: ContactStatus;
  source?: ContactSource;
  tags?: string[];
  metadata?: Prisma.JsonValue | null;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactQuery {
  searchTerm?: string;
  status?: ContactStatus;
  source?: ContactSource;
  tag?: string;
  page?: string;
  limit?: string;
}