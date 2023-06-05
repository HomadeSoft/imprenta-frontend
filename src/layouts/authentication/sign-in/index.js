import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";

function Basic() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect()
  }, [])

  return (<></>);
}

export default Basic;
