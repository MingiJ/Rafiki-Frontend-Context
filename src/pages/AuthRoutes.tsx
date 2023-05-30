import { FC, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export const AuthRoutes: FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated()) {
    return <Navigate to="/log-in" />;
  }
  return <Outlet />;
};
