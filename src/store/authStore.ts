
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, LoginFormData, RegisterFormData } from "@/lib/types";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (data: LoginFormData) => {
        set({ isLoading: true });
        try {
          const token = await authApi.login(data.email, data.password);
          
          // In a real app, you would decode the JWT to get user info
          // For this demo, we'll create a mock user
          const user: User = {
            id: "1",
            name: "Demo User",
            email: data.email,
            token,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          toast.success("Login successful");
        } catch (error) {
          set({ isLoading: false });
          toast.error(error instanceof Error ? error.message : "Login failed");
        }
      },
      
      register: async (data: RegisterFormData) => {
        set({ isLoading: true });
        try {
          const token = await authApi.register(
            data.name,
            data.email,
            data.password,
            data.phone
          );
          
          // Create a mock user with the registered info
          const user: User = {
            id: "1",
            name: data.name,
            email: data.email,
            token,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          toast.success("Registration successful");
        } catch (error) {
          set({ isLoading: false });
          toast.error(error instanceof Error ? error.message : "Registration failed");
        }
      },
      
      logout: () => {
        authApi.logout();
        set({ 
          user: null, 
          isAuthenticated: false 
        });
        toast.success("Logged out successfully");
      },
      
      checkAuthStatus: () => {
        const isAuth = authApi.checkAuth();
        set({ isAuthenticated: isAuth });
        return isAuth;
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);
