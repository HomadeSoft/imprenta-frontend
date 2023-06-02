import DataTable from "../../examples/Tables/DataTable";
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import Wrapper from "../Wrapper";
import {ClientsRowFormatter} from "./utils";


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

  useEffect(() => {
    const getInfo = async () => {
      // eslint-disable-next-line no-unused-vars
      const {data, error} = await DataService.fetchUsers()
      // debugger
      setRows(data.map(r => ClientsRowFormatter(r)))
    };

    getInfo()
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
