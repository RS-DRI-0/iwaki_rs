import { Button, Modal } from "antd";
import React from "react";
import language from "../../../../language.json";
import PropTypes from "prop-types";

const ModalConfirmMaximum2Image = ({
  showModalConfirmMaximum2Image,
  closeModalConfirmMaximum2Image,
}) => {
  const chooseLanguage = sessionStorage.getItem("choosedLanguage");

  return (
    <Modal
      className="ModalConfirm"
      open={showModalConfirmMaximum2Image}
      closable={false}
      footer={null}
      // width="328px"
      centered
      style={{ textAlign: "center" }}
    >
      <div className="TitleUpdateModal">
        <span>{language[chooseLanguage].maximum_2_photo}</span>
      </div>

      <Button
        className="TitleUpdateModalButton"
        onClick={closeModalConfirmMaximum2Image}
      >
        <span>{language[chooseLanguage].ok}</span>
      </Button>
    </Modal>
  );
};

ModalConfirmMaximum2Image.propTypes = {
  showModalConfirmMaximum2Image: PropTypes.any,
  closeModalConfirmMaximum2Image: PropTypes.any,
};

export default ModalConfirmMaximum2Image;
