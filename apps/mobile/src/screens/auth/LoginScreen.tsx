import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Input, Button, Card } from "@alldare/ui";
import { useAuth, useAuthContext } from "@alldare/hooks";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { AlldareApi } from "@alldare/api";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login: performLogin } = useAuth();
  const { login: setAuthSession } = useAuthContext();

  const discovery = {
    authorizationEndpoint: "http://localhost:80/oauth2/authorize",
    tokenEndpoint: "http://localhost:80/oauth2/token",
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "alldare-mobile",
      scopes: ["openid", "profile"],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "online.alldare",
        path: "auth",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      handleSsoCallback(code);
    }
  }, [response]);

  const handleSsoCallback = async (code: string) => {
    setIsLoading(true);
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "online.alldare",
        path: "auth",
      });
      const { accessToken } = await AlldareApi.exchangeCodeForToken(code, "alldare-mobile", redirectUri);
      await setAuthSession(accessToken);
    } catch (e) {
      Alert.alert("Error", "SSO Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await performLogin({ login, password });
      await setAuthSession(result.accessToken);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-black">
      <Card className="w-full">
        <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
        <Text className="text-slate-400 mb-8 text-base">Sign in to your Alldare account</Text>

        <Input
          label="Login"
          value={login}
          onChangeText={setLogin}
          placeholder="Enter your login"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

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
          onPress={() => promptAsync()}
          disabled={!request}
          className="mt-6"
        />
      </Card>
    </View>
  );
}
