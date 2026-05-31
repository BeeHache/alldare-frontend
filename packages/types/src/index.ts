export enum AccountStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  PENDING = "PENDING",
}

export enum AccountType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface Account {
  id: string;
  login: string;
  status: AccountStatus;
  accountType: AccountType;
  roles: string[];
}

export interface RegisterRequest {
  login: string;
  password: string;
}

export interface RegisterResponse {
  accountId: string;
  userId: string;
  login: string;
}
