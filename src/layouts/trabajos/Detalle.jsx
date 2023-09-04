import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import { Link, useNavigate, useParams } from "react-router-dom";
import DataService from "../../services/DataService";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import { formatBoolean, formatPrice, formatPriceFromCents, formatPriceToCents, formatStatus } from "./utils";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import MDButton from "../../components/MDButton";
import Divider from "@mui/material/Divider";
import { Dialog, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import AdminResource from "authContexts/AdminResource";
import MDInput from "components/MDInput";
import Legend from "../notifications/Legend";
// import { useGlobalDataContext } from "../../context/DataContext";


function PriceDialog(props) {
  const { onClose, selectedValue, open, job, precios, onSave } = props;
  const [newPrice, setNewPrice] = useState("0");
  // const { prices } = useGlobalDataContext();
  const [copies, setCopies] = useState(job?.copies_quantity);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleCancel = () => onClose();
  const handleSave = () => onSave(newPrice);
  const handleInputChange = (event) => setNewPrice(event.target.value);
  const precioUnit = precios?.find(precio => precio.cantidad_minima <= copies <= precio.cantidad_maxima)?.valor_cents / 100;
  // const precioUnit = prices?.find
  //   (priceItem => priceItem.printSize === job?.paper_size)?.papel?.find
  //   (paperItem => job?.paper_type.includes(paperItem.gramaje))?.quantities?.find
  //   (quantity => quantity.min <= copies && copies <= quantity.max)?.options?.find
  //   (price => price.description === (job?.doble_faz ? "4/4" : "4/0")).value;
  // const precioTotal = parseInt(precioUnit?.substring(1)) * job?.copies_quantity;
  const handleCopiesChange = (event) => {
    setCopies(event.target.value)
    setTotalPrice(parseInt(precioUnit) * event.target.value);
  };
  useEffect(() => {
    setNewPrice(formatPriceFromCents(selectedValue))
    setCopies(job?.copies_quantity);
    setTotalPrice(parseInt(precioUnit) * job?.copies_quantity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle style={{ margin: "25px" }}>Determinar el precio del trabajo</DialogTitle>
      <div style={{ padding: 5, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 5, fontSize: 15 }}>
        <div>Precio unitario: {precioUnit ? precioUnit : "$N/A"}</div>
      </div>
      <div style={{ padding: 5, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 5, fontSize: 15 }}>
        <div>Total de copias: </div>
        <TextField value={copies} onChange={handleCopiesChange} type={"number"} />
      </div>
      <div style={{ padding: 5, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 5, fontSize: 15 }}>
        <div>Precio total: ${totalPrice ? totalPrice : "N/A"}</div>
      </div>
      <div style={{ padding: 20, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 10 }}>
        <div>$</div>
        <TextField value={newPrice} onChange={handleInputChange} type={"number"} />
      </div>
      <div style={{ padding: 20, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 10 }}>
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

const CambiarArchivoButton = ({ job, onClick }) => {
  if (!job || job?.status !== 'pending') {
    return false
  }

  return (
    <MDButton color={"dark"} onClick={onClick}>
      Cambiar archivo
    </MDButton>
  )
}

const EliminarButton = ({ job, onClick }) => {
  if (!job || job?.status !== 'pending') {
    return false
  }

  return (
    <MDButton color={"dark"} onClick={onClick}>
      Eliminar trabajo
    </MDButton>
  )
}

const ConfimarEliminarDialog = (props) => {
  const { open, onClose, onConfirm } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle >Eliminar pedido</DialogTitle>
      <DialogContentText style={{ margin: "25px" }}>Esta seguro que desea eliminar el pedido? Esta accion no se puede deshacer.</DialogContentText>
      <div style={{ padding: 20, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 10 }}>
        <MDButton color={"dark"} onClick={onClose}>
          Cancelar
        </MDButton>
        <MDButton color={"error"} onClick={onConfirm}>
          Eliminar
        </MDButton>
      </div>
    </Dialog>
  )
}

const CambiarArchivoDialog = (props) => {
  const { open, onClose, onConfirm, onFileChange } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle >Cambiar archivo</DialogTitle>
      <div style={{ margin: "25px" }}>

        <MDInput type="file" onChange={onFileChange} />
      </div>
      <div style={{ padding: 20, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 10 }}>
        <MDButton color={"dark"} onClick={onClose}>
          Cancelar
        </MDButton>
        <MDButton color={"success"} onClick={onConfirm}>
          Aceptar
        </MDButton>
      </div>
    </Dialog>
  )
}

const ModificarPrecioButton = ({ job, handleClickOpen }) => {
  if (job?.status !== "finished") {
    return false;
  }

  return (
    <div style={{ display: 'flex', flexDirection: "row", gap: 30, margin: 30 }}>
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
  const [precios, setPrecios] = useState([])
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!id || id === ":id") { navigate('/') }
    const fetchUserData = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchJobData(token, id)
      setJob(data);
      const productos = (await DataService.fetchProducts(token)).data;
      const producto = productos.find(
        p => (
          p.medida === data.paper_size &&
          p.tipo_papel.includes(data.paper_type) &&
          p.doble_faz === data.doble_faz
        ));

      if (!!producto) {
        const precios = (await DataService.fetchProductData(producto?.id)).data.precios;
        setPrecios(precios);
      }
    }

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    let fileNames
    if (job?.file_names) {
      fileNames = (job?.file_names?.length > 1) ? job?.file_names.join(' - ') : job?.file_names[0];
    }

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
      "Nombre Archivo": fileNames || "",
      "Archivo descargado?": formatBoolean(job?.archivos_descargados),
      // "Fecha límite de entrega": formatDate(job?.due_date),
    }
    const cleanData = Object.entries(info).filter(([key, value]) => value !== undefined && value !== null)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    setJobInfo(cleanData)
  }, [job])

  const [open, setOpen] = React.useState(false);
  const [eliminarOpen, setEliminarOpen] = React.useState(false);
  const [fileDialogOpen, setFileDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(false);

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

  const handlePriceCancel = async () => {
    setOpen(false);
  }

  const changeStatusInProgress = async () => {
    setLoading(true)
    const token = await getAccessTokenSilently();
    await DataService.changeStatusInProgress(token, job.id)

    setLoading(false)
    navigate("/")
  }
  const changeStatusFinished = async () => {
    setLoading(true)
    const token = await getAccessTokenSilently();
    const { data } = await DataService.changeStatusFinished(token, job.id)

    setJob(data);
    setLoading(false)
  }


  const handleEliminarClose = () => {
    setEliminarOpen(false);
  }
  const handleEliminarConfirm = async () => {
    setEliminarOpen(false);
    setLoading(true)
    setMessage("Procesando...")
    const token = await getAccessTokenSilently();
    const { success } = await DataService.deleteJob(token, job.id)

    setLoading(false)

    if(success) {
      setMessage("Trabajo Eliminado")
      setTimeout(() => {
        setMessage(null)
        navigate("/")
      }, 3000)
    } else {
      setMessage("Ocurrio un error")
      console.log("Error")
    }
  }

  const handleClickEliminarOpen = () => {
    setEliminarOpen(true);
  };

  const handleClickFileChangeOpen = () => {
    setFileDialogOpen(true);
  };
  const onFileDialogConfirmed = async () => {
    setLoading(true);
    setMessage("Se está subiendo el archivo adjunto. No cierre esta ventana")

    const folder = job?.file_names[0].split('/')[0] + '/';
    const fileNames = [folder + selectedFile.name];
    const token = await getAccessTokenSilently();
    const { error } = await DataService.uploadToServer(selectedFile, folder);

    if (!error) {
      setMessage("Procesando...")
      const { data } = await DataService.updateJobFile(token, job?.id, fileNames);
      DataService.setNotDownloadedFile(token, job?.id);

      setJob(data);
      setLoading(false);
      setFileDialogOpen(false);
    } else {
      setMessage("Ocurrio un error")
    }
  };

  const onFileChanged = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  const onFileDialogClosed = () => {
    setFileDialogOpen(false);
  }


  const changeStatusCanceled = async () => {
    setLoading(true)
    const token = await getAccessTokenSilently();
    await DataService.changeStatusCanceled(token, job.id)

    setLoading(false)
    navigate("/")
  }

  return (
    <Wrapper title={"Detalle del trabajo"} loading={loading}>
      <ProfileInfoCard
        info={jobInfo}
        shadow={false}
      />

      <Divider />

      <AdminResource>
        <ModificarPrecioButton job={job} handleClickOpen={handleClickOpen} />

        <PriceDialog
          selectedValue={job?.total_price_cents}
          open={open}
          job={job}
          onClose={handlePriceCancel}
          onSave={handlePriceUpdate}
          precios={precios}
        />

        <div style={{ display: 'flex', flexDirection: "row", gap: 30, margin: 30 }}>
          <CambiarAProcesandoButton job={job} onClick={changeStatusInProgress} />
          <RehazarButton job={job} onClick={changeStatusCanceled} />
          <FinalizarButton job={job} onClick={changeStatusFinished} />
        </div>
      </AdminResource>
      <div style={{ display: 'flex', flexDirection: "row", gap: 30, margin: 30 }}>

        <ConfimarEliminarDialog
          open={eliminarOpen}
          onClose={handleEliminarClose}
          onConfirm={handleEliminarConfirm}
        />
        <CambiarArchivoDialog
          open={fileDialogOpen}
          onClose={onFileDialogClosed}
          onFileChange={onFileChanged}
          onConfirm={onFileDialogConfirmed}
        />
        <CambiarArchivoButton job={job} onClick={handleClickFileChangeOpen} />
        <EliminarButton job={job} onClick={handleClickEliminarOpen} />
      </div>

      <div style={{ display: "flex", flexDirection: 'row', margin: 10, gap: 10, fontSize: 14, alignItems: 'center' }}>
        <div>
          Ver usuario:
        </div>
        <div>
          <Link to={`/cliente/${job?.user?.id}`} style={{ color: 'black' }}>
            {job?.user?.first_name} {job?.user?.last_name}
            <IconButton size="small" disableRipple>
              <Icon>account_circle</Icon>
            </IconButton>
          </Link>
        </div>
      </div>
      <Legend message={message} setMessage={setMessage} />
    </Wrapper>
  )
}

export default Detalle;
