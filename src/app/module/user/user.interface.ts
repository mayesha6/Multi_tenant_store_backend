import type { AuthProvider, IsActive, UserRole } from "@prisma/client";

export interface IAuthProvider {
  id?: string;
  provider: AuthProvider;
  providerId: string;
  userId?: string;
}

export interface IUser {
  id?: string; // UUID
  name: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  picture?: string | null;
  address?: string | null;

  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;

  role: UserRole;

  auths?: IAuthProvider[];

  createdAt?: Date;
  updatedAt?: Date;
}