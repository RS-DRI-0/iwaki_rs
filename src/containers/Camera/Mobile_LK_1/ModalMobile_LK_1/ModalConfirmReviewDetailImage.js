import { Modal } from "antd";
import React from "react";
import PropTypes from "prop-types";

const ModalConfirmReviewDetailImage = ({
  fileLanguage,
  chooseLanguage,
  isModalDeleteReviewDetailImage,
  handleConfirmOkDeleteId,
  handleConfirmCancelDeleteId,
}) => {
  return (
    <Modal
      className="ModalDeleteImageSelect"
      open={isModalDeleteReviewDetailImage}
      closable={false}
      footer={null}
    >
      <div className="TitleDeleteImage">
        {/* <img src={iconDelete} alt="" /> */}
        <span>{fileLanguage[chooseLanguage].confirm_delete_photo}</span>
      </div>
      <div className="ButtonDeleteModal">
        <button
          className="ButtonDeleteAllNo"
          onClick={handleConfirmCancelDeleteId}
        >
          <span>{fileLanguage[chooseLanguage].no}</span>
        </button>
        <button
          className="ButtonDeleteAllYes"
          onClick={handleConfirmOkDeleteId}
        >
          <span>{fileLanguage[chooseLanguage].yes}</span>
        </button>
      </div>
    </Modal>
  );
};

ModalConfirmReviewDetailImage.propTypes = {
  fileLanguage: PropTypes.any,
  chooseLanguage: PropTypes.any,
  isModalDeleteReviewDetailImage: PropTypes.any,
  handleConfirmOkDeleteId: PropTypes.any,
  handleConfirmCancelDeleteId: PropTypes.any,
};

export default ModalConfirmReviewDetailImage;
