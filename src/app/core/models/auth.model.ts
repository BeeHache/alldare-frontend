export interface RegisterRequest {
  login: string;
  password: string;
}

export interface RegisterResponse {
  accountId: string;
  userId: string;
  login: string;
}

export interface LoginResponse {
  accessToken: string;
  access_token?: string; // Standard OAuth2 response property
}
