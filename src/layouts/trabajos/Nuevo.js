import MDBox from "components/MDBox";

import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
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
import DataService from "services/DataService";
import DeleteIcon from '@mui/icons-material/Delete';

import Dropzone, { useDropzone } from 'react-dropzone'

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
  const [fechaHasta, setFechaHasta] = React.useState(null);
  const [archivos, setArchivos] = React.useState([]);
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

  ////////////////// START OF FILE MANAGER //////////////////
  ////////////////// START OF FILE MANAGER //////////////////
  ////////////////// START OF FILE MANAGER //////////////////
  ////////////////// START OF FILE MANAGER //////////////////
  ////////////////// START OF FILE MANAGER //////////////////

  const [myFiles, setMyFiles] = useState([])

  const onDrop = useCallback(acceptedFiles => {
    setMyFiles([...myFiles, ...acceptedFiles])
  }, [myFiles])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  const removeFile = file => () => {
    const newFiles = [...myFiles]
    newFiles.splice(newFiles.indexOf(file), 1)
    setMyFiles(newFiles)
  }

  const removeAll = () => {
    setMyFiles([])
  }

  const files = myFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes{" "}
      <MDButton onClick={removeFile(file)} size="medium" iconOnly><DeleteIcon /></MDButton>
    </li>
  ))

  ////////////////// END OF FILE MANAGER //////////////////
  ////////////////// END OF FILE MANAGER //////////////////
  ////////////////// END OF FILE MANAGER //////////////////
  ////////////////// END OF FILE MANAGER //////////////////
  ////////////////// END OF FILE MANAGER //////////////////


  const crearTrabajo = () => {
    if (cantidad && opcion) {
      const trabajo = {
        "copies_quantity": cantidad,
        "doble_faz": dobleFaz,
        "due_date": fechaHasta,
        "gramaje_laminado": papel.gramaje + " " + opcion,
        "paper_type": categoria.printSize,
        "status": "pending",
        "total_price_cents": precio * 100,
        "user_id": 1,
      }
      DataService.submitJob(trabajo);
    }
  }

  const allPropertiesSelected = () => {
    return (
      cantidad &&
      papel?.gramaje &&
      opcion &&
      categoria?.printSize &&
      precio
    )
  }

  const handleDetailsStyles = () => {
    if (categoria) {
      return ({ opacity: 1 })
    } else {
      return ({ opacity: 0.3, pointerEvents: 'none' })
    }
  }

  return (
    <Wrapper title="Trabajo Nuevo">
      <>
        <CardContent>
          {/*<MDBox mb={2} style={{ display: "flex", flexDirection: 'row', gap: 5 }}>*/}
          {/*  <MDTypography variant="h6" component="div">Usuario:</MDTypography>*/}
          {/*  <MDTypography variant="body2">Juan Cruz</MDTypography>*/}
          {/*</MDBox>*/}

          <FormGroup>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4} spacing={1}>
                <MDBox mb={2}>
                  <FormLabel id="tipo-papel-label">Tipo de Papel</FormLabel>
                  <RadioGroup aria-labelledby="tipo-papel-label" name="tipo-papel">
                    {
                      categorias.map((categoria) => (
                        <FormControlLabel
                          value={categoria.printSize}
                          control={<Radio />}
                          label={categoria.printSize}
                          onClick={() => {
                            setCategoria(categoria);
                            setPrecio(0)
                            setPapel(null);
                          }}
                        />
                      ))
                    }
                  </RadioGroup>
                </MDBox>
              </Grid>

              <Grid item xs={20} md={6} xl={8} mb={2} style={handleDetailsStyles()}>
                <MDBox display={"flex"} alignItems={"center"} gap={2} mb={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>
                    Copias:
                  </FormLabel>
                  <MDInput type="number"
                    placeholder="Cantidad de Copias"
                    disabled={categoria === null}
                    value={cantidad}
                    onChange={(event) => {
                      setCantidad(event.target.value);
                    }}
                    style={{ flex: 1 }}
                  />
                </MDBox>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Gramaje:</FormLabel>
                  <FormControl sx={{ minWidth: 200 }} style={{ flex: 1 }}>
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
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Opcion de impresion:</FormLabel>
                  <FormControl sx={{ minWidth: 200 }} style={{ flex: 1 }}>
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
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Fecha limite de entrega (opcional):</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}
                    style={{ flex: 1 }} >
                    <DatePicker onChange={() => { setFechaHasta() }} sx={{ flex: 1 }} style={{ flex: 1 }} />
                  </LocalizationProvider>
                </MDBox>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Doble faz:</FormLabel>
                  <FormControlLabel
                    control={
                      dobleFazEnabled ?
                        <Switch disabled={true} checked={false} /> :
                        <Switch checked={dobleFaz} onChange={switchDobleFaz} />}
                    style={{ flex: 1 }}
                  />
                </MDBox>
                <br />
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={2}>
                  <MDButton color={"primary"}
                    onClick={() => { updatePrice() }}
                    style={{ flex: 0.6 }}
                  >
                    Calcular Total:
                  </MDButton>
                  <FormLabel style={{ flex: 1, textAlign: "start" }}>${precio}</FormLabel>
                </MDBox>
                <MDBox>
                  {/*<MDButton*/}
                  {/*  color={"primary"}*/}
                  {/*  style={{ width: "20%", margin: "0 auto", maxWidth: 350 }}*/}
                  {/*  variant="contained"*/}
                  {/*  component="label"*/}

                  {/*>*/}
                  {/*  Subir Archivo*/}
                  {/*  <input type="file" onChange={handleFileChange} hidden multiple />*/}
                  {/*</MDButton>*/}
                  {/*<MDBox>*/}
                  {/*  {*/}
                  {/*    Array.from(archivos).map(file => {*/}

                  {/*      return (*/}
                  {/*        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10}}>*/}
                  {/*          <div>{file.name}</div>*/}
                  {/*          <div style={{cursor: "pointer"}}*/}
                  {/*               onClick={() => { removeFileFromFileList(file.name)}}>*/}
                  {/*            X*/}
                  {/*          </div>*/}
                  {/*        </div>*/}

                  {/*      )*/}
                  {/*    })*/}
                  {/*  }*/}
                  {/*</MDBox>*/}

                  <section className="container" style={{ padding: 20, border: '1px dotted' }}>
                    <div {...getRootProps({ className: "dropzone" })}>
                      <input {...getInputProps()} />
                      <p>Arrastrá o hace click para subir archivos</p>
                    </div>
                    <aside>
                      <h4>Archivos</h4>
                      <ul>{files}</ul>
                    </aside>
                    {files.length > 0 && <MDButton onClick={removeAll} color="error"><DeleteIcon /> Borrar todos</MDButton>}
                  </section>
                </MDBox>
              </Grid>
            </Grid>
          </FormGroup>
        </CardContent>
        <CardActions>
          <MDButton
            color={"success"}
            style={{ width: "50%", margin: "0 auto", maxWidth: 350, marginBottom: 30 }}
            onClick={crearTrabajo}
            disabled={!allPropertiesSelected()}
          >
            Crear Trabajo
          </MDButton>
        </CardActions>
      </>
    </Wrapper>
  );
}



export default Nuevo;
