import React from "react";
import ModalSelectPumpType from "./ModalSelectPumpType";
import PropTypes from "prop-types";

const SelectPumpType = ({
  showModalSelectPumpType,
  setShowModalSelectPumpType,
  handleChangeSelectOptions,
  fileLanguage,
  items2,
  items,
  iconArrowDropDown,
}) => {
  const handleCancelModalSelectPumpType = () => {
    setShowModalSelectPumpType(false);
  };

  return (
    <ModalSelectPumpType
      showModalSelectPumpType={showModalSelectPumpType}
      handleCancelModalSelectPumpType={handleCancelModalSelectPumpType}
      handleChangeSelectOptions={handleChangeSelectOptions}
      fileLanguage={fileLanguage}
      items={items}
      items2={items2}
      iconArrowDropDown={iconArrowDropDown}
    />
  );
};

SelectPumpType.propTypes = {
  showModalSelectPumpType: PropTypes.bool,
  items: PropTypes.array,
  setShowModalSelectPumpType: PropTypes.func,
  handleChangeSelectOptions: PropTypes.func,
  iconArrowDropDown: PropTypes.string,

  fileLanguage: PropTypes.array,
  items2: PropTypes.array,
}



export default SelectPumpType;
