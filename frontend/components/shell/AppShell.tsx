"use client";

import { useUserStore } from "@/stores/user-store";
import AppHeader from "./AppHeader";
import ProductRail from "./ProductRail";
import { useEffect, useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-[#0B5CFF] rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4">
             Z
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      <AppHeader user={user} />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-68px)]">
        <ProductRail />
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
