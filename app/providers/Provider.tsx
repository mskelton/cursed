"use client"

import { UserProvider } from "./UserProvider"

export function Provider({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}
