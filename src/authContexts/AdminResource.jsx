import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import AuthService from "./AuthService";

const AdminResource = ({children}) => {
  const { isAuthenticated, user } = useAuth0();
    return (
      <>
        {
        isAuthenticated && AuthService.isAdmin(user.email)
          ? children
          : null
        }
      </>
    )
};

export default AdminResource;
