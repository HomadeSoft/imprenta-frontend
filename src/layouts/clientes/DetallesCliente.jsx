import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import MDBox from "components/MDBox";

import DataTable from "examples/Tables/DataTable";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import {JobsRowFormatter} from "../trabajos/utils";
import {useAuth0} from "@auth0/auth0-react";

const jobsTableColumns = [
  { Header: "Fecha", accessor: "fecha", align: "center" },
  { Header: "Estado", accessor: "estado", align: "center" },
  { Header: "Total", accessor: "total", align: "left" },
  { Header: "Archivos", accessor: "archivos", align: "center" },
  { Header: "Info", accessor: "info", align: "center" },
]

const DetallesCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userJobs, setUserJobs] = useState([])
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if(!id || id === ":id") { navigate('/') }

    const fetchUserData = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchUserData(token, id)
      setUser(data)
    }

    const fetchData = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchUserJobs(token, id)
      const formattedRows = data?.map(r => JobsRowFormatter(r))
      setUserJobs(formattedRows)
    }

    fetchUserData();
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <Wrapper title={"Info Cliente"}>
      <>
        <ProfileInfoCard
          info={{
            empresa: user?.fantasy_name,
            nombre: `${user?.first_name} ${user?.last_name}`,
            CUIT: user?.cuit,
            teléfono: user?.phone,
            email: user?.email,
          }}
          social={[]}
          action={{ route: "", tooltip: "Editar Perfil" }}
          shadow={false}
        />
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
