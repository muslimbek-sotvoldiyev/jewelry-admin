// Simple authentication utilities
// TODO: Replace with proper authentication system

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "workshop"
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@jewelry.com",
    name: "Admin",
    role: "admin",
  },
]

export function getCurrentUser(): User | null {
  // TODO: Implement proper session management
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export function setCurrentUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
    window.location.href = "/login"
  }
}
