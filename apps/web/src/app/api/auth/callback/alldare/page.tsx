"use client";

import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuthContext } from "@alldare/hooks";
import { AlldareApi } from "@alldare/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function SsoCallbackPage() {
  const { login } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      if (code) {
        try {
          const clientId = "alldare-web";
          const redirectUri = "http://localhost:3000/api/auth/callback/alldare";
          const { accessToken } = await AlldareApi.exchangeCodeForToken(code, clientId, redirectUri);
          await login(accessToken);
          router.push("/");
        } catch (error) {
          console.error("SSO Callback failed", error);
          router.push("/auth/login?error=sso_failed");
        }
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <View className="flex-1 items-center justify-center p-4 bg-black min-h-screen">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-white mt-4 font-semibold">Completing sign in...</Text>
    </View>
  );
}
