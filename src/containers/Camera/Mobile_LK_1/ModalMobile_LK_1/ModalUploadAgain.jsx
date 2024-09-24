import { Button, Modal } from "antd";
import React from "react";
import PropTypes from "prop-types";

const ModalUploadAgain = ({ open, setOpenModalTryAgain }) => {
  const handleCancel = () => {
    setOpenModalTryAgain(false);
  };
  return (
    <Modal open={open} onCancel={handleCancel}>
      <Button onClick={handleCancel}>Try Again</Button>
    </Modal>
  );
};

ModalUploadAgain.propTypes = {
  open: PropTypes.bool,
  setOpenModalTryAgain: PropTypes.any,
};

export default ModalUploadAgain;
