import {
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Button, Col, Empty, Row } from "antd";
import React, { useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { SwiperSlide, Swiper } from "swiper/react";
import { localhost } from "../../../server";
import LoadingIcon from "./../../../images/iconLoading.svg";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PropTypes from "prop-types";
import { Navigation } from "swiper/modules";
import { authAxios } from "../../../api/axiosClient";

const ImageCheck = ({ dataDetail, loadingTable }) => {
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const [rotate, setRotate] = useState(0);
  const [checkBtnRotate, setCheckBtnRotate] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);
  const [checkNoImage, setCheckNoImage] = useState(true);
  const [indexImage, setIndexImage] = useState(0);
  const [thumbnailURL, setThumbnailURL] = useState([]);
  const [mainImageURL, setMainImageURL] = useState();
  const [lockBtnNextPage, setLockBtnNextPage] = useState(false);
  const [lockBtnPreviousPage, setLockBtnPreviousPage] = useState(true);

  const positionZoom = window.visualViewport.width * 0.25;
  const listKeyShortcuts = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

  const fetchListImage = (index, data, changeModel) => {
    setLoadingImage(true);
    if (data.path_files.length > 0) {
      setCheckNoImage(false);
      authAxios()
        .post(
          `${localhost}/file_details`,
          {
            pack_file_path:
              data.path_files.length > 0 ? data.path_files[0][index] : [],
            pack_list_thumbnail_path:
              data.path_thumbs.length > 0 ? data.path_thumbs[0] : [],
            user_role: inforUser.user_role,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setIndexImage(index);
          setLoadingImage(false);
          convertToImage(res.data);
        })
        .catch((err) => {
          setLoadingImage(false);
        });
    } else {
      setLoadingImage(false);
      setCheckNoImage(true);
    }
  };

  const convertToImage = (value) => {
    let arrData = [];
    for (const element of value.lst_thum_base64) {
      arrData.push(`data:image/webp;base64,${element}`);
    }
    setThumbnailURL(arrData);
    setMainImageURL(`data:image/webp;base64,${value.img_base64}`);
    setLoadingImage(false);
  };

  const nextImage = () => {
    fetchListImage(indexImage + 1, dataDetail, false);
  };

  const previousImage = () => {
    fetchListImage(indexImage - 1, dataDetail, false);
  };

  const changeMainImage = (index) => {
    if (index !== indexImage) {
      fetchListImage(index, dataDetail, false);
    }
  };

  useEffect(() => {
    if (dataDetail !== undefined) {
      setCheckBtnRotate(false);
      fetchListImage(0, dataDetail, false);
    } else {
      setMainImageURL();
      setThumbnailURL([]);
      setCheckNoImage(true);
    }
  }, [dataDetail]);

  useEffect(() => {
    setRotate(0);
    if (dataDetail !== undefined) {
      if (dataDetail.path_files.length > 0) {
        if (indexImage + 1 === dataDetail.path_files[0].length) {
          setLockBtnNextPage(true);
        } else {
          setLockBtnNextPage(false);
        }
      }
      if (indexImage === 0) {
        setLockBtnPreviousPage(true);
      } else {
        setLockBtnPreviousPage(false);
      }
    }
  }, [indexImage]);

  useEffect(() => {
    if (loadingImage !== true) {
      try {
        document.addEventListener("keydown", function (event) {
          const arrNum = ["5", "6", "7", "8", "9"];
          if (event.ctrlKey) {
            if (event.key === "0") {
              document.getElementById("reset-zoom").click();
            } else if (event.key === "1") {
              document.getElementById("zoom-in1").click();
            } else if (event.key === "2") {
              document.getElementById("zoom-in2").click();
              event.preventDefault();
            } else if (event.key === "3") {
              document.getElementById("zoom-in3").click();
              event.preventDefault();
            } else if (event.key === "4") {
              document.getElementById("zoom-in4").click();
              event.preventDefault();
            } else if (arrNum.includes(event.key)) {
              event.preventDefault();
            }
          }

        });

        const handleKeyShift = async (event) => {
          for (let i = 0; i < thumbnailURL.length; i++) {
            if (event.shiftKey && event.key === listKeyShortcuts[i]) {
              fetchListImage(i, dataDetail, false);
              break;
            }
          }
        };

        window.addEventListener("keydown", handleKeyShift);

        return () => {
          window.removeEventListener("keydown", handleKeyShift);
        };
      } catch {
        console.log("Lỗi");
      }
    }
  }, [loadingImage]);

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

  const renderImage = () => {
    if (loadingImage === false && checkNoImage === false) {
      return (
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
                <img src={mainImageURL} className="image-entry" alt="Hình ảnh không có" style={{ transform: `rotate(${rotate}deg)` }} />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      );
    } else if (loadingTable) {
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
    } else {
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
    }
  };

  return (
    <Col span={9} style={{ paddingLeft: "1%" }}>
      <Row>
        <Col
          span={8}
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            paddingLeft: "3%",
          }}
        >
          {dataDetail && <span>Quantity: {dataDetail.image_exits}</span>}
        </Col>
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
        {renderImage()}
      </div>
      <div className="thumbnail-class-desktop">
        <Swiper
          slidesPerView={window.visualViewport.width * 0.0035}
          navigation={true}
          centerInsufficientSlides={true}
          modules={[Navigation]}
          style={{ width: "100%" }}
          className="mySwiper"
        >
          {thumbnailURL.map((item, index) => (
            <SwiperSlide
              key={item}
              style={{
                height: "11.5vh",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => changeMainImage(index)}
                style={{ border: 0, background: "none" }}
              >
                <img
                  style={{
                    border: index === indexImage ? "2px solid red" : null,
                  }}
                  src={item}
                  alt=""
                ></img>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Col>
  );
};

ImageCheck.propTypes = {
  loadingTable: PropTypes.bool,
  dataDetail: PropTypes.shape({
    path_files: PropTypes.array,
    image_exits: PropTypes.string,
  }),
};

export default ImageCheck
