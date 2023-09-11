import DataTable from "../../examples/Tables/DataTable";
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import {ClientsRowFormatter} from "./utils";
import {useAuth0} from "@auth0/auth0-react";
import SearchBar from "../search/SearchBar";
import AuthService from "../../authContexts/AuthService";

const TableColumns = [
  { Header: "Nombre y Apellido", accessor: "name", align: "center" },
  { Header: "Email", accessor: "email", align: "center" },
  { Header: "Teléfono", accessor: "phone", align: "center" },
  { Header: "CUIT", accessor: "cuit", align: "center" },
  { Header: "Nombre Fantasia", accessor: "fantasy_name", align: "left" },
  { Header: "", accessor: "view", align: "right" },
]

const Clientes = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [rows, setRows] = useState([])
  const isAdmin = AuthService.isAdmin(user?.email)

  useEffect(() => {
    const getInfo = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchUsers(token)
      const formattedRows = data?.map(r => ClientsRowFormatter(r))
      if (formattedRows?.length){
        setRows(formattedRows)
      }
    };

    getInfo()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getData = async (param) => {
    const token = await getAccessTokenSilently();
    const { data } = await DataService.fetchUsers(token, param)
    const formattedRows = data?.map(r => ClientsRowFormatter(r))

    setRows(formattedRows)
  }

  return (
    <Wrapper title={"Clientes"}>
      { isAdmin && <SearchBar getData={getData} searchAttributes={"Nombre, Apellido, Email, Nombre de Fantasia o Cuit"}/> }
      <DataTable
        table={{ columns: TableColumns, rows: rows }}
        isSorted={false}
        entriesPerPage={false}
        showTotalEntries={false}
        canSearch={true}
        noEndBorder
      />
    </Wrapper>
  )
}

export default Clientes
