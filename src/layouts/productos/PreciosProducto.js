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
import PlusIcon from "@mui/icons-material/Add";

import EditableTableCell from "../../components/EditableTableCell";
import { useAuth0 } from "@auth0/auth0-react";

function PriceDialog(props) {
    const { onClose, open, selectedPrice, onSave, onCreate } = props;
    const [cantidadMinima, setCantidadMinima] = useState(0);
    const [cantidadMaxima, setCantidadMaxima] = useState(0);
    const [valorPrecio, setValorPrecio] = useState(0);

    const handleMinCantChange = (event) => {
        setCantidadMinima(event.target.value);
    }

    const handleMaxCantChange = (event) => {
        setCantidadMaxima(event.target.value);
    }

    const handleValorChange = (event) => {
        setValorPrecio(event.target.value);
    }

    const savePrecio = () => {
        if (selectedPrice) {
            onSave({ id: selectedPrice.id, cantidad_maxima: cantidadMaxima, cantidad_minima: cantidadMinima, valor_cents: valorPrecio * 100 });
        } else {
            onCreate({ cantidad_maxima: cantidadMaxima, cantidad_minima: cantidadMinima, valor_cents: valorPrecio * 100 });
        }

        onClose();
    }

    useEffect(() => {
        setCantidadMinima(selectedPrice?.cantidad_minima);
        setCantidadMaxima(selectedPrice?.cantidad_maxima);
        setValorPrecio(selectedPrice?.valor_cents);
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
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputMode: 'numeric'
                    }} value={valorPrecio} onChange={handleValorChange} />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <MDButton onClick={savePrecio}>Guardar</MDButton>
        </DialogActions>
    </Dialog>);
}

