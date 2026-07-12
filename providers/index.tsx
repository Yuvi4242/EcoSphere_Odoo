"use client";

import React from "react";
import { AuthProvider } from "@/context/auth-context";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Composite wrapper for all global client-side providers.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
