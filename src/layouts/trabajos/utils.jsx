import MDTypography from "../../components/MDTypography";
import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";

const JobsRowFormatter = (row) => {
  return {
    cliente: (<MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>{row.user.first_name} {row.user.last_name}</MDTypography>),
    total: (<MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">{formatPrice(row.total_price_cents)}</MDTypography>),
    fecha: (<MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">{formatDate(row.due_date)}</MDTypography>),
    estado: (<MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">{formatStatus(row.status)}</MDTypography>),
    info: (<MDTypography component="a" href="#" color="text"><InfoIcon>more_vert</InfoIcon></MDTypography>),
    archivos: (<MDTypography component="a" href="#" color="text"><DownloadIcon /></MDTypography>),
  }
}

const formatPrice = (priceCents) => {
  try {
    return (priceCents / 100).toLocaleString("es-AR", {style:"currency", currency:"ARS"})
  } catch (e){
    return " - "
  }
}

const formatDate = (dateToFormat) => {
  try {
    return new Date(dateToFormat).toLocaleString().slice(0,9)
  } catch (err) {
    return '-'
  }
}

const formatStatus = (status) => {
  switch (status){
    case "pending":
      return "Pendiente";
    case "in_progress":
      return "En proceso"
    case "finished":
      return "Terminado"
  }
}

export {
  JobsRowFormatter,
  formatPrice
}
