"use client";

import React, { useState } from "react";
import { View, Text } from "react-native";
import { Input, Button, Card } from "@alldare/ui";
import { useAuth, useAuthContext } from "@alldare/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login: performLogin } = useAuth();
  const { login: setAuthSession } = useAuthContext();
  const router = useRouter();

  const handleLogin = async () => {
    if (!login || !password) {
      setError("Please enter your login and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await performLogin({ login, password });
      await setAuthSession(result.accessToken);
      router.push("/");
    } catch (e: any) {
      setError(e.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-black min-h-screen">
      <Card className="w-full max-w-md">
        <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
        <Text className="text-slate-400 mb-8 text-base">Sign in to your Alldare account</Text>

        <Input
          label="Login (Username or Email)"
          value={login}
          onChangeText={setLogin}
          placeholder="Enter your login"
          error={error && !login ? "Required" : ""}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={error && !password ? "Required" : ""}
        />

        {error ? (
          <Text className="text-red-500 mb-4 text-center text-sm">{error}</Text>
        ) : null}

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          className="mt-2"
        />

        <View className="mt-8 flex-row justify-center items-center">
          <View className="h-[1px] flex-1 bg-slate-800" />
          <Text className="mx-4 text-slate-500 text-xs">OR CONTINUE WITH</Text>
          <View className="h-[1px] flex-1 bg-slate-800" />
        </View>

        <Button
          title="Sign in with SSO"
          variant="outline"
          onPress={() => {
            const clientId = "alldare-web";
            const redirectUri = "http://localhost:3000/api/auth/callback/alldare";
            const state = Math.random().toString(36).substring(7);
            const url = `http://localhost:80/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile&state=${state}`;
            window.location.href = url;
          }}
          className="mt-6"
        />

        <View className="mt-8 items-center">
          <Text className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-500 font-bold">
              Sign Up
            </Link>
          </Text>
        </View>
      </Card>
    </View>
  );
}
