import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthListener } from "./useAuthListener";

export const ProtectedRoute = () => {
  const { loggedIn } = useAuthListener();
  return (
    <>
      {
        loggedIn
          ? <Outlet />
          : <Navigate to="/login" />
      }
    </>
  );
};
