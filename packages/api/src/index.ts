import { Account, RegisterRequest, RegisterResponse } from "@alldare/types";

// Configuration interface
export interface ApiConfig {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
}

export class AlldareApi {
  private static config: ApiConfig = {
    baseUrl: "http://localhost:80",
  };

  /**
   * Initialize the API client with configuration (e.g., base URL, token getter)
   */
  static init(config: ApiConfig) {
    this.config = { ...this.config, ...config };
  }

  private static async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    
    // Handle auth token if provided
    let authHeader: Record<string, string> = {};
    if (this.config.getToken) {
      const token = await this.config.getToken();
      if (token) {
        authHeader = { Authorization: `Bearer ${token}` };
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An unknown error occurred" }));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // --- Auth Endpoints ---

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async login(data: RegisterRequest): Promise<{ accessToken: string }> {
    return this.request<{ accessToken: string }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // --- SSO ---

  static getSsoUrl(clientId: string, redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "openid profile",
      state: state,
    });
    return `${this.config.baseUrl}/oauth2/authorize?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string, clientId: string, redirectUri: string): Promise<{ accessToken: string }> {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      client_id: clientId,
      redirect_uri: redirectUri,
    });

    const response = await fetch(`${this.config.baseUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // For public clients (mobile), no secret. For web, usually handled on server-side.
        // For this demo, we'll keep it simple.
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    return { accessToken: data.access_token };
  }

  static async me(): Promise<Account> {
    return this.request<Account>("/api/v1/auth/me");
  }

  // --- Health Check ---

  static async getStatus(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }

  // --- Posts Endpoints (Placeholders) ---

  static async getPosts(page = 0): Promise<any> {
    return this.request(`/api/v1/posts?page=${page}`);
  }

  static async createPost(postData: any): Promise<any> {
    return this.request("/api/v1/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  }
}
