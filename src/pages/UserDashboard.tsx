import React from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Navigate } from "react-router-dom";

export default function UserDashboard() {
  const { data: identity, isLoading } = useGetIdentity<{ name?: string; role?: string }>();
  const { mutate: logout } = useLogout();

  if (isLoading) return <div className="p-4">Memuat...</div>;

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>User Dashboard</h1>
      <p>
        Selamat datang, <b>{identity?.name ?? "User"}</b>
      </p>

      <div style={{ marginTop: 16 }}>
        <div
          style={{
            padding: 12,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h3>Ringkasan Akun</h3>
          <p style={{ margin: 0 }}>
            Status akun: <b>Aktif</b>
          </p>
          <p style={{ margin: 0 }}>
            Hak akses: <b>{identity?.role}</b>
          </p>
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => logout()}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#e53e3e",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
