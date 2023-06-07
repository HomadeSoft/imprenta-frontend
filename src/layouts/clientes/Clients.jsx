import DataTable from "../../examples/Tables/DataTable";
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import {ClientsRowFormatter} from "./utils";
import {useAuth0} from "@auth0/auth0-react";


const TableColumns = [
  { Header: "Nombre y Apellido", accessor: "name", align: "center" },
  { Header: "Email", accessor: "email", align: "center" },
  { Header: "Teléfono", accessor: "phone", align: "center" },
  { Header: "CUIT", accessor: "cuit", align: "center" },
  { Header: "Nombre Fantasia", accessor: "fantasy_name", align: "left" },
  { Header: "", accessor: "view", align: "right" },
]

const Clientes = () => {
  const [rows, setRows] = useState([])
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getInfo = async () => {
      const token = await getAccessTokenSilently();
      const { data } = await DataService.fetchUsers(token)
      // debugger
      setRows(data.map(r => ClientsRowFormatter(r)))
    };

    getInfo()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Wrapper title={"Clientes"}>
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
