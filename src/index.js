/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { Auth0Provider } from '@auth0/auth0-react';

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { GlobalDataContextProvider } from "./context/DataContext";

ReactDOM.render(
  <Auth0Provider
    domain="dev-ig4v3eio87y70n0r.us.auth0.com"
    clientId="VF1MRW24zgNOk61tAqU9ZKXlCrDwo4Ks"
    // audience={"https://graficapublicar/auth"}
    // scope={"read:current_user update:current_user_metadata read:roles"}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <GlobalDataContextProvider>
          <App />
        </GlobalDataContextProvider>
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById("root")
);
