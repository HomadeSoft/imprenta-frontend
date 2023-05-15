import MDTypography from "../../components/MDTypography";
import {Link} from "react-router-dom";
import MDButton from "../../components/MDButton";

const ClientsRowFormatter = (row) => (
  {
    cuit: (<MDTypography  variant="button" color="text">{row.cuit}</MDTypography>),
    email: (<MDTypography  variant="caption" color="text" fontWeight="medium">{row.email}</MDTypography>),
    fantasy_name: (<MDTypography  variant="button" color="text" fontWeight="medium">{row.fantasy_name}</MDTypography>),
    name: (<MDTypography  variant="button" color="text" fontWeight="medium">{row.first_name} {row.last_name}</MDTypography>),
    phone: (<MDTypography variant="button" color="text" fontWeight="medium">{row.phone}</MDTypography>),
    view: (<Link to={`/cliente/${row.id}`}><MDButton color={"dark"}>Ver</MDButton>
    </Link>)
  }
)

export {
    ClientsRowFormatter
}
