export enum AccountStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  PENDING = "PENDING",
}

export enum AccountType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface Role {
  name: string;
}

export interface Account {
  id: string;
  login: string;
  status: AccountStatus;
  accountType: AccountType;
  roles: (string | Role)[];
}
