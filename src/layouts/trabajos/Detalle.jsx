import Wrapper from "../Wrapper";
import {useParams, useNavigate, Link} from "react-router-dom";

import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import {formatDate, formatPrice, formatStatus} from "./utils";
import InfoIcon from "@mui/icons-material/Info";
import MDTypography from "../../components/MDTypography";
import IconButton from "@mui/material/IconButton";
import {navbarIconButton} from "../../examples/Navbars/DashboardNavbar/styles";
import Icon from "@mui/material/Icon";
import MDButton from "../../components/MDButton";
import Divider from "@mui/material/Divider";

const Detalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)

  useEffect(() => {
    if(!id || id === ":id") { navigate('/') }
    const fetchUserData = async () => {
      const {data, error} = await DataService.fetchJobData(id)
      setJob(data)
    }

    fetchUserData();
  }, [])

  return(
    <Wrapper title={"Detalle del trabajo"}>
      <ProfileInfoCard
        info={{
          "Tipo de papel": job?.gramaje_laminado,
          "Tamaño de papel": job?.paperSize,
          "Doble Faz?": job?.doble_faz ? "Si" : "No",
          "Cantidad de Copias": job?.copies_quantity,
          "Estado": formatStatus(job?.status),
          "Precio": formatPrice(job?.total_price_cents),
          "Fecha de Limite": formatDate(job?.due_date),
        }}
        shadow={false}
      />


      <Divider />
      <div style={{display: "flex", flexDirection: 'row', margin: 10, gap: 10, fontSize: 14, alignItems: 'center'}}>
        <div>
          Ver usuario:
        </div>
        <div>
          <Link to={`/cliente/${job?.user?.id}`} style={{color: 'black'}}>
            {job?.user?.first_name} {job?.user?.last_name}
            <IconButton size="small" disableRipple>
              <Icon>account_circle</Icon>
            </IconButton>
          </Link>
        </div>
      </div>
    </Wrapper>
  )
}

export default Detalle;
