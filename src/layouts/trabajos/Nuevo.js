import MDBox from "components/MDBox";

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CardActions, CardContent, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, MenuItem, Select, Switch } from "@mui/material";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Wrapper from "../Wrapper";
import DataService from "services/DataService";

import { useAuth0 } from "@auth0/auth0-react";
import moment from "moment";
import { useGlobalDataContext } from "context/DataContext";
import Legend from "../notifications/Legend";

const Nuevo = () => {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams()
  // eslint-disable-next-line no-unused-vars

  // NUEVA PARTE
  const [productos, setProductos] = useState();
  const [medidas, setMedidas] = useState();
  const [medida, setMedida] = useState();
  const [tipoPapeles, setTipoPapeles] = useState();
  const [troquelados, setTroquelados] = useState();



  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_ROOT || 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();
      DataService.fetchTroquelados(token).then((data) => {
        setTroquelados(data.data)
      })
      DataService.fetchAvailableProducts(token).then(
        (response) => {
          if (response.data !== '{}') {
            const productos = response.data;
            setProductos(productos);
            const medidasAux = getUniqueAttributeValues(productos, "medida");
            setMedidas(medidasAux);
            setMedida(medidasAux.find(m => m === "A3+"));
            const filteredProducts = productos?.filter(producto => producto.medida === "A3+");
            const tipoPapelesAux = getUniqueAttributeValues(
              filteredProducts,
              "tipo_papel"
            );
            setTipoPapeles(
              tipoPapelesAux
            );
          }
          setLoading(false);
        }
      );
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  // eslint-disable-next-line no-unused-vars
  // const [papel, setPapel] = useState('');
  // const [categoria, setCategoria] = useState();
  const [dobleFaz, setDobleFaz] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [dobleFazEnabled, setDobleFazEnabled] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [tipoPapel, setTipoPapel] = useState();
  const [troqueladoEnabled, setTroqueladoEnabled] = useState(false);
  const [laminadoEnabled, setLaminadoEnabled] = useState(false);
  const [troquelado, setTroquelado] = useState(false);
  const [laminado, setLaminado] = useState(false);
  const [notas, setNotas] = useState();

  const { user } = useGlobalDataContext();

  const handleTroqueladoChange = (event) => {
    setTroquelado(event.target.value);
  }

  const switchTroquelado = () => {
    setTroqueladoEnabled(troqueladoEnabled ? false : true);
  }

  const handleLaminadoChange = (event) => {
    setLaminado(event.target.value);
  }

  const switchLaminado = () => {
    setLaminadoEnabled(laminadoEnabled ? false : true);
  }
  const handleMedidaChange = (event) => {
    setMedida(event.target.value);
    const filteredProducts = productos?.filter(producto => producto.medida === event.target.value);
    const tipoPapelesAux = getUniqueAttributeValues(
      filteredProducts,
      "tipo_papel"
    );
    setTipoPapeles(
      tipoPapelesAux
    );
  }

  const handleTipoPapelChange = (event) => {
    setTipoPapel(event.target.value);
    setTroquelado(null);
    setTroqueladoEnabled(false);
    setLaminado(null);
    setLaminadoEnabled(false);
    productos?.find(producto => producto.tipoPapel === tipoPapel && producto.medida === medida && producto.doble_faz) ?
      setDobleFazEnabled(true) :
      setDobleFazEnabled(false);

  };

  const switchDobleFaz = () => {
    setDobleFaz(!dobleFaz);
  }

  const [selectedFile, setSelectedFile] = useState(null);

  const crearTrabajo = async () => {
    if (cantidad && tipoPapel) {
      setUploading(true);
      setLoading(true);

      const folder = user.id + "_" + user.fantasy_name + "_" + moment().format('DD-MM-YYYY') + "/";
      setMessage("Se está subiendo el archivo adjunto. No cierre esta ventana")

      const { data, error } = await DataService.uploadToServer(selectedFile, folder);

      if (error) {
        setMessage(error)
        setUploading(false);
        setLoading(false);
        return
      }

      const trabajo = {
        "copies_quantity": cantidad,
        "doble_faz": dobleFaz ? true : false,
        // "paper_size": categoria?.printSize,
        "paper_size": medida,
        "paper_type": tipoPapel,
        "status": "pending",
        "user_id": user.id,
        "troquelado": troquelado,
        "laminado": laminado,
        "file_names": [folder + data?.fileName],
        "notes": notas
      }

      const token = await getAccessTokenSilently();
      setMessage("Se está procesando el archivo. No cierre esta ventana")

      const { error: jobError } = await DataService.submitJob(token, trabajo);
      if (jobError) {
        setMessage(jobError)
        setUploading(false);
        setLoading(false);
        return
      }

      setMessage("Procesando...")
      setTimeout(() => {
        setMessage(null)
        navigate("/")
      }, 3000)
    }
  }

  const allPropertiesSelected = () => {
    return (
      cantidad &&
      tipoPapel &&
      medida
    )
  }

  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <Navigate to={'/login'} />
  }

  /** File upload tests */

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  function getUniqueAttributeValues(objects, attributeName) {
    const uniqueValuesSet = new Set();

    objects.forEach(object => {
      if (object.hasOwnProperty(attributeName)) {
        uniqueValuesSet.add(object[attributeName]);
      }
    });

    const uniqueValuesArray = Array.from(uniqueValuesSet);
    return uniqueValuesArray;
  }


  return (
    <Wrapper title="Trabajo Nuevo" loading={loading}>
      <>
        <CardContent >
          <FormGroup >
            <Grid container display={"flex"} alignItems={"center"} justifyContent={"center"} width={"100%"}>
              <Grid item xs={20} md={6} xl={8} mb={2}>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={2} >
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }} id="tipo-papel-label">Medida Papel:</FormLabel>
                  <FormControl sx={{ minWidth: 200 }} style={{ flex: 1 }}>
                    <Select
                      labelId="tipo-papel-label"
                      id="tipo-papel-select"
                      value={medida}
                      defaultValue="A3+"
                      sx={{ minHeight: 50 }}
                      label="papel"
                      onChange={handleMedidaChange}
                    >
                      {
                        medidas?.map(
                          (medida) => {
                            return (
                              <MenuItem
                                value={medida}
                              >{medida}</MenuItem>
                            )
                          }
                        )

                      }
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2} display={"flex"} alignItems={"center"} gap={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Tipo de Papel:</FormLabel>
                  <FormControl sx={{ minWidth: 200 }} style={{ flex: 1 }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={tipoPapel}
                      sx={{ minHeight: 50 }}
                      label="papel"
                      onChange={handleTipoPapelChange}
                    >
                      {
                        tipoPapeles?.map((tipoPapel) => {
                          return (<MenuItem value={tipoPapel} >
                            {
                              tipoPapel
                            }
                          </MenuItem>)
                        })
                      }
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2} display={{ display: productos?.find(producto => producto.tipo_papel === tipoPapel && producto.medida === medida && producto.troquelado) ? "flex" : "none" }} alignItems={"center"} gap={2} >
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Troquelado:</FormLabel>
                  <FormControlLabel
                    control={
                      <Switch checked={troqueladoEnabled} onChange={switchTroquelado} />}
                    style={{ flex: 1 }}
                  />
                </MDBox>
                <MDBox mb={2} display={{ display: troqueladoEnabled ? "flex" : "none" }} alignItems={"center"} gap={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Troquelado:</FormLabel>
                  <FormControl sx={{ minWidth: 200 }} style={{ flex: 1 }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={troquelado}
                      sx={{ minHeight: 50 }}
                      label="papel"
                      onChange={handleTroqueladoChange}
                    >
                      {/* <MenuItem value="elemento1">Elemento 1</MenuItem> */}
                      {

                        troquelados?.map((troquelado) => (
                          <MenuItem value={troquelado.descripcion} >
                            {
                              troquelado.descripcion
                            }
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2} display={{ display: productos?.find(producto => producto.tipo_papel === tipoPapel && producto.medida === medida && producto.laminado) ? "flex" : "none" }} alignItems={"center"} gap={2} >
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Laminado:</FormLabel>
                  <FormControlLabel
                    control={
                      <Switch checked={laminadoEnabled} onChange={switchLaminado} />}
                    style={{ flex: 1 }}
                  />
                </MDBox>
                <MDBox mb={2} display={{ display: laminadoEnabled ? "flex" : "none" }} alignItems={"center"} gap={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Laminado:</FormLabel>
                  <FormControl sx={{ minWidth: 200 }} style={{ flex: 1 }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={laminado}
                      sx={{ minHeight: 50 }}
                      label="papel"
                      onChange={handleLaminadoChange}
                    >

                      <MenuItem value="mate 1/0" >Mate 1/0</MenuItem>
                      <MenuItem value="mate 1/1" >Mate 1/1</MenuItem>
                      <MenuItem value="brillante 1/0" >Brillante 1/0</MenuItem>
                      <MenuItem value="brillante 1/1" >Brillante 1/1</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2} display={{ display: productos?.find(producto => producto.tipo_papel === tipoPapel && producto.medida === medida && producto.doble_faz) ? "flex" : "none" }} alignItems={"center"} gap={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>Doble faz:</FormLabel>
                  <FormControlLabel
                    control={
                      <Switch checked={dobleFaz} onChange={switchDobleFaz} />
                    }
                    style={{ flex: 1 }}
                  />
                </MDBox>
                <MDBox display={"flex"} alignItems={"center"} gap={2} mb={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>
                    Cantidad de Copias por Pagina:
                  </FormLabel>
                  <MDInput type="number"
                    placeholder="Cantidad de Copias"
                    disabled={medida === null}
                    value={cantidad}
                    onChange={(event) => {
                      setCantidad(event.target.value);
                    }}
                    style={{ flex: 1 }}
                  />
                </MDBox>
                <MDBox display={"flex"} alignItems={"center"} gap={2} mb={2}>
                  <FormLabel style={{ flex: 0.7, textAlign: "end" }}>
                    Notas adicionales:
                  </FormLabel>
                  <MDInput type="text"
                    placeholder="Aclaraciones adicionales"
                    disabled={medida === null}
                    value={notas}
                    multiline
                    rows={4}
                    onChange={(event) => {
                      setNotas(event.target.value);
                    }}
                    style={{ flex: 1 }}
                  />
                </MDBox>
                <br />
                <MDBox style={{
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <MDInput type="file" onChange={handleFileChange} />
                </MDBox>
                <MDButton
                  style={{
                    width: "50%", margin: "0 auto", maxWidth: 350, marginBottom: 20, display: "flex", justifyContent: "center"
                  }}
                  href={`${BASE_URL}/upload/priceList`}
                >
                  Descargar lista de precios
                </MDButton>
              </Grid>
            </Grid>
          </FormGroup>
        </CardContent>
        <CardActions>
          <MDButton
            color={"success"}
            style={{ width: "50%", margin: "0 auto", maxWidth: 350, marginBottom: 30 }}
            onClick={crearTrabajo}
            disabled={!allPropertiesSelected() || uploading}
          >
            Crear Trabajo
          </MDButton>
        </CardActions>
        <Legend message={message} setMessage={setMessage} />
      </>
    </Wrapper >
  );
}



export default Nuevo;
