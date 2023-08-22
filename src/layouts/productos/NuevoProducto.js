import { useAuth0 } from "@auth0/auth0-react";
import { CardActions, CardContent, FormControlLabel, FormGroup, FormLabel, Grid, Switch } from "@mui/material";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Wrapper from "layouts/Wrapper";
import { useState } from "react";
import { useNavigate } from "react-router";
import DataService from "services/DataService";

const Legend = ({ message, setMessage }) => {
    if (!message) {
        return null
    }

    return (
        <div
            style={{
                display: "flex", flexDirection: 'row', justifyContent: 'space-around',
                alignItems: 'center', padding: 20,
                borderRadius: 10,
                backgroundColor: "#000000", color: "white",
                cursor: 'pointer'
            }}
            onClick={() => setMessage(null)}
        >
            <div>{message}</div>
        </div>
    )
};

const NuevoProducto = () => {

    const [medidaPapel, setMedidaPapel] = useState("");
    const [tipoPapel, setTipoPapel] = useState("");
    const [dobleFazEnabled, setDobleFazEnabled] = useState(false);
    const [troqueladoEnabled, setTroqueladoEnabled] = useState(false);
    const [laminadoEnabled, setLaminadoEnabled] = useState(false);
    const navigate = useNavigate();


    const [message, setMessage] = useState(null);

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
    const { getAccessTokenSilently } = useAuth0();


    const crearProducto = async () => {
        //TODO: Invoke async method
        const token = await getAccessTokenSilently();

        const producto = {
            "medida": medidaPapel,
            "doble_faz": dobleFazEnabled,
            "troquelado": troqueladoEnabled,
            "laminado": laminadoEnabled,
            "tipo_papel": tipoPapel
        }

        const { error } = await DataService.createProduct(token, producto);
        if (error) {
            setMessage(error)
            return
        } else {
            setMessage("producto creado")
            setTimeout(() => {
                navigate("/productos")
            }, 2000)
        }

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
                <Legend message={message} setMessage={setMessage} />
            </>
        </Wrapper>
    )
}

export default NuevoProducto;