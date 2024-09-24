import { IconButton } from "@mui/material";
import { Button, Modal } from "antd";
import React from "react";
import StartNone from "../../../../images/StartNone.svg";
import StartClick from "../../../../images/StartClick.svg";
import language from "../../../../language.json";
import PropTypes from "prop-types";

const ModalConfirmUploadImageCapture = ({
  showModalUploadImageCapture,
  showModalCheckImageCapture,
  closeModalUploadImageCapture,
  buttonPrioritize,
  isPrioritize,
}) => {
  const chooseLanguage = sessionStorage.getItem("choosedLanguage");

  return (
    <Modal
      className="ModalConfirm"
      open={showModalUploadImageCapture}
      // width="328px"
      closable={false}
      footer={null}
      centered
      style={{ textAlign: "center" }}
      maskClosable={false}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton onClick={buttonPrioritize}>
          {isPrioritize === true ? (
            <img src={StartClick} alt="" />
          ) : (
            <img src={StartNone} alt="" />
          )}
        </IconButton>
      </div>
      <div className="TitleUpdateModal">
        <span
          style={{
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "22px",
            fontFamily: "Lato",
            color: "#337AEE",
          }}
        >
          {language[chooseLanguage].prioritize}
        </span>
      </div>
      <div className="ButtonUpdateModal">
        <Button
          className="buttonModalConfirmUpload btnCancelConfirmUpload"
          onClick={closeModalUploadImageCapture}
        >
          <span>{language[chooseLanguage].cancel}</span>
        </Button>
        <Button
          className="buttonModalConfirmUpload btnOkConfirmUpload"
          onClick={showModalCheckImageCapture}
        >
          <span> {language[chooseLanguage].upload}</span>
        </Button>
      </div>
    </Modal>
  );
};

ModalConfirmUploadImageCapture.propTypes = {
  showModalUploadImageCapture: PropTypes.any,
  showModalCheckImageCapture: PropTypes.any,
  closeModalUploadImageCapture: PropTypes.any,
  buttonPrioritize: PropTypes.any,
  isPrioritize: PropTypes.any,
};

export default ModalConfirmUploadImageCapture;
