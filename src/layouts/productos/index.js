import { useAuth0 } from "@auth0/auth0-react";
import DataTable from "examples/Tables/DataTable";
import Wrapper from "layouts/Wrapper";
import { useEffect, useState } from "react";
import DataService from "services/DataService";
import { ProductsRowFormatter } from "./utils";
import { Box, Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";

const TableColumns = [
    { Header: "Medida de Papel", accessor: "medida", align: "center" },
    { Header: "Tipo de Papel", accessor: "tipo_papel", align: "center" },
    { Header: "Doble faz habilitado", accessor: "doble_faz", align: "center" },
    { Header: "Se puede Troquelar", accessor: "troquelado", align: "center" },
    { Header: "Se puede Laminar", accessor: "laminado", align: "left" },
    { Header: "", accessor: "view", align: "right" },
]

const Productos = () => {
    const [rows, setRows] = useState([])
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const getInfo = async () => {
            const token = await getAccessTokenSilently();
            const { data } = await DataService.fetchProducts(token)
            const formattedRows = data?.map(r => ProductsRowFormatter(r))
            if (formattedRows?.length) {
                setRows(formattedRows)
            }
        };

        getInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>

            <Wrapper title={"Productos"}>
                <DataTable
                    table={{ columns: TableColumns, rows: rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    canSearch={true}
                    noEndBorder
                />
            </Wrapper>
            <Box sx={{
                '& > :not(style)': { m: 1 },
                position: 'fixed',
                bottom: 16,
                right: 16,
            }}>
                <Fab color="primary" aria-label="add" onClick={() => {

                    navigate('/nuevoProducto')
                }}>
                    <AddIcon fontSize={"large"} />
                </Fab>
            </Box>
        </div>
    )
}

export default Productos;