import { AuthProvider } from "@refinedev/core";
import axios from "axios";

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        try {
            const res = await axios.get<any[]>(
                `http://localhost:3001/users?username=${username}&password=${password}`
            );

            const user = res.data[0];

            if (!user) {
                return {
                    success: false,
                    error: {
                        message: "Login gagal!",
                        name: "Username atau password salah",
                    },
                };
            }

            localStorage.setItem("auth", JSON.stringify(user));

            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Terjadi kesalahan server",
                    name: "Server error",
                },
            };
        }
    },

    logout: async () => {
        localStorage.removeItem("auth");
        return {
            success: true,
            redirectTo: "/login",
        };
    },

    check: async () => {
        const user = localStorage.getItem("auth");

        if (user) {
            return { authenticated: true };
        }

        return {
            authenticated: false,
            redirectTo: "/login",
        };
    },

    getIdentity: async () => {
        const user = localStorage.getItem("auth");
        return user ? JSON.parse(user) : null;
    },

    getPermissions: async () => {
        const user = localStorage.getItem("auth");
        return user ? JSON.parse(user).role : null;
    },

    // WAJIB ADA — untuk versi refine terbaru
    onError: async (error) => {
        console.error("Auth error:", error);
        return {
            error,
        };
    },
};
