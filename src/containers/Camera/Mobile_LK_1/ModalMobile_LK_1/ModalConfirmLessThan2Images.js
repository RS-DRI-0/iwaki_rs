import { Button, Modal } from "antd";
import React from "react";
import language from "../../../../language.json";
import PropTypes from "prop-types";

const ModalConfirmLessThan2Images = ({
  showModalConfirmLessThan2Images,
  closeModalConfirmLessThan2Images,
}) => {
  const chooseLanguage = sessionStorage.getItem("choosedLanguage");
  return (
    <Modal
      className="ModalConfirm"
      open={showModalConfirmLessThan2Images}
      closable={false}
      footer={null}
      // width="328px"
      centered
      style={{ textAlign: "center" }}
    >
      <div className="TitleUpdateModal">
        <span style={{ fontWeight: 600, fontSize: "18px", lineHeight: "22px" }}>
          {/* The photo set has less than 2 photos. Please upload more. */}

          {language[chooseLanguage].less_than_2_photo}
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
        onClick={closeModalConfirmLessThan2Images}
      >
        {language[chooseLanguage].ok}
      </Button>
    </Modal>
  );
};

ModalConfirmLessThan2Images.propTypes = {
  showModalConfirmLessThan2Images: PropTypes.any,
  closeModalConfirmLessThan2Images: PropTypes.any,
};

export default ModalConfirmLessThan2Images;
