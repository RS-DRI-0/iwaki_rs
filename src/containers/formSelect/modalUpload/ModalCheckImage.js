import { Modal } from "antd";
import React from "react";
import "./ModelSelect.css";
import PropTypes from "prop-types";

export default function ModalCheckImage({
  showModalQuestion,
  messageBox,
  multiUploadImages,
  closeModalUpload,
  spanYes,
  spanNo,
}) {
  return (
    <Modal
      className="ModelUploadImage"
      open={showModalQuestion}
      closable={false}
      footer={null}
    >
      <div className="TitleUpdateModal">
        <span>{messageBox}</span>
      </div>
      <div className="ButtonUpdateModal">
        <button className="ButtonUpdateAll" onClick={multiUploadImages}>
          {spanYes}
        </button>
        <button className="ButtonUpdateAll" onClick={closeModalUpload}>
          {spanNo}
        </button>
      </div>
    </Modal>
  );
}

ModalCheckImage.propTypes = {
  showModalQuestion: PropTypes.any,
  messageBox: PropTypes.any,
  multiUploadImages: PropTypes.any,
  closeModalUpload: PropTypes.any,
  spanYes: PropTypes.any,
  spanNo: PropTypes.any,
};
