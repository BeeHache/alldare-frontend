"use client";

import { Button } from "@alldare/ui";
import { useHealth } from "@alldare/hooks";

export default function Home() {
  const { status, isLoading } = useHealth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-secondary">
      <h1 className="text-6xl font-bold text-primary">Alldare</h1>
      <p className="mt-4 text-xl text-white">Identity and Authorization Provider</p>
      
      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-white">
          Gateway Status: {isLoading ? "Checking..." : status?.status || "Offline"}
        </p>
        
        <Button 
          title="Get Started" 
          onPress={() => alert("Welcome to Alldare!")} 
          className="w-64"
        />
      </div>
    </main>
  );
}
