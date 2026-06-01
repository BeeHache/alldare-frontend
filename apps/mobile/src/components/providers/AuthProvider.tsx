import React from "react";
import { AuthProvider as SharedAuthProvider } from "@alldare/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mobileStorage = {
  getItem: async (key: string) => await AsyncStorage.getItem(key),
  setItem: async (key: string, value: string) => await AsyncStorage.setItem(key, value),
  removeItem: async (key: string) => await AsyncStorage.removeItem(key),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SharedAuthProvider storage={mobileStorage}>
      {children}
    </SharedAuthProvider>
  );
}
