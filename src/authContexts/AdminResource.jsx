import React from "react";
import {useAuth0} from "@auth0/auth0-react";

const AdminResource = ({children}) => {
  const { isAuthenticated, user } = useAuth0();
    return <>{
      isAuthenticated && (user.email === "juancriera94@gmail.com" || user.email === "monipublicar@hotmail.com")  ?
        children :
        null
    }</>
};

export default AdminResource;
