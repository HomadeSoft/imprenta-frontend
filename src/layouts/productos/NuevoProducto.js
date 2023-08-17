import { CardActions, CardContent, FormControlLabel, FormGroup, FormLabel, Grid, Switch } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Wrapper from "layouts/Wrapper";
import { useState } from "react";
import DataService from "services/DataService";

const NuevoProducto = () => {

    const [medidaPapel, setMedidaPapel] = useState("");
    const [tipoPapel, setTipoPapel] = useState("");
    const [dobleFazEnabled, setDobleFazEnabled] = useState(false);
    const [troqueladoEnabled, setTroqueladoEnabled] = useState(false);
    const [laminadoEnabled, setLaminadoEnabled] = useState(false);

    const switchDobleFazEnabled = () => {
        setDobleFazEnabled(!dobleFazEnabled);
    }
    const switchTroqueladoEnabled = () => {
        setTroqueladoEnabled(!troqueladoEnabled);
    }

    const switchLaminadoEnabled = () => {
        setLaminadoEnabled(!laminadoEnabled);
    }

    const allPropertiesFilled = () => {
        return (
            medidaPapel.length > 0 && tipoPapel.length > 0
        )
    }

    const crearProducto = async () => {
        //TODO: Invoke async method
        const producto = {
            "medida": medidaPapel,
            "doble_faz": dobleFazEnabled,
            "troquelado": troqueladoEnabled,
            "laminado": laminadoEnabled,
            "tipo_papel": tipoPapel
        }

        await DataService.createProduct(producto);

    }


    return (
        <Wrapper title={"Nuevo Producto"}>
            <>
                <CardContent>
                    <FormGroup>
                        <Grid container alignSelf={"center"} alignContent={"center"} alignItems={"center"} justifyContent={"center"} width={"50%"} columns={4} >
                            <Grid item xs={2} >
                                <FormLabel >
                                    Medida de Papel:
                                </FormLabel>
                            </Grid>
                            <Grid item xs={2}>
                                <MDInput type="text"
                                    value={medidaPapel}
                                    onChange={(event) => {
                                        setMedidaPapel(event.target.value);
                                    }}
                                ></MDInput>
                            </Grid>
                            <Grid item xs={2}>
                                <FormLabel style={{ flex: 0.7, textAlign: "end" }}>
                                    Tipo de Papel:
                                </FormLabel>
                            </Grid>
                            <Grid item xs={2}>
                                <MDInput type="text"
                                    value={tipoPapel}
                                    onChange={(event) => {
                                        setTipoPapel(event.target.value);
                                    }}
                                ></MDInput>
                            </Grid>
                            <Grid item xs={2}>
                                <FormLabel>
                                    Doble faz habilitado?
                                </FormLabel>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={dobleFazEnabled} onChange={switchDobleFazEnabled} />}
                                    style={{ flex: 1 }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <FormLabel>
                                    Se puede Troquelar?
                                </FormLabel>
                            </Grid>
                            <Grid item xs={2}>

                                <FormControlLabel
                                    control={
                                        <Switch checked={troqueladoEnabled} onChange={switchTroqueladoEnabled} />}
                                    style={{ flex: 1 }}
                                />
                            </Grid>
                            <Grid item xs={2}>

                                <FormLabel>
                                    Se puede Laminar?
                                </FormLabel>
                            </Grid>
                            <Grid item xs={2}>

                                <FormControlLabel
                                    control={
                                        <Switch checked={laminadoEnabled} onChange={switchLaminadoEnabled} />}
                                    style={{ flex: 1 }}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                </CardContent>
                <CardActions>
                    <MDButton
                        color={"success"}
                        style={{ width: "50%", margin: "0 auto", maxWidth: 350, marginBottom: 30 }}
                        onClick={crearProducto}
                        disabled={!allPropertiesFilled()}
                    >
                        Crear Producto
                    </MDButton>
                </CardActions>
            </>
        </Wrapper>
    )
}

export default NuevoProducto;