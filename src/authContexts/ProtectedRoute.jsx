import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthListener } from "./useAuthListener";

export const ProtectedRoute = () => {
  const { loggedIn, checkingStatus } = useAuthListener();
  return (
    <>
      {
        checkingStatus
          ? <div>LOADING </div>
          : ( loggedIn
            ? <Outlet />
            : <Navigate to="/login" />)
      }
    </>
  );
};
