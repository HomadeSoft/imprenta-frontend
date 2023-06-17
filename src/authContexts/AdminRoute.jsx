import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <>
      {
        isAuthenticated && (user.email === "juancriera94@gmail.com" || user.email === "monipublicar@hotmail.com" || user.email === "gpublicar@hotmail.com")
          ? <Outlet />
          : <Navigate to="/login" />
      }
    </>
  );
};

export default AdminRoute;
