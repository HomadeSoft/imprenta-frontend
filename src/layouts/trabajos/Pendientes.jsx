import DataTable from "examples/Tables/DataTable";
import {Navigate} from "react-router-dom";

// Dashboard components
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import {JobsRowFormatter} from "./utils";
import {useAuth0} from "@auth0/auth0-react";


const TableColumns = [
  { Header: "cliente", accessor: "cliente", align: "left" },
  { Header: "fecha", accessor: "fecha", align: "center" },
  { Header: "estado", accessor: "estado", align: "center" },
  { Header: "total", accessor: "total", align: "left" },
  { Header: "archivos", accessor: "archivos", align: "center" },
  { Header: "Trabajo", accessor: "trabajo", align: "center" },
  { Header: "Copias", accessor: "copias", align: "center" },
  { Header: "Doble Faz", accessor: "doble_faz", align: "center" },
  { Header: "info", accessor: "info", align: "center" },
]

function Pendientes() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [rows, setRows] = useState([])

  useEffect(() => {
    const getInfo = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchPendingJobs(token);
      const formattedRows = data?.map(r => JobsRowFormatter(r))
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
