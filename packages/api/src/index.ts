import { RegisterRequest, RegisterResponse } from "@alldare/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80";

export class AlldareApi {
  private static async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }));
      throw new Error(error.message || response.statusText);
    }

    return response.json();
  }

  static register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static getStatus(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }
}
