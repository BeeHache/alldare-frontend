"use client";

import React from "react";
import { AuthProvider as SharedAuthProvider } from "@alldare/hooks";

const webStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SharedAuthProvider storage={webStorage}>
      {children}
    </SharedAuthProvider>
  );
}
