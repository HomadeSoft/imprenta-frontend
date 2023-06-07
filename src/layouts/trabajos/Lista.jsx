import DataTable from "examples/Tables/DataTable";

// Dashboard components
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import {JobsRowFormatter} from "./utils";
import {useAuth0} from "@auth0/auth0-react";


const TableColumns = [
  { Header: "Cliente", accessor: "cliente", align: "left" },
  { Header: "Fecha", accessor: "fecha", align: "center" },
  { Header: "Estado", accessor: "estado", align: "center" },
  { Header: "Total", accessor: "total", align: "left" },
  { Header: "Archivos", accessor: "archivos", align: "center" },
  { Header: "Info", accessor: "info", align: "center" },
]

function Lista() {
  const [rows, setRows] = useState([])
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getInfo = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchPendingJobs(token)
      const formattedRows = data?.map(r => JobsRowFormatter(r))
      setRows(formattedRows)
    };

    getInfo()
  }, [])

  return (
    <Wrapper title={"Todos los Trabajos"}>
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

export default Lista;
