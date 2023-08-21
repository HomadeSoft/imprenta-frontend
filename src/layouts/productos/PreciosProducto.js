import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import Wrapper from "layouts/Wrapper";
import React, { useEffect, useState } from "react";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import DataService from "services/DataService";
import { useParams } from "react-router-dom";
import { PriceRowFormatter } from "./utils";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    InputAdornment,
    Switch,
    TextField
} from "@mui/material";
import MDButton from "components/MDButton";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import EditableTableCell from "../../components/EditableTableCell";
import { useAuth0 } from "@auth0/auth0-react";

//TODO: Nico >> Agregar un precio. Se puede usar el PriceDialog para crearlo.
//TODO: Nico >> Editar producto. Desde la misma logica que editar un cliente?
function PriceDialog(props) {
    const { onClose, open, selectedPrice, onSave } = props;
    const [cantidadMinima, setCantidadMinima] = useState(0);
    const [cantidadMaxima, setCantidadMaxima] = useState(0);
    const [valorCents, setValorCents] = useState(0);
    const handleClose = () => {
        onClose();
    };

    const handleMinCantChange = (event) => {
        setCantidadMinima(event.target.value);
    }

    const handleMaxCantChange = (event) => {
        setCantidadMaxima(event.target.value);
    }

    const handleValorChange = (event) => {
        setValorCents(event.target.value * 100);
    }

    const savePrecio = (event) => {
        //TODO: Guardar precio por ID
        onSave({ id: selectedPrice.id, cantidad_maxima: cantidadMaxima, cantidad_minima: cantidadMinima, valor_cents: valorCents });
        handleClose();
    }

    useEffect(() => {
        setCantidadMinima(selectedPrice?.cantidad_minima);
        setCantidadMaxima(selectedPrice?.cantidad_maxima);
        setValorCents(selectedPrice?.valor_cents);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPrice])


    return (<Dialog onClose={onClose} open={open} >
        <DialogTitle>Editar precio</DialogTitle>
        <DialogContent>
            <Grid container spacing={3} p={2} alignItems={"stretch"}>
                <Grid item xs={6}>
                    <TextField label="Cantidad Minima" value={cantidadMinima} onChange={handleMinCantChange} />
                </Grid>

                <Grid item xs={6}>
                    <TextField label="Cantidad Maxima" value={cantidadMaxima} onChange={handleMaxCantChange} />
                </Grid>

                <Grid item xs={12} textAlign={"center"}>
                    <TextField label="Valor (precio)" InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }} value={valorCents / 100} onChange={handleValorChange} />
                </Grid>

            </Grid>
        </DialogContent>
        <DialogActions>
            <MDButton onClick={savePrecio}>Guardar</MDButton>
        </DialogActions>
    </Dialog>);
}

const productPricesTableColumns = [
    { Header: "Cantidad Minima", accessor: "cantidadMinima", align: "center" },
    { Header: "Cantidad Maxima", accessor: "cantidadMaxima", align: "center" },
    { Header: "Precio", accessor: "valor", align: "center" },
    { Header: "Editar", accessor: "edit", align: "center" },
]

const DetalleProducto = () => {
    const { id } = useParams();

    const [productPrices, setProductPrices] = useState([]);
    const [rowProductPrices, setRowProductPrices] = useState([]);
    const [product, setProduct] = useState(null);

    const [selectedPrice, setSelectedPrice] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [editing, setEditing] = useState(false);
    const [, setDobleFazHabilitado] = useState(false);
    const [, setTroqueladoHabilitado] = useState(false);
    const [, setLaminadoHabilitado] = useState(false);

    const { getAccessTokenSilently } = useAuth0();

    const formatProductPrices = (precios) => {
        return precios.map(r => {
            const handleEditClick = () => {
                setSelectedPrice(r);
                setDialogOpen(true);
            }

            return PriceRowFormatter(r, handleEditClick)
        })
    }

    useEffect(() => {
        const fetchProductData = async () => {
            const { data } = await DataService.fetchProductData(id)
            setProduct(data)
            setProductPrices(data?.precios);

            setDobleFazHabilitado(data?.doble_faz)
            setTroqueladoHabilitado(data?.troquelado)
            setLaminadoHabilitado(data?.laminado)

            setRowProductPrices(formatProductPrices(data?.precios))
        }

        fetchProductData();
    }, [])

    const handleUpdate = (attrs, key) => {
        product[key] = attrs.currentTarget.value
        setProduct(product)
    };

    const handleCheckUpdate = (key, setter) => {
        product[key] = !product[key]
        setProduct(product)
        setter(!key)
    };


    const showData = {
        medidaDePapel: product?.medida,
        tipoDePapel: product?.tipo_papel,
        dobleFazHabilitado: <Switch checked={product?.doble_faz} disabled />,
        troqueladoHabilitado: <Switch checked={product?.troquelado} disabled />,
        laminadoHabilitado: <Switch checked={product?.laminado} disabled />,
    }

    const editData = {
        medidaDePapel: <EditableTableCell value={product?.medida} onBlur={(event) => handleUpdate(event, 'medida')} />,
        tipoDePapel: <EditableTableCell value={product?.tipo_papel} onBlur={(event) => handleUpdate(event, "tipo_papel")} />,
        dobleFazHabilitado: <Switch checked={product?.doble_faz} onChange={() => handleCheckUpdate('doble_faz', setDobleFazHabilitado)}/>,
        troqueladoHabilitado: <Switch checked={product?.troquelado} onChange={() => handleCheckUpdate('troquelado', setTroqueladoHabilitado)}/>,
        laminadoHabilitado: <Switch checked={product?.laminado} onChange={() => handleCheckUpdate('laminado', setLaminadoHabilitado)}/>,
    }

    const savePrecio = async (newPrice) => {
        const token = await getAccessTokenSilently();
        await DataService.updateProductPrice(token, newPrice);

        const newProductPrices = productPrices.map(prices => prices.id !== newPrice.id ? prices : newPrice);

        setProductPrices(newProductPrices);
        setRowProductPrices(formatProductPrices(newProductPrices))
        setDialogOpen(false);
    }

    const saveProducto = async () => {
        const token = await getAccessTokenSilently();
        DataService.saveProducto(token, product)
    }

    return (
        <Wrapper title="Detalles del Producto">
            <div style={{display: "flex", flexDirection: 'row'}}>
                <ProfileInfoCard
                  info={ editing ? editData : showData}
                  shadow={false}
                />
                <div style={{ display: "flex", flex: 1, justifyContent: 'end', alignItems: "end", margin: 16}}>
                    <Fab color="primary" aria-label="add"
                         onClick={() => {
                             if (editing) { saveProducto() }
                             setEditing(!editing);
                         }}
                    >
                        {editing ? <SaveIcon fontSize={"large"} /> : <EditIcon fontSize={"large"} />}
                    </Fab>
                </div>
            </div>

            <MDBox pt={3}>
                <DataTable
                    table={{ columns: productPricesTableColumns, rows: rowProductPrices }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                />
            </MDBox>
            <PriceDialog
                open={dialogOpen}
                selectedPrice={selectedPrice}
                onClose={() => { setDialogOpen(false) }}
                onSave={savePrecio}
            />
        </Wrapper>
    )
}



export default DetalleProducto;