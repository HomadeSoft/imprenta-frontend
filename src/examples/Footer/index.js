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

// prop-types is a library for typechecking of props
import MDBox from "components/MDBox";
import colors from "../../assets/theme/base/colors";

const ColorBox = ({color}) => {
  return (
    <div style={{
      content: '',
      height: 20,
      width: 20,
      backgroundColor: color,
      borderRadius: 5
    }}></div>
  )
}

function Footer() {
  return (
    <MDBox
      width="100%"
      display="flex"
      flexDirection={"row"}
      alignItems="center"
      gap={3}
      fontSize={14}
      marginTop={2}
    >
      <div>Estado de Pedidos |</div>
      <div style={{display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <div style={{marginRight: 5}}>En Espera:</div>
        <ColorBox color={colors.jobRows.pending}/>
      </div>
      <div style={{display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <div style={{marginRight: 5}}>Procesado:</div>
        <ColorBox color={colors.jobRows.in_progress}/>
      </div>
      <div style={{display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <div style={{marginRight: 5}}>Con Problemas:</div>
        <ColorBox color={colors.jobRows.cancelled}/>
      </div>
      <div style={{display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <div style={{marginRight: 5}}>Finalizado:</div>
        <ColorBox color={colors.jobRows.finished}/>
      </div>
    </MDBox>
  );
}


export default Footer;
