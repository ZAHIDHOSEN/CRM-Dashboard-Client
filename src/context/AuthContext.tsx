/* eslint react-refresh/only-export-components: ["warn", { allowConstantExport: true }] */
import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearUser, setUser } from "../redux/features/auth/authSlice";
import type { IUser } from "../redux/features/auth/authSlice";
import { useGetMeQuery } from "../redux/features/auth/authApi";
import { useLogoutMutation } from "../redux/features/auth/authApi";

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Exporting the context so a separate hook file can read it if you choose Option A
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  // RTK Query handles fetching
  const { data, isLoading, isSuccess, isError } = useGetMeQuery(undefined);

  // Replaces the broken component-level onQueryStarted
  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUser(data.data)); 
    }
    
    if (isError) {
      dispatch(clearUser()); 
    }
  }, [isSuccess, isError, data, dispatch]);

  const logout = async () => {
    try {
      await logoutApi(undefined).unwrap();
    } catch (error) {
      // Fixed: Log the error instead of completely ignoring it
      console.error("Logout failed on server:", error); 
    } finally {
      // Always clear local state even if the network request fails
      dispatch(clearUser());
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Allowed here now due to the ESLint rule configuration at line 1
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be inside AuthProvider");
  }
  return ctx;
}