// import { useGetIdentity } from "@refinedev/core";
// import { Navigate } from "react-router-dom";
// import { ReactNode } from "react";

// export const AdminRoleGuard = ({ children }: { children: ReactNode }) => {
//   const { data: identity } = useGetIdentity();

//   if (identity?.role !== "admin") {
//     return <Navigate to="/user-dashboard" />;
//   }

//   return children;
// };

// export const UserRoleGuard = ({ children }: { children: ReactNode }) => {
//   const { data: identity } = useGetIdentity();

//   if (identity?.role !== "user") {
//     return <Navigate to="/admin-dashboard" />;
//   }

//   return children;
// };
