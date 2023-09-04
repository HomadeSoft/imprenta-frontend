import DataTable from "examples/Tables/DataTable";
import {Navigate} from "react-router-dom";

// Dashboard components
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import {JobsRowFormatter} from "./utils";
import {useAuth0} from "@auth0/auth0-react";
import AuthService from "../../authContexts/AuthService";


const TableColumns = [
  { Header: "cliente", accessor: "cliente", align: "left" },
  { Header: "fecha", accessor: "fecha", align: "center" },
  { Header: "estado", accessor: "estado", align: "center" },
  { Header: "total", accessor: "total", align: "left" },
  { Header: "archivos", accessor: "archivos", align: "center" },
  { Header: "Descargados?", accessor: "archivos_descargados", align: "center" },
  { Header: "Trabajo", accessor: "trabajo", align: "center" },
  { Header: "Copias", accessor: "copias", align: "center" },
  { Header: "Doble Faz", accessor: "doble_faz", align: "center" },
  { Header: "info", accessor: "info", align: "center" },
]

function Pendientes() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [rows, setRows] = useState([])

  useEffect(() => {
    const getInfo = async () => {
      const token = await getAccessTokenSilently();

      let response;
      if(AuthService.isAdmin(user?.email)){
        response = await DataService.fetchPendingJobs(token);
      } else {
        response = await DataService.fetchPendingJobsFromUser(token, user.email);
      }

      const formattedRows = response?.data?.map(r => JobsRowFormatter(r, token))
      if(formattedRows?.length){
        setRows(formattedRows)
      }
    };

    if(isAuthenticated) getInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!isAuthenticated){
    return <Navigate to={'/login'} />
  }

  return (
    <Wrapper title={"Trabajos Pendientes"}>
      <DataTable
        table={{ columns: TableColumns, rows: rows }}
        isSorted={false}
        entriesPerPage={false}
        showTotalEntries={false}
        canSearch={true}
        noEndBorder
      />
    </Wrapper>
  );
}

export default Pendientes;
