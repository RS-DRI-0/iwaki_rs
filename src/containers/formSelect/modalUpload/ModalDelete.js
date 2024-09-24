import { Modal } from "antd";
import React from "react";
import PropTypes from "prop-types";
import "./ModelSelect.css";

const ModalDelete = ({
  imageList,
  setImageList,
  isModalDeleteImage,
  handleDeleteImagesOk,
  handleDeleteCancel,
  fileLanguage,
  chooseLanguage,
}) => {
  return (
    <Modal
      className="ModalDeleteImageSelect"
      open={isModalDeleteImage}
      closable={false}
      footer={null}
    >
      <div className="TitleDeleteImage">
        <span>{fileLanguage[chooseLanguage].confirm_delete_photo}</span>
      </div>
      <div className="ButtonDeleteModal">
        <button className="ButtonDeleteAllNo" onClick={handleDeleteCancel}>
          <span>{fileLanguage[chooseLanguage].no}</span>
        </button>
        <button
          className="ButtonDeleteAllYes"
          onClick={() => handleDeleteImagesOk(imageList, setImageList)}
        >
          <span>{fileLanguage[chooseLanguage].yes}</span>
        </button>
      </div>
    </Modal>
  );
};

ModalDelete.propTypes = {
  imageList: PropTypes.any,
  setImageList: PropTypes.any,
  isModalDeleteImage: PropTypes.any,
  handleDeleteImagesOk: PropTypes.any,
  handleDeleteCancel: PropTypes.any,
  fileLanguage: PropTypes.any,
  chooseLanguage: PropTypes.any,
};

export default ModalDelete;
