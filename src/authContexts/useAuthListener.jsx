import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

export const useAuthListener = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      setCheckingStatus(true)
    } else {
      if(isAuthenticated){
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
      setCheckingStatus(false)

    }
    // setCheckingStatus(false);
    // setLoggedIn(true);

  }, [isAuthenticated, isLoading]);

  return { loggedIn, checkingStatus };
};
