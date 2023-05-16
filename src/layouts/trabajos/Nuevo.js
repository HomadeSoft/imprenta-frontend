import MDBox from "components/MDBox";

import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MDTypography from "../../components/MDTypography";
import {
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch
} from "@mui/material";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Wrapper from "../Wrapper";
import bajadasSinPapel from "layouts/precios/data/bajadasSinPapel";

const Nuevo = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null);
  const categorias = bajadasSinPapel();
  useEffect(() => {
  }, []);

  const [papel, setPapel] = React.useState('');
  const [opcion, setOpcion] = React.useState('');
  const [categoria, setCategoria] = React.useState(null);
  const [dobleFaz, setDobleFaz] = React.useState(false);
  const [dobleFazEnabled, setDobleFazEnabled] = React.useState(false);
  const [cantidad, setCantidad] = React.useState(0);
  const [precio, setPrecio] = React.useState(0);
  const [archivos, setArchivos] = React.useState(null);
  const handleChange = (event) => {
    setPapel(event.target.value);
  };



  const switchDobleFaz = () => {
    setDobleFaz(!dobleFaz);
  }

  const updatePrice = () => {
    if (papel && cantidad && opcion) {

      let cantidadSeleccionada = papel.quantities.find((quantity) => quantity.min <= cantidad <= quantity.max);
      let precioUnitario = (!dobleFazEnabled && dobleFaz) ?
        cantidadSeleccionada.options.find((opcion) => opcion.description === "4/4") :
        cantidadSeleccionada.options.find(opcion => opcion.description === ("4/0"));
      setPrecio(parseInt(precioUnitario.value.replace(/[^0-9]/g, "")) * cantidad);
    }
  }
  const handleOptionChange = (event) => {
    setOpcion(event.target.value);
    let valorNuevo = papel.quantities[0].options.map(option => (option.description === '4/4')).includes(true);
    setDobleFaz(false)
    setDobleFazEnabled(!valorNuevo);
  };

  const handleFileChange = (e) => {
    setArchivos(e.target.files);
  };

  const crearTrabajo = () => {
    if (cantidad && opcion) {
      //TODO: Submit work
    }
  }
  return (
    <Wrapper title="Trabajo Nuevo">
      <>
        <CardContent>
          <MDBox mb={2} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>
            <MDTypography variant="h6" component="div">Usuario:</MDTypography>
            <MDTypography variant="body2">Juan Cruz</MDTypography>
          </MDBox>

          <FormGroup>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4} spacing={1}>
                <MDBox mb={2}>
                  <FormLabel id="tipo-papel-label">Tipo de Papel</FormLabel>
                  <RadioGroup aria-labelledby="tipo-papel-label" name="tipo-papel">
                    {
                      categorias.map((categoria) => (
                        <FormControlLabel value={categoria.printSize} control={<Radio />} label={categoria.printSize} onClick={() => { setCategoria(categoria); setPapel(null); }} />
                      ))
                    }
                  </RadioGroup>
                </MDBox>
              </Grid>
              <Grid item xs={20} md={6} xl={8} mb={2}>
                <MDBox mb={2}>
                  <MDBox display={"flex"} alignItems={"center"} gap={1}>
                    <FormLabel>Copias:</FormLabel>
                    <MDInput type="number" placeholder="Cantidad de Copias" value={cantidad}
                      onChange={(event) => {
                        setCantidad(event.target.value);
                      }} />
                  </MDBox>
                </MDBox>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={1}>
                  <FormLabel>Gramaje:</FormLabel>
                  <FormControl sx={{ minWidth: 200 }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={papel}
                      sx={{ minHeight: 50 }}
                      label="papel"
                      onChange={handleChange}
                    >
                      {categoria ? categoria.papel.map((papel) => (<MenuItem value={papel}>{papel.gramaje ? papel.gramaje : "Sin Papel"}</MenuItem>)) : null}
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={1}>
                  <FormLabel>Opcion de impresion:</FormLabel>
                  <FormControl sx={{ minWidth: 200 }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={opcion}
                      sx={{ minHeight: 50 }}
                      label="opcion"
                      onChange={handleOptionChange}
                    >
                      {papel && papel.caracteristicas.length > 0 ? papel.caracteristicas.map((caracteristica) => (<MenuItem value={caracteristica}>{caracteristica}</MenuItem>)) : <MenuItem value='NA'>N/A</MenuItem>}
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={1}>
                  <FormLabel>Fecha limite de entrega:</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker />
                  </LocalizationProvider>
                </MDBox>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={1}>
                  <FormLabel >Doble faz:</FormLabel>
                  <FormControlLabel

                    control={
                      dobleFazEnabled ?
                        <Switch disabled={true} checked={false} /> :
                        <Switch checked={dobleFaz} onChange={switchDobleFaz} />} />
                </MDBox>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={1}>
                  <FormLabel>Total: ${precio}</FormLabel>
                  <MDButton color={"primary"}
                    onClick={() => { updatePrice() }}
                    style={{ width: "15%", margin: "0 auto", maxWidth: 350 }}
                  >
                    Calcular
                  </MDButton>
                </MDBox>
                <MDBox>
                  <MDButton
                    color={"primary"}
                    style={{ width: "20%", margin: "0 auto", maxWidth: 350 }}
                    variant="contained"
                    component="label"
                  >
                    Subir Archivo
                    <input type="file" onChange={handleFileChange} hidden multiple />
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
          </FormGroup>
        </CardContent>
        <CardActions>
          <MDButton color={"success"} style={{ width: "50%", margin: "0 auto", maxWidth: 350, marginBottom: 30 }} onClick={crearTrabajo}>
            Crear Trabajo
          </MDButton>
        </CardActions>
      </>
    </Wrapper>
  );
}



export default Nuevo;
