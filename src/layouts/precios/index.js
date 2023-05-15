import React, {useState} from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PriceTable from "examples/Tables/PriceTable";
import bajadasSinPapel from "layouts/precios/data/bajadasSinPapel";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Wrapper from "layouts/Wrapper";

function Precios() {
  const categorias = bajadasSinPapel(false, "nuevo");

  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  var lista = [];
  categorias.forEach(categoria => {
    const title = <MDTypography>{categoria.printSize}</MDTypography>;
    var papel = [];
    categoria.papel.forEach(elemento => {
      var rows = [];
      const columns = [];
      elemento.quantities.forEach(quantity => {
        var row = {};
        row["cantidad"] = (<MDTypography variant="button" color="text" fontWeight="regular">{quantity.min}-{quantity.max}</MDTypography>);
        quantity.options.forEach(option => {
          row[option.description] = (<MDTypography variant="button" color="text" fontWeight="bold">{option.value}</MDTypography>);
        });

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
              elemento.caracteristicas.map((caracteristica) => "[" + caracteristica + "] ")
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

    });
    lista.push(
      <MDBox>
        <MDBox mx={2} mt={3} py={3} px={2}>
          <MDTypography variant="h6">
            {title}
          </MDTypography>
          {
            papel.map((gramaje) => gramaje)
          }
        </MDBox>
      </MDBox>
    );
  });
  return (
    <Wrapper title="Lista de Precios">
      {lista}
    </Wrapper>
  );
}


export default Precios;
