import MDTypography from "../../components/MDTypography";
import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";

const JobsRowFormatter = (row) => {
  return {
    cliente: (<MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>{row?.user?.first_name} {row?.user?.last_name}</MDTypography>),
    total: (<MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">{formatPrice(row.total_price_cents)}</MDTypography>),
    fecha: (<MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">{formatDate(row.due_date)}</MDTypography>),
    estado: (<MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">{formatStatus(row.status)}</MDTypography>),
    archivos: (<MDTypography component="a"  color="text"><DownloadIcon /></MDTypography>),
    info: (<MDTypography component="a" href={`/trabajo/${row.id}`} color="text"><InfoIcon>more_vert</InfoIcon></MDTypography>),
  }
}

const formatPrice = (priceCents) => {
  if(!priceCents){
    return (0 / 100).toLocaleString("es-AR", {style:"currency", currency:"ARS"})
  }

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
  // eslint-disable-next-line default-case
  switch (status){
    case "pending":
      return "Pendiente";
    case "in_progress":
      return "En proceso"
    case "finished":
      return "Terminado"
  }
}

const formatBoolean = (bool) => {
  if (bool) {
    return "Si"
  } else {
    return "No"
  }
}

const formatPriceToCents = (price) => {
  if (!price) {
    return 0;
  }
  return Math.round(price * 100)
}

const formatPriceFromCents = (price) => {
  if (!price) {
    return 0;
  }
  return (price / 100).toFixed(2)
}

export {
  JobsRowFormatter,
  formatPrice,
  formatDate,
  formatStatus,
  formatBoolean,
  formatPriceToCents,
  formatPriceFromCents
}
