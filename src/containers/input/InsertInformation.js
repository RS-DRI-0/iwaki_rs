/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Empty, Form, Row, Select, Table } from "antd";
import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import LoadingIcon from "./../../images/iconLoading.svg";
import "./InsertInformation.css";
import { Swiper, SwiperSlide } from "swiper/react";
import PropTypes from "prop-types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import {
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import ModalQA from "./ModalQA";
import NoDataIcon from "../../images/file_manager/NoDataIcon.svg";
import ModalShortcut from "./ModalShortcut";

const { Option } = Select;

const InsertInformation = ({
  shouldDisplayRow,
  checkBtnRotate,
  setRotate,
  rotate,
  mainImageURL,
  thumbnailURL,
  nextImage,
  lockBtnNextPage,
  previousImage,
  lockBtnPreviousPage,
  loadingImage,
  positionZoom,
  loadingTable,
  checkChooseModel,
  changeMainImage,
  indexImage,
  chooseModel,
  listPumb,
  dataDetail,
  form,
  onFinish,
  dataSourceInput,
  columnsInput,
  dynamicHeightInput,
  hotKey,
  dataSourceGrid,
  handleButtonClick,
  columns,
  inputRows,
  dynamicHeightGrid,
  listSymbol,
  handleOpenModalQA,
  loadingBtnSubmit,
  openModalQA,
  handleCloseModalQA,
  handleSubmitModalQA,
  handleChangeModalQA,
  valueQA,
  modalShortcut,
  handleCloseModalShortcut,
}) => {
  const renderImageButtons = () => {
    if (mainImageURL && thumbnailURL.length > 0) {
      return (
        <>
          <Button
            onClick={nextImage}
            disabled={lockBtnNextPage}
            className="btn-next-image"
          >
            <RightOutlined style={{ fontSize: 25, color: "pray" }} />
          </Button>
          <Button
            onClick={previousImage}
            disabled={lockBtnPreviousPage}
            className="btn-previous-image"
          >
            <LeftOutlined style={{ fontSize: 25, color: "pray" }} />
          </Button>
        </>
      );
    }
    return null;
  };

  const renderLoadingState = () => {
    if (!loadingTable) {
      return (
        <div
          style={{
            display: "flex",
            padding: "1% 1% 2%",
            height: "74vh",
            justifyContent: "center",
          }}
        >
          <img
            style={{ width: "7%" }}
            src={LoadingIcon}
            className="load-image-desktop"
            alt=""
          />
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "74vh",
          padding: "1% 1% 2%",
        }}
      >
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  };

  const renderImage = () => (
    <TransformWrapper initialScale={1}>
      {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
        <>
          <Button
            id="reset-zoom"
            onClick={() => resetTransform()}
            style={{ display: "none" }}
          ></Button>
          <Button
            id="zoom-in1"
            onClick={() => setTransform(0, 0, 1.7)}
            style={{ display: "none" }}
          ></Button>
          <Button
            id="zoom-in2"
            onClick={() => setTransform(-positionZoom, 0, 1.7)}
            style={{ display: "none" }}
          ></Button>
          <Button
            id="zoom-in3"
            onClick={() => setTransform(0, -positionZoom, 1.7)}
            style={{ display: "none" }}
          ></Button>
          <Button
            id="zoom-in4"
            onClick={() => setTransform(-positionZoom, -positionZoom, 1.7)}
            style={{ display: "none" }}
          ></Button>
          <TransformComponent
            contentStyle={{
              cursor: "zoom-in",
              width: "100%",
              display: "flex",
              height: "74vh",
              justifyContent: "center",
            }}
          >
            <img
              src={mainImageURL}
              className="image-entry"
              alt="Hình ảnh không có"
              style={{ transform: `rotate(${rotate}deg)` }}
            />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
  return (
    <Row>
      <Col span={9} style={{ paddingLeft: "1%" }}>
        {shouldDisplayRow && (
          <>
            <Row>
              <Col span={8}></Col>
              <Col
                span={8}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "2ch",
                  paddingTop: 4,
                }}
              >
                <Button
                  style={{ padding: 0, height: 28, width: 28 }}
                  disabled={checkBtnRotate}
                  icon={<UndoOutlined style={{ fontSize: 18 }} />}
                  onClick={() => setRotate(rotate - 90)}
                ></Button>
                <Button
                  style={{ padding: 0, height: 28, width: 28 }}
                  disabled={checkBtnRotate}
                  icon={<RedoOutlined style={{ fontSize: 18 }} />}
                  onClick={() => setRotate(rotate + 90)}
                ></Button>
              </Col>
              <Col span={8}></Col>
            </Row>

            <div
              style={{ position: "relative", paddingTop: "0.6%" }}
              className="size-image"
            >
              {renderImageButtons()}
              {loadingImage === false ? renderImage() : renderLoadingState()}
            </div>
            <div className="thumbnail-class-desktop">
              {checkChooseModel === false ? (
                <Swiper
                  slidesPerView={window.visualViewport.width * 0.0035}
                  // spaceBetween={50}

                  navigation={true}
                  centerInsufficientSlides={true}
                  modules={[Navigation]}
                  style={{ width: "100%" }}
                  className="mySwiper"
                >
                  {thumbnailURL.map((item, index) => (
                    <SwiperSlide
                      style={{
                        height: "11.5vh",
                        display: "flex",
                        alignItems: "center",
                      }}
                      key={item}
                    >
                      <button
                        onClick={() => changeMainImage(index)}
                        style={{ border: 0, background: "none" }}
                      >
                        <img
                          style={{
                            border:
                              index === indexImage ? "2px solid red" : null,
                          }}
                          src={item}
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : null}
            </div>
          </>
        )}
      </Col>

      <Col
        span={15}
        style={
          shouldDisplayRow
            ? { height: "90vh", padding: "0.5% 1%" }
            : { padding: "0.5% 1%" }
        }
      >
        <Row>
          <Col span={12}>
            <Select
              size={"middle"}
              id="code_city"
              className="SelectTTDN"
              style={{ textAlign: "left", width: "30%", height: "3vh" }}
              optionFilterProp="children"
              placeholder="Chọn mã máy"
              onChange={chooseModel}
            >
              {listPumb.map((item, index) => (
                <Option
                  key={item.pumb_id}
                  value={item.pumb_id}
                  is_multi={item.is_multi}
                >
                  {item.pumb_model}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            {shouldDisplayRow && (
              <span style={{ display: "flex", float: "right" }}>
                <p style={{ fontWeight: "bold" }}>
                  Quantity: {dataDetail.image_exits}
                </p>
              </span>
            )}
          </Col>
        </Row>
        {shouldDisplayRow && (
          <Form
            form={form}
            onFinish={onFinish}
            style={{ height: "85vh", display: "flex", flexDirection: "column" }}
          >
            {!loadingTable && (
              <>
                {dataSourceInput.length !== 0 && (
                  <Row>
                    <Col span={17}>
                      <Table
                        style={{ marginTop: 30 }}
                        size="small"
                        columns={columnsInput}
                        dataSource={dataSourceInput}
                        pagination={false}
                        scroll={{
                          y: dynamicHeightInput,
                        }}
                      ></Table>
                    </Col>
                    <Col span={6} offset={1} style={{ marginTop: 30 }}>
                      <div className="container-hotKeys">
                        <div id="title-hotKeys">
                          <span>HotKeys</span>
                        </div>
                        <Row id="content-hotKeys">
                          {hotKey.length > 0
                            ? hotKey.map((item) => (
                                <span key={item}>{item}</span>
                              ))
                            : null}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                )}

                {dataSourceGrid.length !== 0 && (
                  <>
                    <Button
                      onClick={handleButtonClick}
                      style={{ marginTop: 20 }}
                    >
                      Add Row
                    </Button>
                    <Table
                      style={{ marginTop: 10 }}
                      size="small"
                      columns={columns}
                      dataSource={inputRows}
                      pagination={false}
                      scroll={{
                        y: dynamicHeightGrid,
                      }}
                    />
                  </>
                )}
                {shouldDisplayRow && (
                  <div style={{ marginTop: "auto" }}>
                    <Row style={{ paddingTop: "1.5%" }}>
                      <Col
                        span={16}
                        style={{
                          display: "flex",
                          columnGap: "5ch",
                          alignItems: "center",
                        }}
                      >
                        {listSymbol.map((item, index) => (
                          <Col span={4} style={{ fontSize: 18 }} key={item}>
                            Alt+{index + 1}: &nbsp;&nbsp;{item}
                          </Col>
                        ))}
                      </Col>
                      <Col
                        span={8}
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          columnGap: "2ch",
                        }}
                      >
                        <Button
                          disabled={loadingTable}
                          style={{
                            float: "right",
                            marginTop: "1%",
                            fontWeight: "bold",
                            background: "#ffea00",
                            color: "#00509d",
                          }}
                          type="primary"
                          onClick={handleOpenModalQA}
                        >
                          Q&A
                        </Button>
                        <Button
                          id="btn-submit"
                          disabled={loadingTable}
                          loading={loadingBtnSubmit}
                          style={
                            loadingBtnSubmit === true
                              ? {
                                  width: 115,
                                  float: "right",
                                  marginTop: "1%",
                                }
                              : {
                                  float: "right",
                                  marginTop: "1%",
                                  fontWeight: "bold",
                                }
                          }
                          type="primary"
                          htmlType="submit"
                        >
                          {loadingBtnSubmit === true ? "" : "SUBMIT (F1)"}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
              </>
            )}
            <ModalQA
              openModalQA={openModalQA}
              handleCloseModalQA={handleCloseModalQA}
              loadingTable={loadingTable}
              loadingBtnSubmit={loadingBtnSubmit}
              handleSubmitModalQA={handleSubmitModalQA}
              handleChangeModalQA={handleChangeModalQA}
              valueQA={valueQA}
            />
          </Form>
        )}
      </Col>
      {!shouldDisplayRow && (
        <Col span={24}>
          <div className="container-noData-file-manager">
            <div style={{ display: "grid" }}>
              <img src={NoDataIcon} alt=""></img>
              <p>There is no data to display</p>
            </div>
          </div>
        </Col>
      )}

      <ModalShortcut
        modalShortcut={modalShortcut}
        handleCloseModalShortcut={handleCloseModalShortcut}
      />
    </Row>
  );
};

InsertInformation.propTypes = {
  shouldDisplayRow: PropTypes.bool,
  checkBtnRotate: PropTypes.bool,
  setRotate: PropTypes.any,
  rotate: PropTypes.number,
  mainImageURL: PropTypes.string,
  thumbnailURL: PropTypes.array,
  nextImage: PropTypes.func,
  lockBtnNextPage: PropTypes.bool,
  previousImage: PropTypes.func,
  lockBtnPreviousPage: PropTypes.bool,
  loadingImage: PropTypes.bool,
  positionZoom: PropTypes.number,
  loadingTable: PropTypes.bool,
  checkChooseModel: PropTypes.bool,
  changeMainImage: PropTypes.func,
  indexImage: PropTypes.number,
  chooseModel: PropTypes.func,
  listPumb: PropTypes.array,
  dataDetail: PropTypes.any,
  form: PropTypes.any,
  onFinish: PropTypes.func,
  dataSourceInput: PropTypes.array,
  columnsInput: PropTypes.array,
  dynamicHeightInput: PropTypes.number,
  hotKey: PropTypes.array,
  dataSourceGrid: PropTypes.array,
  handleButtonClick: PropTypes.func,
  columns: PropTypes.array,
  inputRows: PropTypes.any,
  dynamicHeightGrid: PropTypes.number,
  listSymbol: PropTypes.array,
  handleOpenModalQA: PropTypes.func,
  loadingBtnSubmit: PropTypes.bool,
  openModalQA: PropTypes.bool,
  handleCloseModalQA: PropTypes.func,
  handleSubmitModalQA: PropTypes.func,
  handleChangeModalQA: PropTypes.func,
  valueQA: PropTypes.any,
  modalShortcut: PropTypes.bool,
  handleCloseModalShortcut: PropTypes.func,
};

export default InsertInformation;
