import {
  PlusSquareOutlined,
  RetweetOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Col, Modal, Row } from "antd";
import React from "react";
import ModalConfirmUploadImageCapture from "./ModalConfirmUploadImageCapture";
import PropTypes from "prop-types";

const ModalShowImageCheckSheet = ({
  isModalOpenCheckSheet,
  handleOkCheckSheet,
  handleCancelCheckSheet,
  handleAddImageCheckSheet,
  handleDeleteImageCheckSheet,
  handleUploadImageCheckSheet,
  dynamicHeight,
  currentCheckSheet,
  prevCheckSheet,
  stepsCheckSheet,
  contentStyle,
  nextCheckSheet,
  showModalUploadImageCapture,
  showModalCheckImageCapture,
  closeModalUploadImageCapture,
  buttonPrioritize,
  isPrioritize,
  handleDeleteIndexImageCheckSheet,
}) => {
  const storedImageList1 = JSON.parse(
    localStorage.getItem("imageListCheckSheet")
  );
  return (
    <>
      <Modal
        open={isModalOpenCheckSheet}
        onOk={handleOkCheckSheet}
        onCancel={handleCancelCheckSheet}
        centered
        maskClosable={false}
        title={null}
        closable={false}
        width="100%"
        className="modal-check-sheet"
        footer={[
          <Row style={{ textAlign: "center" }} key="footer-row">
            <Col span={8}>
              {storedImageList1 && storedImageList1.length === 2 ? (
                <IconButton
                  key="back"
                  onClick={handleDeleteIndexImageCheckSheet}
                >
                  <DeleteOutline />
                </IconButton>
              ) : (
                <IconButton key="back" onClick={handleAddImageCheckSheet}>
                  <PlusSquareOutlined />
                </IconButton>
              )}
            </Col>
            <Col span={8}>
              <IconButton key="back" onClick={handleDeleteImageCheckSheet}>
                <RetweetOutlined />
              </IconButton>
            </Col>
            <Col span={8}>
              <IconButton key="back" onClick={handleUploadImageCheckSheet}>
                <RightSquareOutlined />
              </IconButton>
            </Col>
          </Row>,
        ]}
      >
        <div style={{ display: "flex", width: "100%", height: dynamicHeight }}>
          <IconButton
            disabled={currentCheckSheet === 0}
            onClick={() => prevCheckSheet()}
            className="icon-button-check-sheet"
          >
            <ArrowBackIosOutlined />
          </IconButton>
          {stepsCheckSheet.length !== 0 && (
            <div style={contentStyle}>
              {stepsCheckSheet[currentCheckSheet].content}
            </div>
          )}

          <IconButton
            onClick={() => nextCheckSheet()}
            disabled={currentCheckSheet === stepsCheckSheet.length - 1}
            className="icon-button-check-sheet"
          >
            <ArrowForwardIosOutlined />
          </IconButton>
        </div>
      </Modal>

      <ModalConfirmUploadImageCapture
        showModalUploadImageCapture={showModalUploadImageCapture}
        showModalCheckImageCapture={showModalCheckImageCapture}
        closeModalUploadImageCapture={closeModalUploadImageCapture}
        imageList={stepsCheckSheet}
        buttonPrioritize={buttonPrioritize}
        isPrioritize={isPrioritize}
      />
    </>
  );
};

ModalShowImageCheckSheet.propTypes = {
  isModalOpenCheckSheet: PropTypes.any,
  handleOkCheckSheet: PropTypes.any,
  handleCancelCheckSheet: PropTypes.any,
  handleAddImageCheckSheet: PropTypes.any,
  handleDeleteImageCheckSheet: PropTypes.any,
  handleUploadImageCheckSheet: PropTypes.any,
  dynamicHeight: PropTypes.any,
  currentCheckSheet: PropTypes.any,
  prevCheckSheet: PropTypes.any,
  stepsCheckSheet: PropTypes.any,
  contentStyle: PropTypes.any,
  nextCheckSheet: PropTypes.any,
  showModalUploadImageCapture: PropTypes.any,
  showModalCheckImageCapture: PropTypes.any,
  closeModalUploadImageCapture: PropTypes.any,
  buttonPrioritize: PropTypes.any,
  isPrioritize: PropTypes.any,
  handleDeleteIndexImageCheckSheet: PropTypes.any,
};

export default ModalShowImageCheckSheet;
