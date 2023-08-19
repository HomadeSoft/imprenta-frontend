import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import Wrapper from "layouts/Wrapper";
import { useEffect, useState } from "react";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import DataService from "services/DataService";
import { useParams } from "react-router-dom";
import { PriceRowFormatter } from "./utils";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, Switch, TextField } from "@mui/material";
import MDButton from "components/MDButton";

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

    useEffect(() => {
        const fetchProductData = async () => {
            const { data } = await DataService.fetchProductData(id)
            setProduct(data)
            setProductPrices(data?.precios);
            const formattedRows = data?.precios.map(r => {
                const handleEditClick = () => {
                    setSelectedPrice(r);
                    setDialogOpen(true);
                }

                return PriceRowFormatter(r, handleEditClick)
            })
            setRowProductPrices(formattedRows)
        }

        fetchProductData();
    }, [id])

    const showData = {
        medidaDePapel: product?.medida,
        tipoDePapel: product?.tipo_papel,
        dobleFazHabilitado: <Switch checked={product?.doble_faz} disabled />,
        troqueladoHabilitado: <Switch checked={product?.troquelado} disabled />,
        laminadoHabilitado: <Switch checked={product?.laminado} disabled />,
    }

    const savePrecio = async (newPrice) => {
        //TODO: Nico >> Invocar servicio para guardar precio.
        // const { data } = await DataService.updateProductPrice(newPrice);
        const newProductPrices = productPrices.map(prices => prices.id !== newPrice.id ? prices : newPrice);
        setProductPrices(newProductPrices);
        setDialogOpen(false);
    }

    return (
        <Wrapper title="Detalles del Producto">
            <ProfileInfoCard
                info={showData}
            />

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