"use client"

import { faker } from "@faker-js/faker"
import { createContext, useContext } from "react"

const username = `${faker.person.firstName()} ${faker.person.lastName()}`

export const UserContext = createContext(username)

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider value={username}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const username = useContext(UserContext)
  return { name: username }
}
