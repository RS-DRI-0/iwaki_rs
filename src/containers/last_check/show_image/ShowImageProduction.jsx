import { CloseOutlined, LeftOutlined, RedoOutlined, RightOutlined, UndoOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Empty, Row } from 'antd'
import { useEffect, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingIcon from "./../../../images/iconLoading.svg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { localhost } from '../../../server';
import { authAxios } from '../../../api/axiosClient';
import PropTypes from "prop-types";

const ShowImageProduction = ({ setIsOpenViewOrder, isOpenViewOrder, dataDetail }) => {
    const [mainImageURL, setMainImageURL] = useState();
    const [thumbnailURL, setThumbnailURL] = useState([]);
    const [checkNoImage, setCheckNoImage] = useState(true)
    const [indexImage, setIndexImage] = useState(0);
    const [loadingImage, setLoadingImage] = useState(true);
    const [lockBtnNextPage, setLockBtnNextPage] = useState(false);
    const [lockBtnPreviousPage, setLockBtnPreviousPage] = useState(true);
    const [rotate, setRotate] = useState(0);
    const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

    const positionZoom = window.visualViewport.width * 0.25
    const nextImage = () => {
        fetchListImage(indexImage + 1, dataDetail, false);
    };

    const previousImage = () => {
        fetchListImage(indexImage - 1, dataDetail, false);
    };

    const convertToImage = (value) => {
        let arrData = [];
        for (const element of value.lst_thum_base64) {
            arrData.push(`data:image/jpeg;base64,${element}`);
        }
        setThumbnailURL(arrData);
        setMainImageURL(`data:image/jpeg;base64,${value.img_base64}`);
        setLoadingImage(false);
    };

    const fetchListImage = (index, data, changeModel) => {
        setLoadingImage(true);
        if (data.path_files_order.length > 0) {
            setCheckNoImage(false)
            authAxios()
                .post(
                    `${localhost}/file_details`,
                    {
                        pack_file_path:
                            data.path_files_order.length > 0 ? data.path_files_order[index] : [],
                        pack_list_thumbnail_path:
                            data.path_thumbs_order.length > 0 ? data.path_thumbs_order : [],
                        user_role: inforUser.user_role
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((res) => {
                    setIndexImage(index)
                    setLoadingImage(false);
                    convertToImage(res.data);
                })
                .catch((err) => {
                    setLoadingImage(false);
                });
        } else {
            setLoadingImage(false);
            setCheckNoImage(true)
        }
    }

    const changeMainImage = (index) => {
        setIndexImage(index);
        if (index !== indexImage) {
            fetchListImage(index, dataDetail, false);
        }
    };

    useEffect(() => {
        if (isOpenViewOrder === true) {
            fetchListImage(0, dataDetail)
        }
    }, [isOpenViewOrder]);


    useEffect(() => {
        setRotate(0);
        if (dataDetail !== undefined) {
            if (dataDetail.path_files_order.length > 0) {
                if (indexImage + 1 === dataDetail.path_files_order.length) {
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

    const onCloseViewOrder = () => {
        setIsOpenViewOrder(false)
    }

    useEffect(() => {
        if (loadingImage === true) {
            try {
                document.addEventListener("keydown", function (event) {
                    const arrNum = ["5", "6", "7", "8", "9"];
                    try {
                        if (event.ctrlKey) {
                            if (event.key === "0") {
                                document.getElementById("reset-zoom-pro").click();
                                event.preventDefault();
                                return;
                            } else if (event.key === "1") {
                                document.getElementById("zoom-in1-pro").click();
                                event.preventDefault();
                                return;
                            } else if (event.key === "2") {
                                document.getElementById("zoom-in2-pro").click();
                                event.preventDefault();
                                return;
                            } else if (event.key === "3") {
                                document.getElementById("zoom-in3-pro").click();
                                event.preventDefault();
                                return;
                            } else if (event.key === "4") {
                                document.getElementById("zoom-in4-pro").click();
                                event.preventDefault();
                                return;
                            } else if (arrNum.includes(event.key)) {
                                event.preventDefault();
                                return;
                            }
                        }
                    }catch {
                    }
                   
                });
            } catch {
                console.log("Lỗi");
            }
        }
    }, [loadingImage]);

    return (

        <Drawer
            placement="left"
            closable={false}
            onClose={onCloseViewOrder}
            open={isOpenViewOrder}
            getContainer={false}
            className="drawer-lc"
        >
            <Row style={{ padding: "1% 2% 0% 2%" }}>
                <Col span={8}></Col>
                <Col span={8} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span style={{ color: "#25355B", fontWeight: 600, fontSize: 14 }}>Ảnh chỉ thị</span>
                </Col>
                <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button className='btn-view-detail' style={{ height: 34, width: 34 }} onClick={onCloseViewOrder}>
                        <CloseOutlined />
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                </Col>
                <Col
                    span={8}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        // alignItems: "center",
                        columnGap: "2ch",
                        paddingTop: 4,
                    }}
                >
                    <Button
                        style={{ padding: 0, height: 28, width: 28 }}
                        icon={<UndoOutlined style={{ fontSize: 18 }} />}
                        onClick={() => setRotate(rotate - 90)}
                    ></Button>
                    <Button
                        style={{ padding: 0, height: 28, width: 28 }}
                        icon={<RedoOutlined style={{ fontSize: 18 }} />}
                        onClick={() => setRotate(rotate + 90)}
                    ></Button>
                </Col>
                <Col span={8}>

                </Col>
            </Row>
            <div
                style={{ position: "relative", paddingTop: "0.6%" }}
                className="size-image"
            >
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
                    <TransformWrapper initialScale={1} style={{ display: "flex", justifyContent: "center" }}>
                        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
                            <>
                                <Button
                                    id="reset-zoom-pro"
                                    onClick={() => resetTransform()}
                                    style={{ display: "none" }}
                                ></Button>
                                <Button
                                    id="zoom-in1-pro"
                                    onClick={() => setTransform(0, 0, 1.7)}
                                    style={{ display: "none" }}
                                ></Button>
                                <Button
                                    id="zoom-in2-pro"
                                    onClick={() => setTransform(-positionZoom, 0, 1.7)}
                                    style={{ display: "none" }}
                                ></Button>
                                <Button
                                    id="zoom-in3-pro"
                                    onClick={() => setTransform(0, -positionZoom, 1.7)}
                                    style={{ display: "none" }}
                                ></Button>
                                <Button
                                    id="zoom-in4-pro"
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
                                        height: "63vh",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={mainImageURL}
                                        className="image-entry"
                                        alt="Hình ảnh không có"
                                        style={{ transform: `rotate(${rotate}deg)`, height: "63vh" }}
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
                            height: "63vh",
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
                            height: "63vh",
                            padding: "1% 1% 2%",
                        }}
                    >
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}
                <div className="thumbnail-class-desktop" style={{ padding: "1% 2% 0% 2%" }}>
                    <Swiper
                        slidesPerView={window.visualViewport.width * 0.003}
                        // spaceBetween={50}
                        // navigation={{
                        //     clickable: true,
                        // }}
                        centerInsufficientSlides={true}
                        modules={[Navigation]}
                        style={{ width: "100%", display: "flex", columnGap: "2ch" }}
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
        </Drawer>
    )
}

ShowImageProduction.propTypes = {
    setIsOpenViewOrder: PropTypes.func,
    isOpenViewOrder: PropTypes.bool,
    dataDetail: PropTypes.shape({
        path_files_order: PropTypes.array,
    })
}

export default ShowImageProduction