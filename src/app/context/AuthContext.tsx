import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  role: "customer" | "staff";
  rewardPoints?: number;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
  isLoggedIn: boolean;
  isStaff: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => {
    setUser({ ...u, rewardPoints: u.rewardPoints ?? 0 });
  };

  const logout = () => {
    setUser(null);
  };

  const updatePoints = (points: number) => {
    setUser(prev => prev ? { ...prev, rewardPoints: points } : prev);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updatePoints,
      isLoggedIn: !!user,
      isStaff: user?.role === "staff",
      isCustomer: user?.role === "customer",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}