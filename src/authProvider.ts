import { AuthProvider, OnErrorResponse } from "@refinedev/core";
import axios from "axios";

export const authProvider: AuthProvider = {
    // LOGIN
    login: async ({ username, password }) => {
        try {
            // Ambil user sesuai username & password dari db.json
            const res = await axios.get(
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

            // Simpan user ke localStorage
            localStorage.setItem("auth", JSON.stringify(user));

            return {
                success: true,
                redirectTo: "/", // Redirect ke Home (nanti auto redirect berdasarkan role)
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Terjadi kesalahan",
                    name: "Server error",
                },
            };
        }
    },

    // LOGOUT
    logout: async () => {
        localStorage.removeItem("auth");
        return {
            success: true,
            redirectTo: "/login",
        };
    },

    // CEK STATUS LOGIN
    check: async () => {
        const user = localStorage.getItem("auth");

        if (user) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            redirectTo: "/login",
        };
    },

    // MENGAMBIL IDENTITAS USER (untuk UI)
    getIdentity: async () => {
        const user = localStorage.getItem("auth");

        if (user) {
            return JSON.parse(user);
        }

        return null;
    },

    // MENGAMBIL ROLE USER
    getPermissions: async () => {
        const user = localStorage.getItem("auth");

        if (user) {
            const parsed = JSON.parse(user);
            return parsed.role; // <-- role: "admin" atau "user"
        }

        return null;
    },
    onError: function (error: any): Promise<OnErrorResponse> {
        throw new Error("Function not implemented.");
    }
};
