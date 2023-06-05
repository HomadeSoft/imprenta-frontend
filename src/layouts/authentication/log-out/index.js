import {useAuth0} from "@auth0/auth0-react";
import Button from "@mui/material/Button";

function Basic() {
  const { logout } = useAuth0();

  return (
      <Button onClick={()=> logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </Button>
    );
}

export default Basic;
