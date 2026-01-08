import type { AuthProvider } from "@refinedev/core";
import axios from "axios";

export const TOKEN_KEY = "auth";

const apiUrl = "http://localhost:3001";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      // Menambahkan <any[]> untuk memberi tahu TS bahwa data adalah array
      const response = await axios.get<any[]>(
        `${apiUrl}/users?username=${username}&password=${password}`
      );
      
      const user = response.data[0];

      if (user) {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(user));
        
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: "Login Error",
          message: "Username atau password salah",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "Server Error",
          message: error.message || "Terjadi kesalahan pada server",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const user = localStorage.getItem(TOKEN_KEY);
    if (user) {
      return { authenticated: true };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const user = localStorage.getItem(TOKEN_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.role; 
    }
    return null;
  },

  getIdentity: async () => {
    const user = localStorage.getItem(TOKEN_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      return {
        id: parsedUser.id,
        name: parsedUser.name,
        avatar: "https://i.pravatar.cc/300",
        role: parsedUser.role,
        nip: parsedUser.nip,
      };
    }
    return null;
  },

  onError: async (error) => {
    console.error("Auth Error:", error);
    return { error };
  },
};