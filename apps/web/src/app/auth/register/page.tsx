"use client";

import React, { useState } from "react";
import { View, Text } from "react-native";
import { Input, Button, Card } from "@alldare/ui";
import { useAuth, useAuthContext } from "@alldare/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { login: setAuthSession } = useAuthContext();
  const router = useRouter();

  const handleRegister = async () => {
    if (!login || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register({ login, password });
      // For simplicity, we could auto-login here or redirect to login
      // Let's assume registration returns a success and we redirect to login
      router.push("/auth/login?registered=true");
    } catch (e: any) {
      setError(e.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-black min-h-screen">
      <Card className="w-full max-w-md">
        <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
        <Text className="text-slate-400 mb-8 text-base">Join the Alldare platform</Text>

        <Input
          label="Login (Username or Email)"
          value={login}
          onChangeText={setLogin}
          placeholder="Choose a login"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />

        {error ? (
          <Text className="text-red-500 mb-4 text-center text-sm">{error}</Text>
        ) : null}

        <Button
          title="Sign Up"
          onPress={handleRegister}
          loading={isLoading}
          className="mt-2"
        />

        <View className="mt-8 items-center">
          <Text className="text-slate-400 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500 font-bold">
              Sign In
            </Link>
          </Text>
        </View>
      </Card>
    </View>
  );
}
