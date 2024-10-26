import { LeftOutlined, RedoOutlined, RightOutlined, UndoOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Row } from 'antd'
import { useEffect, useState } from 'react'
import ShowImageProduction from './ShowImageProduction'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import "../LastCheck.css";
import { Swiper, SwiperSlide } from "swiper/react";

import LoadingIcon from "./../../../images/iconLoading.svg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import PropTypes from "prop-types";

import { Navigation } from "swiper/modules";
import { localhost } from '../../../server'
import { authAxios } from '../../../api/axiosClient'
import { useSelector } from 'react-redux'
import useZoomLevel from '../../custom_hook/useZoomLevel'

const ShowImage = ({ dataDetail, dataLastCheck, pumpId }) => {
    const [isOpenViewOrder, setIsOpenViewOrder] = useState(false)
    const [rotate, setRotate] = useState(0);
    const [checkBtnRotate, setCheckBtnRotate] = useState(true);
    const [loadingImage, setLoadingImage] = useState(true);
    const [checkNoImage, setCheckNoImage] = useState(true)
    const [indexImage, setIndexImage] = useState(0);
    const [mainImageURL, setMainImageURL] = useState();
    const [thumbnailURL, setThumbnailURL] = useState([]);
    const [lockBtnNextPage, setLockBtnNextPage] = useState(false);
    const [lockBtnPreviousPage, setLockBtnPreviousPage] = useState(true);
    const [contentMfg, setContentMfg] = useState("")
    const zoomLevel = useZoomLevel();
    const positionZoom = window.visualViewport.width * 0.25

    const listKeyShortcuts = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
    const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

    const showViewOrder = () => {
        setIsOpenViewOrder((prev) => !prev)
    }
    const nextImage = () => {
        fetchListImage(indexImage + 1, dataDetail, false);
    };

    const previousImage = () => {
        fetchListImage(indexImage - 1, dataDetail, false);
    };

    const fetchListImage = (index, data, changeModel) => {
        setLoadingImage(true);
        if (data.path_files.length > 0) {
            setCheckNoImage(false)
            authAxios()
                .post(
                    `${localhost}/file_details`,
                    {
                        pack_file_path: data.path_files.length > 0 ? data.path_files[index] : [],
                        pack_list_thumbnail_path: data.path_thumbs.length > 0 ? data.path_thumbs : [],
                        user_role: inforUser.user_role
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((res) => {
                    let arrData = [];
                    res.data.lst_thum_base64.forEach(item => {
                        arrData.push(`data:image/webp;base64,${item}`);
                    })
                    setThumbnailURL(arrData);
                    setMainImageURL(`data:image/webp;base64,${res.data.img_base64}`);
                    setLoadingImage(false);

                    setIndexImage(index)
                })
                .catch((err) => {
                    setLoadingImage(false);
                });
        } else {
            setThumbnailURL([]);
            setLoadingImage(false);
            setCheckNoImage(true)
        }
    };

    const changeMainImage = (index) => {
        if (index !== indexImage) {
            fetchListImage(index, dataDetail, false);
        }
    };

    useEffect(() => {
        if (dataDetail !== undefined) {
            setCheckBtnRotate(false)
            fetchListImage(0, dataDetail, false)
        } else {
            setMainImageURL()
            setThumbnailURL([])
            setCheckNoImage(true)
        }
    }, [dataDetail]);

    useEffect(() => {
        setRotate(0);
        if (dataDetail !== undefined) {
            if (dataDetail.path_files.length > 0) {
                if (indexImage + 1 === dataDetail.path_files.length) {
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
    }, [indexImage, dataLastCheck]);

    useEffect(() => {
        if (loadingImage !== true) {
            try {
                document.addEventListener("keydown", function (event) {
                    const arrNum = ["5", "6", "7", "8", "9"];
                    if (event.ctrlKey) {
                        if (event.key === "0") {
                            document.getElementById("reset-zoom").click();
                            event.preventDefault();
                            return;
                        } else if (event.key === "1") {
                            document.getElementById("zoom-in1").click();
                            event.preventDefault();
                            return;
                        } else if (event.key === "2") {
                            document.getElementById("zoom-in2").click();
                            event.preventDefault();
                            return;
                        } else if (event.key === "3") {
                            document.getElementById("zoom-in3").click();
                            event.preventDefault();
                            return;
                        } else if (event.key === "4") {
                            document.getElementById("zoom-in4").click();
                            event.preventDefault();
                            return;
                        } else if (arrNum.includes(event.key)) {
                            event.preventDefault();
                            return;
                        }
                    }

                });
            } catch {
                console.log("Lỗi");
            }

            try {
                const handleKeyShiftLastCheck = async (event) => {
                    for (let i = 0; i < thumbnailURL.length; i++) {
                        if (event.shiftKey && event.key === listKeyShortcuts[i]) {
                            fetchListImage(i, dataDetail, false);
                            break;
                        }
                    }
                };

                window.addEventListener("keydown", handleKeyShiftLastCheck);

                return () => {
                    window.removeEventListener("keydown", handleKeyShiftLastCheck);
                };
            } catch {
                console.log("Lỗi");
            }
        }
    }, [loadingImage]);

    useEffect(() => {
        setIndexImage(0)
    }, [pumpId]);

    useEffect(() => {
        if (dataLastCheck.length > 0) {
            let contentMFG = ''
            for (const element of dataLastCheck) {
                if (element.field_name.includes("MFG　No")) {
                    contentMFG = element.checksheet
                    break;
                }
            }
            setContentMfg(contentMFG)
        } else {
            setContentMfg("")
        }

    }, [dataLastCheck]);

    return (
        <Col span={7} className="col-show-image" style={{ padding: "0.5% 0% 0% 1%", rowGap: "1ch" }}>
            <Row style={{ paddingBottom: "1.5%" }}>
                <Col span={zoomLevel > 100 ? 24 : 14}  style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: "#25355B" }}>Package Name: </span><span>{dataDetail !== undefined ? dataDetail.pack_name : ""}</span>
                </Col>
                <Col span={zoomLevel > 100 ? 24 : 10} style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: "#25355B" }}>MFG No.: </span><span>{contentMfg.toLocaleUpperCase()}</span>
                </Col>
            </Row>
            {thumbnailURL.length > 0 &&
                <Row style={{ paddingBottom: "1.5%" }}>
                    <Col span={8}>
                        <Button className='btn-production' onClick={showViewOrder}></Button>
                    </Col>
                    <Col
                        span={8}
                        style={{
                            display: "flex",
                            justifyContent: "center",
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
                </Row>
            }

            <div
                style={{ position: "relative" }}
                className="size-image"
            >
                <ShowImageProduction
                    isOpenViewOrder={isOpenViewOrder}
                    setIsOpenViewOrder={setIsOpenViewOrder}
                    dataDetail={dataDetail}
                />
                {mainImageURL && thumbnailURL.length > 0 ? (
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
                ) : null}
                {loadingImage === false && checkNoImage === false ? (
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
                                    onClick={() =>
                                        setTransform(-positionZoom, -positionZoom, 1.7)
                                    }
                                    style={{ display: "none" }}
                                ></Button>
                                <TransformComponent
                                    contentStyle={{
                                        cursor: "zoom-in",
                                        width: "100%",
                                        display: "flex",
                                        height: "72svh",
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
                ) : loadingImage && thumbnailURL.length > 0 ? (
                    <div
                        style={{
                            display: "flex",
                            padding: "1% 1% 2%",
                            height: "72vh",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            style={{ width: "7%" }}
                            src={LoadingIcon}
                            className="load-image-desktop"
                            alt=""
                        ></img>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "72vh",
                            padding: "1% 1% 2%",
                        }}
                    >
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                <div className="thumbnail-class-desktop" style={{ padding: "1%" }}>
                    <Swiper
                        slidesPerView={window.visualViewport.width * 0.003}
                        // spaceBetween={50}
                        // navigation={{
                        //     clickable: true,
                        // }}
                        centerInsufficientSlides={true}
                        modules={[Navigation]}
                        style={{ width: "100%" }}
                        className="mySwiper"
                    >
                        {thumbnailURL.map((item, index) => (
                            <SwiperSlide key={item}>
                                {/* <button onClick={() => changeMainImage(index)} style={{ padding: 0, border: 0, background: "none" }}> */}
                                <img
                                    style={{
                                        border: index === indexImage ? "2px solid red" : null,
                                    }}
                                    src={item}
                                    alt=""
                                    onClick={() => changeMainImage(index)}
                                ></img>
                                {/* </button> */}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </Col>
    )
}

ShowImage.propTypes = {
    dataLastCheck: PropTypes.array,
    pumpId: PropTypes.string,
    dataDetail: PropTypes.shape({
        grid: PropTypes.array,
        path_files: PropTypes.array,
        pack_name: PropTypes.string,

    })
}


export default ShowImage