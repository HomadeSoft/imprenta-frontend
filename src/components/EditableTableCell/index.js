import React, { useState } from "react";
import { TextField } from "@mui/material";

import PropTypes from "prop-types";

function EditableTableCell({ value, onBlur }) {
  const [tempValue, setTempValue] = useState(value);

  const handleInputChange = (event) => {
    setTempValue(event.target.value);
  };

  return (
    <TextField
      value={tempValue}
      onChange={handleInputChange}
      onBlur={onBlur}
    />
  );
}

EditableTableCell.defaultProps = {
  value: "",
};

EditableTableCell.propTypes = {
  value: PropTypes.string,
  onBlur: PropTypes.func,
};

export default EditableTableCell;
