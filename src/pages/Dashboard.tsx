import { useGetIdentity, useLogout } from "@refinedev/core";

const Dashboard = () => {
  const { data: identity } = useGetIdentity();
  const { mutate: logout } = useLogout();

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
      gap: "16px",
      fontFamily: "Arial"
    }}>
      <h1>Dashboard</h1>

      <p>Selamat datang, <b>{identity?.name}</b></p>
      <p>Role Anda: <b>{identity?.role}</b></p>

      <button
        onClick={() => logout()}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#ff4444",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
