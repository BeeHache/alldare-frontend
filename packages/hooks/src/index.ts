import useSWR from "swr";
import { AlldareApi } from "@alldare/api";
import { RegisterRequest } from "@alldare/types";

export function useHealth() {
  const { data, error, isLoading } = useSWR("health", () => AlldareApi.getStatus());
  return {
    status: data,
    isLoading,
    isError: error,
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

  return {
    register,
  };
}
