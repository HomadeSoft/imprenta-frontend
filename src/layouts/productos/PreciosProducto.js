import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import Wrapper from "layouts/Wrapper";
import { useEffect, useState } from "react";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import DataService from "services/DataService";
import { useParams } from "react-router-dom";
import { PriceRowFormatter } from "./utils";
import { Switch } from "@mui/material";


const productPricesTableColumns = [
    { Header: "Cantidad Minima", accessor: "cantidadMinima", align: "center" },
    { Header: "Cantidad Maxima", accessor: "cantidadMaxima", align: "center" },
    { Header: "Precio", accessor: "valor", align: "center" },
]

const DetalleProducto = () => {
    const { id } = useParams();

    const [productPrices, setProductPrices] = useState([]);
    const [product, setProduct] = useState(null);


    useEffect(() => {
        //TODO: Load product & product prices
        const fetchProductData = async () => {
            const { data } = await DataService.fetchProductData(id)
            setProduct(data)
            const formattedRows = data?.precios.map(r => PriceRowFormatter(r))
            setProductPrices(formattedRows)
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

    return (
        <Wrapper title="Detalles del Producto">
            <ProfileInfoCard
                info={showData}
            />

            <MDBox pt={3}>
                <DataTable
                    table={{ columns: productPricesTableColumns, rows: productPrices }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                />
            </MDBox>
        </Wrapper>
    )
}

export default DetalleProducto;