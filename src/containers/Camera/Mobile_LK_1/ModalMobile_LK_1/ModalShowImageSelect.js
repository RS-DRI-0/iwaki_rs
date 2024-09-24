import { Button, Checkbox, Col, Modal, Row, Upload } from "antd";
import React from "react";
import UploadModal from "../../../../images/iconUploadCapture.svg";
import iconAddItem from "../../../../images/iconAddItem.svg";
import trashIcon from "../../../../images/trashIcon.svg";
import ModalConfirmUploadImageCapture from "./ModalConfirmUploadImageCapture";
import ModalConfirmLessThan5Images from "./ModalConfirmLessThan5Images";
import ModalConfirmLessThan2Images from "./ModalConfirmLessThan2Images";
import { CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const ModalShowImageSelect = ({
  isModalImageVisible,
  handleCancel,
  countCheckedImages,
  fileLanguage,
  chooseLanguage,
  isChoose,
  setIsChoose,
  clickChooseImageDelete,
  imageList,
  onClickCheckImage,
  uploadProps,
  customUpload,
  isPrioritize,
  handleDeleteImages,
  setImageList,
  buttonPrioritize,
  showModalUploadImageCapture,
  showModalCheckImageCapture,
  closeModalUploadImageCapture,
  handleSubmitImageCapture,
  showModalConfirmLessThan5Images,
  closeModalConfirmLessThan5Images,
  showModalConfirmLessThan2Images,
  closeModalConfirmLessThan2Images,
}) => {
  const handleChangeCheckbox = (e) => {
    console.log(e);
  };

  const checkAllImage = () => {
    setIsChoose(true);
    // let newArr = []
    const newArr = imageList.map((item) => {
      return {
        ...item,
        imageCheck: true,
      };
    });

    setImageList(newArr);
  };

  return (
    <div className="ModalShowImageSelect">
      <Modal
        className="ModalViewImageSelect"
        wrapClassName="wrapModalViewImageSelect"
        open={isModalImageVisible}
        closable={false}
        footer={null}
        style={{ top: "30px" }}
      >
        <div className="HeaderModalSelect">
          <Row style={{ height: "5svh" }}>
            <Col
              span={7}
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              {imageList.length !== 0 && (
                <>
                  {isChoose ? (
                    <button
                      className="btnChoose"
                      onClick={clickChooseImageDelete}
                    >
                      <span className="buttonChoose">
                        {fileLanguage[chooseLanguage].cancel}
                      </span>
                    </button>
                  ) : (
                    <button
                      className="btnChoose"
                      onClick={clickChooseImageDelete}
                    >
                      <span className="buttonChoose">
                        {fileLanguage[chooseLanguage].select}
                      </span>
                    </button>
                  )}
                </>
              )}
            </Col>
            <Col
              span={10}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {countCheckedImages() > 0 ? (
                <span className="spanTitleHeader">
                  {fileLanguage[chooseLanguage].image_selected.replace(
                    "†",
                    countCheckedImages()
                  )}
                </span>
              ) : (
                <span className="spanTitleHeader">
                  {fileLanguage[chooseLanguage].captured_image}
                </span>
              )}
            </Col>
            <Col
              span={7}
              style={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              <Button className="btn-view-detail" onClick={handleCancel}>
                <CloseOutlined />
              </Button>
            </Col>
          </Row>
        </div>
        <div className="content-image">
          <div className="imageGallery">
            {imageList.map((image, index) => (
              <button
                key={image.id}
                className="image-item"
                onClick={() => onClickCheckImage(index)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <img
                  className="imageSourceGalley"
                  src={image.imageBase64}
                  alt={image.imageName}
                />
                {isChoose ? (
                  <Checkbox
                    className="inputChooseSelect"
                    checked={image.imageCheck}
                    alt={image.imageName}
                    style={{ width: "18px", height: "18px" }}
                    onChange={(e) => handleChangeCheckbox(e)}
                  />
                ) : null}
              </button>
            ))}

            <Upload
              className="btnUploadImport"
              {...uploadProps}
              fileList={[]}
              listType="picture"
              accept=".png,.jpg,.jpeg,.tif"
              customRequest={customUpload}
            >
              <img src={iconAddItem} className="buttonImport" alt="" />
            </Upload>
          </div>
        </div>

        <div
          style={{
            marginTop: "4%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "0% 0% 4% 5%",
          }}
        >
          <button className="btnChoose" onClick={checkAllImage}>
            <span className="buttonChoose">
              {fileLanguage[chooseLanguage].select_all}
            </span>
          </button>
        </div>

        {imageList.length === 0 ? (
          <></>
        ) : (
          <div className="footerModal">
            <div className="divDeleteBtn">
              {countCheckedImages() > 0 ? (
                <button className="deleteButton" onClick={handleDeleteImages}>
                  <img className="button-delete" src={trashIcon} alt="" />
                </button>
              ) : null}
            </div>
            <div className="divUploadBtn">
              {isChoose ? (
                <></>
              ) : (
                <button
                  className="uploadButton"
                  onClick={handleSubmitImageCapture}
                >
                  <img className="button-upload" src={UploadModal} alt="" />
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {showModalConfirmLessThan5Images ? (
        <ModalConfirmLessThan5Images
          showModalConfirmLessThan5Images={showModalConfirmLessThan5Images}
          closeModalConfirmLessThan5Images={closeModalConfirmLessThan5Images}
        />
      ) : null}
      <ModalConfirmLessThan2Images
        showModalConfirmLessThan2Images={showModalConfirmLessThan2Images}
        closeModalConfirmLessThan2Images={closeModalConfirmLessThan2Images}
      />

      <ModalConfirmUploadImageCapture
        showModalUploadImageCapture={showModalUploadImageCapture}
        showModalCheckImageCapture={showModalCheckImageCapture}
        closeModalUploadImageCapture={closeModalUploadImageCapture}
        imageList={imageList}
        buttonPrioritize={buttonPrioritize}
        isPrioritize={isPrioritize}
      />
    </div>
  );
};

ModalShowImageSelect.propTypes = {
  isModalImageVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  countCheckedImages: PropTypes.func,
  fileLanguage: PropTypes.any,
  chooseLanguage: PropTypes.string,
  isChoose: PropTypes.bool,
  setIsChoose: PropTypes.any,
  clickChooseImageDelete: PropTypes.func,
  imageList: PropTypes.array,
  onClickCheckImage: PropTypes.func,
  uploadProps: PropTypes.func,
  customUpload: PropTypes.func,
  isPrioritize: PropTypes.bool,
  handleDeleteImages: PropTypes.func,
  setImageList: PropTypes.any,
  buttonPrioritize: PropTypes.func,
  showModalUploadImageCapture: PropTypes.bool,
  showModalCheckImageCapture: PropTypes.func,
  closeModalUploadImageCapture: PropTypes.func,
  handleSubmitImageCapture: PropTypes.func,
  showModalConfirmLessThan5Images: PropTypes.bool,
  closeModalConfirmLessThan5Images: PropTypes.func,
  showModalConfirmLessThan2Images: PropTypes.bool,
  closeModalConfirmLessThan2Images: PropTypes.func,
};

export default ModalShowImageSelect;
