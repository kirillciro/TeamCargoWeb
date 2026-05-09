"use client";

import React, { createContext, useContext } from "react";
import { useAdminCustomizationState } from "./useAdminCustomizationState";
import type { Dictionary } from "@/lib/getDictionary";

type CtxValue = ReturnType<typeof useAdminCustomizationState>;

const AdminCustomizationCtx = createContext<CtxValue | null>(null);

export function AdminCustomizationProvider({
  children,
  dict,
  win98,
}: {
  children: React.ReactNode;
  dict: Dictionary;
  win98: boolean;
}) {
  const state = useAdminCustomizationState({ dict, win98 });
  return (
    <AdminCustomizationCtx.Provider value={state}>
      {children}
    </AdminCustomizationCtx.Provider>
  );
}

export function useAdminCustomization() {
  const ctx = useContext(AdminCustomizationCtx);
  if (!ctx)
    throw new Error(
      "useAdminCustomization must be used inside AdminCustomizationProvider",
    );
  return ctx;
}
