import React from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { data: identity, isLoading } = useGetIdentity<{ name?: string; role?: string }>();
  const { mutate: logout } = useLogout();

  if (isLoading) return <div className="p-4">Memuat...</div>;

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Admin Dashboard</h1>
      <p>
        Selamat datang, <b>{identity?.name ?? "Admin"}</b>
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        <div
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h3>Pengguna Terdaftar</h3>
          <p style={{ fontSize: 24, margin: 0 }}>1,234</p>
        </div>
        <div
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h3>Transaksi Hari Ini</h3>
          <p style={{ fontSize: 24, margin: 0 }}>56</p>
        </div>
        <div
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <h3>Notifikasi</h3>
          <p style={{ fontSize: 24, margin: 0 }}>3</p>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
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
  );
}
