"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initAuth } = useUserStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
}
