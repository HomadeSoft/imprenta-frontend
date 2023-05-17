import React, {useEffect, useState} from "react";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit"
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PriceTable from "examples/Tables/PriceTable";
import {Accordion, AccordionDetails, AccordionSummary, Box, Fab} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Wrapper from "layouts/Wrapper";
import EditableTableCell from "components/EditableTableCell";
import DataService from "../../services/DataService";

function Precios() {
  
  const [expanded, setExpanded] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const {data, error} = await DataService.fetchPrices()
      setCategorias(data)
    }

    fetchData();
  }, [])

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleUpdate = (categoryIndex, paperIndex, quantityIndex, optionsIndex) => (event) => {
        let categoriasNew = [...categorias];
        categoriasNew[categoryIndex].papel[paperIndex].quantities[quantityIndex].options[optionsIndex].value = event.target.value;
        setCategorias([...categorias]);
      };

  const savePrices = async () => {
    const {data, error} = await DataService.savePrices(categorias)
  }

  var lista = [];
  var categoryIndex = 0;

  if (categorias.length) {
    categorias.forEach(categoria => {
      const title = <MDTypography>{categoria.printSize}</MDTypography>;
      var papel = [];
      var paperIndex = 0;
      categoria.papel.forEach(elemento => {
        var rows = [];
        const columns = [];
        var quantityIndex = 0;
        elemento.quantities.forEach(quantity => {
          var row = {};
          row["cantidad"] = (<MDTypography variant="button" color="text" fontWeight="regular">{quantity.min}-{quantity.max}</MDTypography>);
          var optionsIndex = 0;
          quantity.options.forEach(option => {
            row[option.description] = (editing ?
              <EditableTableCell value={option.value} onBlur={handleUpdate(categoryIndex, paperIndex, quantityIndex, optionsIndex)}/> :
              <MDTypography variant="button" color="text" fontWeight="bold">{option.value}</MDTypography>);
            optionsIndex++;
          });
          quantityIndex++;
          rows.push(row)
        });
        Object.keys(rows[0]).forEach(key => {
          columns.push({Header: key, accessor: key, align: "center"});
        })

        papel.push(<Accordion expanded={expanded === elemento.gramaje + categoria.printSize}
                              onChange={handleChange(elemento.gramaje + categoria.printSize)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <MDTypography sx={{width: '33%', flexShrink: 0}}>
              {elemento.gramaje === null ? "sin papel" : (elemento.gramaje)}
            </MDTypography>
            <MDTypography sx={{width: '33%', flexShrink: 0}} fontWeight={"light"} color={"secondary"}>
              {
                elemento.caracteristicas.map((caracteristica) => " | " + caracteristica.charAt(0).toUpperCase() + caracteristica.slice(1))
              }
            </MDTypography>
          </AccordionSummary>
          <AccordionDetails>
            <PriceTable
              table={{columns: columns, rows: rows}}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </AccordionDetails>
        </Accordion>);
        paperIndex++;
      });
      lista.push(
        <MDBox>
          <MDBox mx={2} mt={3} py={3} px={2}>
            <MDTypography variant="h6">{title}</MDTypography>
            {papel}
          </MDBox>
        </MDBox>
      );
      categoryIndex++;
    });
  }

  return (
    <div>
      <Wrapper title="Lista de Precios">
        {lista}
      </Wrapper>
      <Box sx={{
        '& > :not(style)': {m: 1},
        position: 'fixed',
        bottom: 16,
        right: 16,
      }}>
        <Fab color="primary" aria-label="add" onClick={() => {
          if (editing){ savePrices() }

          setEditing(!editing);
        }}>
          {editing ? <SaveIcon fontSize={"large"}/> : <EditIcon fontSize={"large"}/> }
        </Fab>
      </Box>
    </div>


  );
}


export default React.memo(Precios);
