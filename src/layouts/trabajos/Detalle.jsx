import React, {useEffect, useState} from "react";
import Wrapper from "../Wrapper";
import {Link, useNavigate, useParams} from "react-router-dom";
import DataService from "../../services/DataService";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import {formatBoolean, formatPrice, formatPriceFromCents, formatPriceToCents, formatStatus} from "./utils";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import MDButton from "../../components/MDButton";
import Divider from "@mui/material/Divider";
import {Dialog, DialogTitle, TextField} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import AdminResource from "authContexts/AdminResource";
import { useGlobalDataContext } from "../../context/DataContext";


function PriceDialog(props) {
  const { onClose, selectedValue, open, job } = props;
  const [newPrice, setNewPrice] = useState("0");
  const {prices} = useGlobalDataContext();

  const handleCancel = () => onClose(selectedValue);
  const handleSave = () => onClose(newPrice);
  const handleInputChange = (event) => setNewPrice(event.target.value);
  const precioUnit = prices?.find
  (priceItem => priceItem.printSize === job?.paper_size)?.papel?.find
  (paperItem => job?.paper_type.includes(paperItem.gramaje))?.quantities?.find
  (quantity => quantity.min <= job?.copies_quantity && job?.copies_quantity <= quantity.max).options?.find
  (price => price.description === (job?.doble_faz ? "4/4" : "4/0")).value;
  const precioTotal = parseInt(precioUnit?.substring(1)) * job?.copies_quantity;
  useEffect(() => {
    setNewPrice(formatPriceFromCents(selectedValue))
  }, [selectedValue])

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle style={{margin: "25px"}}>Determinar el precio del trabajo</DialogTitle>
      <div style={{padding: 5, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 5, fontSize: 15}}>
        <div>Precio unitario: {precioUnit ? precioUnit : "$N/A"}</div>
      </div>
      <div style={{padding: 5, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 5, fontSize: 15}}>
        <div>Precio sugerido total: ${precioTotal ? precioTotal : "N/A"}</div>
      </div>
      <div style={{padding: 20, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 10}}>
        <div>$</div>
        <TextField value={newPrice} onChange={handleInputChange} type={"number"}/>
      </div>
      <div style={{padding: 20, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 10}}>
        <MDButton color={"dark"} onClick={handleSave}>
          Guardar
        </MDButton>
      </div>
    </Dialog>
  );
}

const CambiarAProcesandoButton = ({ job, onClick }) => {
  if (!job || job?.status === 'in_progress') {
    return false
  }

  return (
    <MDButton color={"dark"} onClick={onClick}>
      Cambiar estado a "Procesando"
    </MDButton>
  )
}

const RehazarButton = ({ job, onClick }) => {

  if (!job || job?.status === 'canceled') {
    return false
  }

  return (
    <MDButton color={"dark"} onClick={onClick}>
      Trabajo con Problemas
    </MDButton>
  )
}

const FinalizarButton = ({ job, onClick }) => {
  if (!job || job?.status === 'finished') {
    return false
  }

  return (
    <MDButton color={"dark"} onClick={onClick}>
      Finalizar trabajo
    </MDButton>
  )
}

const ModificarPrecioButton = ({job, handleClickOpen}) => {
  if (job?.status !== "finished") {
    return false;
  }

  return (
    <div style={{display: 'flex', flexDirection: "row", gap: 30, margin: 30}}>
      <MDButton color={"dark"} onClick={handleClickOpen} >Modificar precio</MDButton>
    </div>
  )
}

const Detalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [jobInfo, setJobInfo] = useState({})
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if(!id || id === ":id") { navigate('/') }

    const fetchUserData = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchJobData(token, id)
      setJob(data);
    }

    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    const info = {
      "Tipo de papel": job?.paper_type,
      "Tamaño de papel": job?.paper_size,
      "Cantidad de Copias": job?.copies_quantity,
      "Doble Faz?": formatBoolean(job?.doble_faz),
      "Tipo de Laminado": job?.laminado,
      "Notas": job?.notes,
      "Estado": formatStatus(job?.status),
      "Precio": formatPrice(job?.total_price_cents),
      "Tipo Troquelado": job?.troquelado,
      // "Fecha límite de entrega": formatDate(job?.due_date),
    }
    const cleanData = Object.entries(info).filter(([key, value]) => value !== undefined && value !== null )
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    setJobInfo(cleanData)
  }, [job])

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handlePriceUpdate = async (value) => {
    setOpen(false);
    setLoading(true);

    const priceCents = formatPriceToCents(value)

    const token = await getAccessTokenSilently();
    const { data } = await DataService.updateJobPrice(token, job.id, priceCents)

    setLoading(false);
    setJob(data);
  };

  const changeStatusInProgress = async () => {
    setLoading(true)
    const token = await getAccessTokenSilently();
    const { data } = await DataService.changeStatusInProgress(token, job.id)
    setJob(data);
    setLoading(false)
    navigate("/")
  }
  const changeStatusFinished = async () => {
    setLoading(true)
    const token = await getAccessTokenSilently();
    const { data } = await DataService.changeStatusFinished(token, job.id)
    setJob(data);
    setLoading(false)
    navigate("/")
  }
  const changeStatusCanceled = async () => {
    setLoading(true)
    const token = await getAccessTokenSilently();
    const { data } = await DataService.changeStatusCanceled(token, job.id)
    setJob(data);
    setLoading(false)
    navigate("/")
  }

  return(
    <Wrapper title={"Detalle del trabajo"} loading={loading}>
      <ProfileInfoCard
        info={jobInfo}
        shadow={false}
      />

      <Divider />

      <ModificarPrecioButton job={job} handleClickOpen={handleClickOpen}/>

      <PriceDialog
        selectedValue={job?.total_price_cents}
        open={open}
        job={job}
        onClose={handlePriceUpdate}
      />

      <AdminResource>

      <div style={{display: 'flex', flexDirection: "row", gap: 30, margin: 30}}>
        <CambiarAProcesandoButton job={job} onClick={changeStatusInProgress}/>
        <RehazarButton job={job} onClick={changeStatusCanceled} />
        <FinalizarButton job={job} onClick={changeStatusFinished}/>
      </div>
      </AdminResource>

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
