import DataTable from "examples/Tables/DataTable";
import {Navigate} from "react-router-dom";

// Dashboard components
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import {JobsRowFormatter} from "./utils";
import {useAuth0} from "@auth0/auth0-react";
import AuthService from "../../authContexts/AuthService";
import SearchBar from "../search/SearchBar";


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
  const isAdmin = AuthService.isAdmin(user?.email)

  const performFetchRequest = async ({ isAdmin, token, user, searchTerm }) => {
    if(isAdmin){
      return await DataService.fetchPendingJobs(token, searchTerm);
    } else {
      return  await DataService.fetchPendingJobsFromUser(token, user.email);
    }
  }

  useEffect(() => {
    const getInfo = async () => {
      const token = await getAccessTokenSilently();
      const response = await performFetchRequest({isAdmin, token, user})

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

  const getData = async (param) => {
    const token = await getAccessTokenSilently();

    const response = await performFetchRequest({ isAdmin, token, user, searchTerm: param })
    const formattedRows = response?.data?.map(r => JobsRowFormatter(r, token))
    setRows(formattedRows)
  }

  return (
    <Wrapper title={"Trabajos Pendientes"}>
      { isAdmin && <SearchBar getData={getData} searchAttributes={"Nombre o Email de Usuario"}/> }
      <DataTable
        table={{ columns: TableColumns, rows: rows }}
        isSorted={true}
        entriesPerPage={false}
        showTotalEntries={false}
        noEndBorder
      />
    </Wrapper>
  );
}

export default Pendientes;
