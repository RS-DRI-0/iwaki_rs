import { Col, Modal, Row } from "antd";
import React from "react";
import iconBackReviewDetail from "../../../../images/iconBackReviewDetail.svg";
import iconTrashModalReviewDetail from "../../../../images/iconTrashModalReviewDetail.svg";
import { IconButton } from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import PropTypes from "prop-types";

const ModalReviewDetailImage = ({
  isModalOpenReviewDetailImage,
  handleOkReviewDetailImage,
  handleCancelReviewDetailImage,
  contentStyle,
  imageListReviewDetailImage,
  handleDeleteIdReviewDetailImage,
  screenHeight,
  screenWidth,
  isDataQRCode,
  handleClickRotateLeft,
  handleClickRotateRight,
}) => {
  const screenSize = screenHeight > screenWidth;

  const dynamicHeight = screenHeight < 500 ? 500 : screenHeight - 115;
  return (
    <Modal
      open={isModalOpenReviewDetailImage}
      onOk={handleOkReviewDetailImage}
      onCancel={handleCancelReviewDetailImage}
      centered
      maskClosable={false}
      title={null}
      closable={false}
      width="100%"
      className="modal-check-sheet"
      footer={false}
    >
      <Row style={{ padding: "0 5px", alignItems: "center" }}>
        <Col
          span={7}
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <button
            style={{
              border: "none",
              background: "transparent",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={handleCancelReviewDetailImage}
          >
            <img src={iconBackReviewDetail} alt="" />
          </button>
        </Col>
        <Col
          span={10}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isDataQRCode !== "" ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px" }}>
                Modal Name:{" "}
                {isDataQRCode.split('","')[1].replace('"', "").trim()}
              </span>
              <span style={{ fontSize: "12px" }}>
                MFG No: {isDataQRCode.split('","')[3].replace('"', "").trim()}
              </span>
              <span style={{ fontSize: "12px" }}>
                Item No: {isDataQRCode.split('","')[0].replace('"', "").trim()}
              </span>
            </div>
          ) : null}
        </Col>
        <Col
          span={7}
          style={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <button
            style={{
              border: "none",
              background: "transparent",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={handleDeleteIdReviewDetailImage}
          >
            <img src={iconTrashModalReviewDetail} alt="" />
          </button>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <IconButton onClick={handleClickRotateLeft}>
            <RotateLeftIcon />
          </IconButton>
          <IconButton
            style={{ marginLeft: 10 }}
            onClick={handleClickRotateRight}
          >
            <RotateRightIcon />
          </IconButton>
        </Col>
      </Row>
      <div style={{ display: "flex", width: "100%", height: dynamicHeight }}>
        <div style={contentStyle}>
          <img
            src={imageListReviewDetailImage.imageBase64}
            alt={imageListReviewDetailImage.imageName}
            style={
              screenSize
                ? { width: "100%", height: "100%", objectFit: "contain" }
                : { width: "100%", objectFit: "contain", height: "auto" }
            }
            key={imageListReviewDetailImage}
          />
        </div>
      </div>
    </Modal>
  );
};

ModalReviewDetailImage.propTypes = {
  isModalOpenReviewDetailImage: PropTypes.any,
  handleOkReviewDetailImage: PropTypes.any,
  handleCancelReviewDetailImage: PropTypes.any,
  contentStyle: PropTypes.any,
  imageListReviewDetailImage: PropTypes.any,
  handleDeleteIdReviewDetailImage: PropTypes.any,
  screenHeight: PropTypes.any,
  screenWidth: PropTypes.any,
  isDataQRCode: PropTypes.any,
  handleClickRotateLeft: PropTypes.any,
  handleClickRotateRight: PropTypes.any,
};

export default ModalReviewDetailImage;
