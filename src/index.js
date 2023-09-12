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

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

Bugsnag.start({
  apiKey: '85df8e88f3d7e6035476d2513418d39b',
  plugins: [new BugsnagPluginReact()]
})

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

ReactDOM.render(
  <Auth0Provider
    domain="dev-ig4v3eio87y70n0r.us.auth0.com"
    clientId="VF1MRW24zgNOk61tAqU9ZKXlCrDwo4Ks"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <ErrorBoundary>
      <BrowserRouter>
        <MaterialUIControllerProvider>
          <GlobalDataContextProvider>
            <App />
          </GlobalDataContextProvider>
        </MaterialUIControllerProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </Auth0Provider>,
  document.getElementById("root")
);
