import MDTypography from "../../components/MDTypography";
import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";
import MDButton from "components/MDButton";

const JobsRowFormatter = (row) => {
  const BASE_URL = process.env.REACT_APP_API_ROOT || 'http://localhost:3001';

  if(!row) { return {} }

  return {
    cliente: (<MDTypography display="block" variant="button" color="white" fontWeight="medium" ml={1} lineHeight={1}>{row?.user?.first_name} {row?.user?.last_name}</MDTypography>),
    total: (<MDTypography component="a" href="#" variant="button" color="white" fontWeight="medium">{formatPrice(row.total_price_cents)}</MDTypography>),
    fecha: (<MDTypography component="a" href="#" variant="caption" color="white" fontWeight="medium">{formatDateString(row.created_at)}</MDTypography>),
    estado: (<MDTypography component="a" href="#" variant="caption" color="white" fontWeight="medium">{formatStatus(row.status)}</MDTypography>),
    archivos: (<MDButton component="a" color="white" href={`${BASE_URL}/upload/d?file=${row.file_names[0]}`}><DownloadIcon /></MDButton>),
    trabajo: (<MDTypography variant="caption" color="white" fontWeight="medium">{formatJob(row.paper_size, row.paper_type)}</MDTypography>),
    copias: (<MDTypography variant="caption" color="white" fontWeight="medium">{formatCopies(row.copies_quantity)}</MDTypography>),
    doble_faz: (<MDTypography variant="caption" color="white" fontWeight="medium">{formatDobleFaz(row.doble_faz)}</MDTypography>),
    info: (<MDTypography component="a" href={`/trabajo/${row.id}`} color="white"><InfoIcon>more_vert</InfoIcon></MDTypography>),
  }
}

const formatPrice = (priceCents) => {
  if(!priceCents){
    //return (0 / 100).toLocaleString("es-AR", {style:"currency", currency:"ARS"})
    return " - ";
  }

  try {
    return (priceCents / 100).toLocaleString("es-AR", {style:"currency", currency:"ARS"})
  } catch (e){
    return " - "
  }
}

const formatJob = (paperSize, paperType) => {
  return paperSize + " " + paperType;
}

const formatCopies = (copies) => {
  return copies;
}

const formatDobleFaz = (dobleFaz) => {
  return dobleFaz ? "si" : "no";
}

const formatDate = (filePath) => {
  try {
    const formattedDate = filePath.match("\\d{2}-\\d{2}-\\d{4}");
    return formattedDate;
  } catch (err) {
    return '-'
  }
}

const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formatDateString = (createdAt) => {
  try {
    return new Date(createdAt).toLocaleDateString('es-ES', options);
  } catch (err) {
    return '-'
  }
}

const formatStatus = (status) => {
  // eslint-disable-next-line default-case
  switch (status){
    case "pending":
      return "En espera";
    case "canceled":
      return "Con problemas";
    case "in_progress":
      return "En proceso"
    case "finished":
      return "Finalizado"
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
  formatPriceFromCents,
  formatJob,
  formatCopies
}
