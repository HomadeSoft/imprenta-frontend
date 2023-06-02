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

import { useState } from "react";

// react-router-dom components

// @mui material components
import Grid from "@mui/material/Grid";

// @mui icons

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Authentication layout components

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import PageLayout from "../../../examples/LayoutContainers/PageLayout";
import Footer from "../components/Footer";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <PageLayout style={{ zIndex: 99 }}>
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            bgImage &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <div>
              Sign In
            </div>
          </Grid>
        </Grid>
      </MDBox>
      <Footer light />
    </PageLayout>
  );
}

export default Basic;
