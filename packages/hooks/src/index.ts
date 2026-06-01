import useSWR from "swr";
import { AlldareApi } from "@alldare/api";
import { RegisterRequest } from "@alldare/types";

export * from "./auth/AuthProvider";

// --- Health ---

export function useHealth() {
  const { data, error, isLoading, mutate } = useSWR("health", () => AlldareApi.getStatus());
  return {
    status: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// --- Auth Hooks ---

export function useMe() {
  const { data, error, isLoading, mutate } = useSWR("auth/me", () => AlldareApi.me(), {
    shouldRetryOnError: false,
  });
  
  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAuth() {
  const register = async (data: RegisterRequest) => {
    try {
      return await AlldareApi.register(data);
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const login = async (data: RegisterRequest) => {
    try {
      const result = await AlldareApi.login(data);
      return result;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  return {
    register,
    login,
  };
}

// --- Posts ---

export function usePosts(page = 0) {
  const { data, error, isLoading } = useSWR(`posts?page=${page}`, () => AlldareApi.getPosts(page));
  
  return {
    posts: data,
    isLoading,
    isError: error,
  };
}
