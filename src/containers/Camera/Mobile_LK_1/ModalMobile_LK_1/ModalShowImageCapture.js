import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { Badge, Col, Modal, Row } from "antd";
import React from "react";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import ModalConfirmUploadImageCapture from "./ModalConfirmUploadImageCapture";
import ModalConfirmLessThan5Images from "./ModalConfirmLessThan5Images";
import ModalConfirmLessThan2Images from "./ModalConfirmLessThan2Images";
import UploadModal from "../../../../images/UploadModal.svg";
import Arrow_Back from "../../../../images/arrow_back_ios_new.svg";
import PlusSquare from "../../../../images/PlusSquare.svg";
import Retweet from "../../../../images/Retweet.svg";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import PropTypes from "prop-types";

const ModalShowImageCapture = ({
  isModalOpenImageCapture,
  screenHeight,
  screenWidth,
  contentStyle,
  handleOkImageCapture,
  handleCancelImageCapture,
  imageList,
  showModal,
  handleDeleteImageCapture,
  handleSubmitImageCapture,
  showModalUploadImageCapture,
  showModalCheckImageCapture,
  closeModalUploadImageCapture,
  buttonPrioritize,
  isPrioritize,
  isDataQRCode,
  showModalConfirmLessThan5Images,
  closeModalConfirmLessThan5Images,
  showModalConfirmLessThan2Images,
  closeModalConfirmLessThan2Images,
  imageListCheckSheet,
  valueCheckBoxRadio,
  handleClickRotateLeft,
  handleClickRotateRight,
}) => {
  const screenSize = screenHeight > screenWidth;
  return (
    <>
      <Modal
        open={isModalOpenImageCapture}
        onOk={handleOkImageCapture}
        onCancel={handleCancelImageCapture}
        centered
        maskClosable={false}
        title={null}
        closable={false}
        // width={dynamicWidth}
        className="modal-check-sheet"
        footer={[
          <Row style={{ textAlign: "center", margin: "auto" }} key="footer-row">
            <Col
              span={8}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {imageList.length > 0 ? (
                <Badge
                  count={imageList.length}
                  className="modal-show-image-capture-badge"
                >
                  <button
                    onClick={showModal}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                    aria-label="Open image modal"
                  >
                    <img
                      src={imageList[imageList.length - 1].imageBase64}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt="Captured"
                    />
                  </button>
                </Badge>
              ) : (
                <FontAwesomeIcon
                  icon={faImage}
                  style={{ fontSize: 40, color: "#fff" }}
                  onClick={showModal}
                />
              )}
            </Col>
            <Col span={8} style={{ margin: "auto" }}>
              <IconButton key="back" onClick={handleOkImageCapture}>
                <img src={PlusSquare} alt="" />
              </IconButton>
            </Col>
            <Col span={8} style={{ margin: "auto" }}>
              <IconButton key="back" onClick={handleDeleteImageCapture}>
                <img src={Retweet} alt="" />
              </IconButton>
            </Col>
          </Row>,
        ]}
      >
        <Row style={{ padding: "0 10px", alignItems: "center" }}>
          <Col span={8}>
            <IconButton onClick={handleCancelImageCapture}>
              <img src={Arrow_Back} alt="" />
            </IconButton>
          </Col>
          <Col span={8}>
            {isDataQRCode !== "" && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "12px" }}>
                  Modal Name:{" "}
                  {isDataQRCode.split('","')[1].replace('"', "").trim()}
                </span>
                <span style={{ fontSize: "12px" }}>
                  MFG No: {isDataQRCode.split('","')[3].replace('"', "").trim()}
                </span>
                <span style={{ fontSize: "12px" }}>
                  Item No:{" "}
                  {isDataQRCode.split('","')[0].replace('"', "").trim()}
                </span>
              </div>
            )}
          </Col>
          <Col span={8}>
            <IconButton
              style={{ float: "right" }}
              onClick={handleSubmitImageCapture}
            >
              <img src={UploadModal} alt="" />
            </IconButton>
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
        <div style={{ display: "flex", width: "100%", height: "55svh" }}>
          <div style={contentStyle}>
            {imageList.length > 0 && (
              <img
                src={imageList[imageList.length - 1].imageBase64}
                style={
                  screenSize
                    ? {
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }
                    : {
                        width: "100%",
                        objectFit: "contain",
                        height: "100%",
                      }
                }
                alt={imageList[imageList.length - 1].imageName}
              />
            )}
          </div>
        </div>
      </Modal>

      <ModalConfirmUploadImageCapture
        showModalUploadImageCapture={showModalUploadImageCapture}
        showModalCheckImageCapture={showModalCheckImageCapture}
        closeModalUploadImageCapture={closeModalUploadImageCapture}
        imageList={imageList}
        buttonPrioritize={buttonPrioritize}
        isPrioritize={isPrioritize}
      />

      <ModalConfirmLessThan5Images
        showModalConfirmLessThan5Images={showModalConfirmLessThan5Images}
        closeModalConfirmLessThan5Images={closeModalConfirmLessThan5Images}
      />

      <ModalConfirmLessThan2Images
        showModalConfirmLessThan2Images={showModalConfirmLessThan2Images}
        closeModalConfirmLessThan2Images={closeModalConfirmLessThan2Images}
      />
    </>
  );
};

ModalShowImageCapture.propTypes = {
  isModalOpenImageCapture: PropTypes.any,
  screenHeight: PropTypes.any,
  screenWidth: PropTypes.any,
  contentStyle: PropTypes.any,
  handleOkImageCapture: PropTypes.any,
  handleCancelImageCapture: PropTypes.any,
  imageList: PropTypes.any,
  showModal: PropTypes.any,
  handleDeleteImageCapture: PropTypes.any,
  handleSubmitImageCapture: PropTypes.any,
  showModalUploadImageCapture: PropTypes.any,
  showModalCheckImageCapture: PropTypes.any,
  closeModalUploadImageCapture: PropTypes.any,
  buttonPrioritize: PropTypes.any,
  isPrioritize: PropTypes.any,
  isDataQRCode: PropTypes.any,
  showModalConfirmLessThan5Images: PropTypes.any,
  closeModalConfirmLessThan5Images: PropTypes.any,
  showModalConfirmLessThan2Images: PropTypes.any,
  closeModalConfirmLessThan2Images: PropTypes.any,
  imageListCheckSheet: PropTypes.any,
  valueCheckBoxRadio: PropTypes.any,
  handleClickRotateLeft: PropTypes.any,
  handleClickRotateRight: PropTypes.any,
};

export default ModalShowImageCapture;
