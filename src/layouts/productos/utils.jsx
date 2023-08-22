import MDTypography from "../../components/MDTypography";
import { Link } from "react-router-dom";
import MDButton from "components/MDButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductsRowFormatter = (row) => {
    if (!row) { return {} }
    return {
        medida: (<MDTypography variant="caption" color="text" fontWeight="bold">{row.medida}</MDTypography>),
        tipo_papel: (<MDTypography variant="caption" color="text" fontWeight="medium">{row.tipo_papel}</MDTypography>),
        doble_faz: (<MDTypography variant="caption" color="text" fontWeight="medium">{row.doble_faz ? "4/4" : "4/0"}</MDTypography>),
        troquelado: (<MDTypography variant="caption" color="text" fontWeight="regular">{row.troquelado ? "troquelado" : "-"}</MDTypography>),
        laminado: (<MDTypography variant="caption" color="text" fontWeight="regular">{row.laminado ? "laminado" : "-"}</MDTypography>),
        view: (<Link to={`/producto/${row.id}`}><MDButton color={"dark"}>Ver</MDButton></Link>)
    }
}

const PriceRowFormatter = (row, handleEditClick, handleDeleteClick) => {

    if (!row) { return {} }
    //TODO: Add edit and delete actions

    return {
        cantidadMinima: (<MDTypography variant="caption" color="text">{row.cantidad_minima}</MDTypography>),
        cantidadMaxima: (<MDTypography variant="caption" color="text" fontWeight="medium">{row.cantidad_maxima}</MDTypography>),
        valor: (<MDTypography variant="caption" color="text" fontWeight="medium">${row.valor_cents / 100}</MDTypography>),
        edit: (<EditPrecioButton handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />),
    }
}

const EditPrecioButton = ({ handleEditClick, handleDeleteClick }) => {
    return (
        <>
            <MDButton onClick={handleEditClick}> <EditIcon /> </MDButton>
            <MDButton onClick={handleDeleteClick}> <DeleteIcon /> </MDButton>
        </>
    )
}

export {
    ProductsRowFormatter,
    PriceRowFormatter,
}
