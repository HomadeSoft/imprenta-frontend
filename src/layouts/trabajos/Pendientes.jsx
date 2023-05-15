import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

// Dashboard components
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";
import Wrapper from "../Wrapper";
import {JobsRowFormatter} from "./utils";


const TableColumns = [
  { Header: "cliente", accessor: "cliente", align: "left" },
  { Header: "fecha", accessor: "fecha", align: "center" },
  { Header: "estado", accessor: "estado", align: "center" },
  { Header: "total", accessor: "total", align: "left" },
  { Header: "archivos", accessor: "archivos", align: "center" },
  { Header: "info", accessor: "info", align: "center" },
]

function Pendientes() {
  // ACA HACER EL USEEFFECT

  const [rows, setRows] = useState([])

  useEffect(() => {
    const getInfo = async () => {
      const {data, error} = await DataService.fetchPendingJobs()
      const formattedRows = data.map(r => JobsRowFormatter(r))
      setRows(formattedRows)
    };

    getInfo()
  }, [])

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
