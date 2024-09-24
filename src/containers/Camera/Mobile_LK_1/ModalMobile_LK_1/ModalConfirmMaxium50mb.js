import { Button, Modal } from "antd";
import React from "react";
import language from "../../../../language.json";
import PropTypes from "prop-types";

const ModalConfirmMaxium50mb = ({
  showModalConfirmMaxium50mb,
  closeModalConfirmMaxium50mb,
}) => {
  const chooseLanguage = sessionStorage.getItem("choosedLanguage");

  return (
    <Modal
      className="ModalConfirm"
      open={showModalConfirmMaxium50mb}
      closable={false}
      footer={null}
      // width="328px"
      centered
      style={{ textAlign: "center" }}
    >
      <div className="TitleUpdateModal">
        <span style={{ fontWeight: 600, fontSize: "18px", lineHeight: "22px" }}>
          Only upload a maximum of 50mb image files
        </span>
      </div>

      <Button
        style={{
          background: "#053457",
          justifyContent: "center",
          color: "#fff",
          width: "100px",
          marginTop: 10,
        }}
        onClick={closeModalConfirmMaxium50mb}
      >
        {language[chooseLanguage].ok}
      </Button>
    </Modal>
  );
};

ModalConfirmMaxium50mb.propTypes = {
  showModalConfirmMaxium50mb: PropTypes.any,
  closeModalConfirmMaxium50mb: PropTypes.any,
};

export default ModalConfirmMaxium50mb;
