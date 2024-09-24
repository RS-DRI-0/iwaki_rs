import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import IconDeleteFilter from "../../../images/file_manager/IconDeleteFilter.svg";

const ClearDataSearch = ({ handleClearDataSearch }) => {
  return (
    <Tooltip title="Clear">
      <IconButton onClick={handleClearDataSearch}>
        <img alt="" src={IconDeleteFilter} />
      </IconButton>
    </Tooltip>
  );
};

ClearDataSearch.propTypes = {
  handleClearDataSearch: PropTypes.func,
};

export default ClearDataSearch;
