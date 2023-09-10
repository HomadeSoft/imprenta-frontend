import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import MDBox from "components/MDBox";

import DataTable from "examples/Tables/DataTable";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import { JobsRowFormatter } from "../trabajos/utils";
import { useAuth0 } from "@auth0/auth0-react";
import { useGlobalDataContext } from "../../context/DataContext";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import { Fab } from "@mui/material";
import EditableTableCell from "../../components/EditableTableCell";

const jobsTableColumns = [
  { Header: "Fecha", accessor: "fecha", align: "center" },
  { Header: "Estado", accessor: "estado", align: "center", visible: "false" },
  { Header: "Total", accessor: "total", align: "left" },
  { Header: "Archivos", accessor: "archivos", align: "center" },
  { Header: "Descargados?", accessor: "archivos_descargados", align: "center" },
  { Header: "Trabajo", accessor: "trabajo", align: "center" },
  { Header: "Copias", accessor: "copias", align: "center" },
  { Header: "Doble Faz", accessor: "doble_faz", align: "center" },
  { Header: "Info", accessor: "info", align: "center" },
]

const DetallesCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: globalUser } = useGlobalDataContext()

  const [user, setUser] = useState(null);
  const [userJobs, setUserJobs] = useState([])
  const [editing, setEditing] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!id || id === ":id") {
      if (globalUser.id) {
        navigate(`/cliente/${globalUser.id}`)
      } else {
        navigate('/')
      }
    }

    const fetchUserData = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchUserData(token, id)
      setUser(data)
    }

    const fetchData = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchUserJobs(token, id)
      const formattedRows = data?.map(r => JobsRowFormatter(r, token))
      setUserJobs(formattedRows)
    }

    fetchUserData();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleUpdate = (attrs, key) => {
    console.log(user)
    user[key] = attrs.currentTarget.value
    setUser(user)
  };

  const saveUser = async () => {
    const token = await getAccessTokenSilently();
    DataService.saveUser(token, user)
  }

  const showData = {
    empresa: user?.fantasy_name,
    nombre: `${user?.first_name} ${user?.last_name}`,
    CUIT: user?.cuit,
    teléfono: user?.phone,
    direccion: user?.address,
    'condicion IVA': user?.cond_iva,
    email: user?.email,
  }

  const editData = {
    empresa: <EditableTableCell value={user?.fantasy_name} onBlur={(event) => handleUpdate(event, 'fantasy_name')} />,
    nombre: <EditableTableCell value={user?.first_name} onBlur={(event) => handleUpdate(event, "first_name")} />,
    apellido: <EditableTableCell value={user?.last_name} onBlur={(event) => handleUpdate(event, "last_name")} />,
    CUIT: <EditableTableCell value={user?.cuit} onBlur={(event) => handleUpdate(event, 'cuit')} />,
    teléfono: <EditableTableCell value={user?.phone} onBlur={(event) => handleUpdate(event, 'phone')} />,
    direccion: <EditableTableCell value={user?.address} onBlur={(event) => handleUpdate(event, 'address')} />,
    'condicion IVA': <EditableTableCell value={user?.cond_iva} onBlur={(event) => handleUpdate(event, 'cond_iva')} />,
    email: user?.email,
  }

  return (
    <Wrapper title={"Info Cliente"}>
      <>
        <div style={{ display: "flex", flexDirection: 'row' }}>
          <ProfileInfoCard
            info={editing ? editData : showData}
            social={[]}
            action={{ route: "", tooltip: "Editar Perfil" }}
            shadow={false}
          />
          <div style={{ display: "flex", flex: 1, justifyContent: 'end', alignItems: "end", margin: 16 }}>
            <Fab color="primary" aria-label="add"
              onClick={() => {
                if (editing) { saveUser() }
                setEditing(!editing);
              }}
            >
              {editing ? <SaveIcon fontSize={"large"} /> : <EditIcon fontSize={"large"} />}
            </Fab>
          </div>
        </div>


        <MDBox pt={3}>
          <DataTable
            table={{ columns: jobsTableColumns, rows: userJobs }}
            isSorted={false}
            entriesPerPage={false}
            showTotalEntries={false}
            noEndBorder
          />
        </MDBox>
      </>
    </Wrapper>
  );
}

export default DetallesCliente;
