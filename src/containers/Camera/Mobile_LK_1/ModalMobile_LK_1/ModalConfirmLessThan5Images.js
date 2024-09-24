import { Button, Modal } from "antd";
import React from "react";
import language from "../../../../language.json";
import PropTypes from "prop-types";

const ModalConfirmLessThan5Images = ({
  showModalConfirmLessThan5Images,
  closeModalConfirmLessThan5Images,
}) => {
  const chooseLanguage = sessionStorage.getItem("choosedLanguage");
  const text = language[chooseLanguage].less_than_2_photo.replace("2", "5");
  return (
    <Modal
      className="ModalConfirm"
      open={showModalConfirmLessThan5Images}
      closable={false}
      footer={null}
      // width="328px"
      centered
      style={{ textAlign: "center" }}
    >
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
          {text}
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
        onClick={closeModalConfirmLessThan5Images}
      >
        {language[chooseLanguage].ok}
      </Button>
    </Modal>
  );
};

ModalConfirmLessThan5Images.propTypes = {
  showModalConfirmLessThan5Images: PropTypes.any,
  closeModalConfirmLessThan5Images: PropTypes.any,
};

export default ModalConfirmLessThan5Images;
