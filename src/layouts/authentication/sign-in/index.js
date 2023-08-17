import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Navigate} from "react-router-dom";
import Button from "@mui/material/Button";

function Basic() {
  const { loginWithRedirect, logout, isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={'/'} />
  }

  return (
    <>
      <Button onClick={() => loginWithRedirect() }>
        Log In
      </Button>
      <Button onClick={()=> logout()}>
        Log Out
      </Button>
    </>
  );
}

export default Basic;
