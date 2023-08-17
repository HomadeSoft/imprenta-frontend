import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import AuthService from "./AuthService";

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <>
      {
        isAuthenticated && AuthService.isAdmin(user.email)
          ? <Outlet />
          : <Navigate to="/login" />
      }
    </>
  );
};

export default AdminRoute;
