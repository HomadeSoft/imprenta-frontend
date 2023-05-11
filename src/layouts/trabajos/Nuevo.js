import MDBox from "components/MDBox";

import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
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
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Wrapper from "../Wrapper";

const Nuevo = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null);

  useEffect(() => {
  }, []);

  const [gramaje, setGramaje] = React.useState('');

  const handleChange = (event) => {
    setGramaje(event.target.value);
  };

  const paperTypes = [
    {label: "A4", value: "a4" },
    {label: "A3", value: "a3" },
    {label: "Troquelado", value: "troquelado" },
    {label: "Banner", value: "banner" },
    {label: "Sin Papel", value: "no_paper" }
  ]

  const gramajes = [
    { value: "350m", label: "350 Grs. Mate"},
    { value: "350b", label: "350 Grs. Brillante"},
    { value: "300m", label: "300 Grs. Mate"},
    { value: "300b", label: "300 Grs. Brillante"},
    { value: "250m", label: "250 Grs. Mate"},
    { value: "250b", label: "250 Grs. Brillante"},
    { value: "150m", label: "150 Grs. Mate"},
    { value: "150b", label: "150 Grs. Brillante"},
    { value: "115m", label: "115 Grs. Mate"},
    { value: "115b", label: "115 Grs. Brillante"},
    { value: "obra", label: "Obra 90 Grs."},
    { value: "autoadcs", label: "Autoad. con Split"},
    { value: "autoadss", label: "Autoad. sin Split"},
    { value: "OPPb", label: "OPP Blanco"},
    { value: "OPPt", label: "OPP Transparente"},
  ]

  return (
    <Wrapper title="Trabajo Nuevo">
        <>
          <CardContent>
            <MDBox mb={2} style={{display: "flex", flexDirection: 'row', gap: 5}}>
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
                          paperTypes.map((paperType) => (
                            <FormControlLabel value={paperType.value} control={<Radio />} label={paperType.label} />
                          ))
                        }
                      </RadioGroup>
                    </MDBox>
                  </Grid>
                  <Grid item xs={20} md={6} xl={8} mb={2}>
                    <MDBox mb={2}>
                      <MDBox display={"flex"} alignItems={"center"} gap={1}>
                        <FormLabel>Copias:</FormLabel>
                        <MDInput type="number" placeholder="Cantidad de Copias" />
                      </MDBox>
                    </MDBox>
                    <MDBox mb={2} display={"flex"} alignItems={"center"} gap={1}>
                      <FormLabel>Gramaje y Laminado:</FormLabel>
                      <FormControl sx={{ minWidth: 200 }}>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={gramaje}
                          sx={{ minHeight: 50 }}
                          label="gramaje"
                          onChange={handleChange}
                        >
                          {gramajes.map((gramaje) => (<MenuItem value={gramaje.value}>{gramaje.label}</MenuItem>))}
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
                      <FormControlLabel control={<Switch defaultChecked />} />
                    </MDBox>
                  </Grid>
                </Grid>
            </FormGroup>
          </CardContent>
          <CardActions>
            <MDButton color={"success"} style={{width: "50%", margin: "0 auto", maxWidth: 350, marginBottom: 30}}>
              Crear Trabajo
            </MDButton>
          </CardActions>
        </>
    </Wrapper>
  );
}

export default Nuevo;
