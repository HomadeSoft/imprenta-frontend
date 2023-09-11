import DataTable from "examples/Tables/DataTable";

// Dashboard components
import { useEffect, useState } from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import { JobsRowFormatter } from "./utils";
import { useAuth0 } from "@auth0/auth0-react";
import SearchBar from "../search/SearchBar";
import AuthService from "../../authContexts/AuthService";

const TableColumns = [
  { Header: "Cliente", accessor: "cliente", align: "center", width: 700 },
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

function Lista() {
  const [rows, setRows] = useState([])
  const { getAccessTokenSilently, user } = useAuth0();
  const isAdmin = AuthService.isAdmin(user?.email)

  useEffect(() => {
    const getInfo = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchAllJobs(token)
      const formattedRows = data?.map(r => JobsRowFormatter(r, token))
      setRows(formattedRows)
    };

    getInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getData = async (param) => {
    const token = await getAccessTokenSilently();
    const { data } = await DataService.fetchAllJobs(token, param)
    const formattedRows = data?.map(r => JobsRowFormatter(r, token))

    setRows(formattedRows)
  }

  return (
    <Wrapper title={"Todos los Trabajos"}>
      { isAdmin && <SearchBar getData={getData} searchAttributes={"Nombre o Email de Usuario"}/> }
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
