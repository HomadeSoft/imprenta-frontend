import DataTable from "examples/Tables/DataTable";
import {Navigate} from "react-router-dom";

// Dashboard components
import {useEffect, useRef, useState} from "react";
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
  const dataRef = useRef()
  const isAdmin = AuthService.isAdmin(user?.email)

  const rowUpdater = async (rowId) => {
    dataRef.current.forEach(row => {
      if(row.id === rowId){
        row.archivos_descargados = true
      }
    })

    const token = await getAccessTokenSilently();
    const formattedRows = dataRef.current?.map(r => JobsRowFormatter(r, token, rowUpdater))

    setRows(formattedRows)
  }

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
      const { data } = await performFetchRequest({isAdmin, token, user})

      dataRef.current = data

      const formattedRows = data?.map(r => JobsRowFormatter(r, token, rowUpdater))
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

    const { data } = await performFetchRequest({ isAdmin, token, user, searchTerm: param })
    dataRef.current = data

    const formattedRows = data?.map(r => JobsRowFormatter(r, token, rowUpdater))
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