const DeletePriceDialog = (props) => {
    const { onClose, open, selectedPrice, onDelete } = props;

    if (!selectedPrice) {
        return null;
    }

    return (
        <Dialog onClose={onClose} open={open} >
            <DialogTitle>Eliminar Precio?</DialogTitle>
            <DialogContent>
                <div style={{ paddingLeft: 30, paddingRight: 30, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>{`Cantidad Minima: ${selectedPrice?.cantidad_maxima}`}</div>
                    <div>{`Cantidad Maxima: ${selectedPrice?.cantidad_minima}`}</div>
                    <div>{`Precio: ${selectedPrice?.valor_cents / 100}`}</div>
                </div>
            </DialogContent>
            <DialogActions>
                <MDButton onClick={() => onDelete(selectedPrice)}>Eliminar</MDButton>
            </DialogActions>
        </Dialog>
    );
}

const productPricesTableColumns = [
    { Header: "Cantidad Minima", accessor: "cantidadMinima", align: "center" },
    { Header: "Cantidad Maxima", accessor: "cantidadMaxima", align: "center" },
    { Header: "Precio", accessor: "valor", align: "center" },
    { Header: "Acciones", accessor: "edit", align: "center" },
]

const DetalleProducto = () => {
    const { id } = useParams();

    const [productPrices, setProductPrices] = useState([]);
    const [rowProductPrices, setRowProductPrices] = useState([]);
    const [product, setProduct] = useState(null);

    const [selectedPrice, setSelectedPrice] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [editing, setEditing] = useState(false);
    const [, setDobleFazHabilitado] = useState(false);
    const [, setTroqueladoHabilitado] = useState(false);
    const [, setLaminadoHabilitado] = useState(false);
    const [, setProductoHabilitado] = useState(false);

    const { getAccessTokenSilently } = useAuth0();

    const formatProductPrices = (precios) => {
        return precios.map(r => {
            const handleEditClick = () => {
                setSelectedPrice(r);
                setDialogOpen(true);
            }

            const handleDeleteClick = () => {
                setSelectedPrice(r);
                setDeleteDialogOpen(true);
            }

            return PriceRowFormatter(r, handleEditClick, handleDeleteClick)
        })
    }
    const fetchProductData = async () => {
        const { data } = await DataService.fetchProductData(id)

        setProduct(data)
        setProductPrices(data?.precios);

        setDobleFazHabilitado(data?.doble_faz)
        setTroqueladoHabilitado(data?.troquelado)
        setLaminadoHabilitado(data?.laminado)

        setRowProductPrices(formatProductPrices(data?.precios.sort((a, b) => { return a.cantidad_minima - b.cantidad_minima })))
    }

    useEffect(() => {
        fetchProductData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUpdate = (attrs, key) => {
        product[key] = attrs.currentTarget.value
        setProduct(product)
    };

    const handleCheckUpdate = (key, setter) => {
        setter(!product[key])
        product[key] = !product[key]
        setProduct(product)
    };

    const showData = {
        medidaDePapel: product?.medida,
        tipoDePapel: product?.tipo_papel,
        dobleFazHabilitado: <Switch checked={product?.doble_faz} disabled />,
        troqueladoHabilitado: <Switch checked={product?.troquelado} disabled />,
        laminadoHabilitado: <Switch checked={product?.laminado} disabled />,
        productoHabilitado: <Switch checked={product?.enabled} disabled />
    }

    const editData = {
        medidaDePapel: <EditableTableCell value={product?.medida} onBlur={(event) => handleUpdate(event, 'medida')} />,
        tipoDePapel: <EditableTableCell value={product?.tipo_papel} onBlur={(event) => handleUpdate(event, "tipo_papel")} />,
        dobleFazHabilitado: <Switch checked={product?.doble_faz} onChange={() => handleCheckUpdate('doble_faz', setDobleFazHabilitado)} />,
        troqueladoHabilitado: <Switch checked={product?.troquelado} onChange={() => handleCheckUpdate('troquelado', setTroqueladoHabilitado)} />,
        laminadoHabilitado: <Switch checked={product?.laminado} onChange={() => handleCheckUpdate('laminado', setLaminadoHabilitado)} />,
        productoHabilitado: <Switch checked={product?.enabled} onChange={() => handleCheckUpdate('enabled', setProductoHabilitado)} />

    }

    const savePrecio = async (updatedPrice) => {
        const token = await getAccessTokenSilently();
        await DataService.updateProductPrice(token, updatedPrice);

        const newProductPrices = productPrices.map(prices => prices.id !== updatedPrice.id ? prices : updatedPrice);

        setProductPrices(newProductPrices);
        setRowProductPrices(formatProductPrices(newProductPrices.sort((a, b) => { return a.cantidad_minima - b.cantidad_minima })))
        setDialogOpen(false);
    }

    const saveProducto = async () => {
        const token = await getAccessTokenSilently();
        DataService.saveProducto(token, product)
    }

    const createPrecio = async (newPrice) => {
        newPrice['producto_id'] = product?.id
        const token = await getAccessTokenSilently();
        await DataService.createProductPrice(token, newPrice);
        fetchProductData();
    }

    const deletePrice = async (newPrice) => {
        const token = await getAccessTokenSilently();
        await DataService.deleteProductPrice(token, newPrice);
        setDeleteDialogOpen(false)
        setSelectedPrice(null)
        fetchProductData();
    }

    return (
        <Wrapper title="Detalles del Producto">
            <div style={{ display: "flex", flexDirection: 'row' }}>
                <ProfileInfoCard
                    info={editing ? editData : showData}
                    shadow={false}
                />
                <div style={{ display: "flex", flex: 1, justifyContent: 'end', alignItems: "end", margin: 16 }}>
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
                <div style={{ display: "flex", flex: 1, justifyContent: 'end', alignItems: "end", margin: 16 }}>
                    <Fab color="primary" aria-label="add"
                        onClick={() => { setDialogOpen(true) }}
                    >
                        <PlusIcon fontSize={"large"} />
                    </Fab>
                </div>
            </MDBox>
            <PriceDialog
                open={dialogOpen}
                selectedPrice={selectedPrice}
                onClose={() => { setDialogOpen(false) }}
                onSave={savePrecio}
                onCreate={createPrecio}
            />

            <DeletePriceDialog
                open={deleteDialogOpen}
                selectedPrice={selectedPrice}
                onClose={() => { setDeleteDialogOpen(false) }}
                onDelete={deletePrice}
            />
        </Wrapper>
    )
}



export default DetalleProducto;