import { CloseOutlined, RedoOutlined, UndoOutlined } from '@ant-design/icons'
import { Button, Col, Modal, Row } from 'antd'
import { useEffect, useState } from 'react'
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { localhost } from "../../../../server";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingIcon from "../../../../images/iconLoading.svg";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import { Navigation } from "swiper/modules";
import { authAxios } from '../../../../api/axiosClient';
import PropTypes from "prop-types";


const ModalViewImageHistory = ({ open, setIsOpenViewImage, dataDetail }) => {
    const [mainImageURL, setMainImageURL] = useState();
    const [thumbnailURL, setThumbnailURL] = useState([]);
    const [loadingImage, setLoadingImage] = useState(false);
    const [indexImage, setIndexImage] = useState(0);
    const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

    const convertToImage = (value) => {
        let arrData = [];
        for (const element of value.lst_thum_base64) {
            arrData.push(`data:image/webp;base64,${element}`);
        }
        setThumbnailURL(arrData);
        setMainImageURL(`data:image/webp;base64,${value.img_base64}`);
        setLoadingImage(false);
    };

    const fetchListImage = async (index) => {
        setLoadingImage(true);
        await authAxios()
            .post(
                `${localhost}/file_details`,
                {
                    pack_file_path: dataDetail.list_file[0][index],
                    pack_list_thumbnail_path: dataDetail.list_thumb[0],
                    user_role: inforUser.user_role,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                convertToImage(res.data);
            })
            .catch((err) => {
                setLoadingImage(false);
            });
    };

    useEffect(() => {
        fetchListImage(indexImage);
    }, []);

    useEffect(() => {
        setRotate(0);
    }, [indexImage]);

    const changeMainImage = (index) => {
        setIndexImage(index);
        if (index !== indexImage) {
            fetchListImage(index);
        }
    };

    const mobileScreen = window.visualViewport.width <= 900;

    const [rotate, setRotate] = useState(0);
    const handleCancel = () => {
        setIsOpenViewImage(false)
    }
    return (
        <Modal className='modal-view-image-history' open={open} onCancel={handleCancel} footer={false} closable={false}>
            <Row>
                <Row className='row-rotate-img' >
                    <Col
                        span={20}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: "2ch",
                            paddingTop: 4,
                        }}
                    >
                        <Button
                            style={{ padding: 0, height: 28, width: 50 }}
                            icon={<UndoOutlined style={{ fontSize: 18 }} />}
                            onClick={() => setRotate(rotate - 90)}
                        ></Button>
                        <Button
                            style={{ padding: 0, height: 28, width: 50 }}
                            icon={<RedoOutlined style={{ fontSize: 18 }} />}
                            onClick={() => setRotate(rotate + 90)}
                        ></Button>
                    </Col>
                    <Col span={4} style={{ textAlign: "-webkit-right" }}>
                        <Button className='btn-view-detail' onClick={handleCancel}>
                        {/* style={{ height: 30 }} */}
                            <CloseOutlined />
                        </Button>
                    </Col>
                </Row>
                <Col span={24}>
                    <div
                        style={{ position: "relative", paddingTop: "2%" }}
                        className="size-image"
                    >
                        {loadingImage === false ? (
                            <TransformWrapper initialScale={1}>
                                {({ zoomIn, zoomOut, resetTransform }) => (
                                    <TransformComponent
                                        contentStyle={{
                                            cursor: "zoom-in",
                                            width: "100%",
                                            display: "flex",
                                            padding: "1% 0% 2%",
                                            height: "72svh",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <img
                                            src={mainImageURL}
                                            style={{ transform: `rotate(${rotate}deg)` }}
                                            alt="Hình ảnh"
                                            className="img-detail"
                                        />
                                    </TransformComponent>
                                )}
                            </TransformWrapper>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    padding: "1% 1% 2%",
                                    height: "72svh",
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
                        )}
                    </div>

                    <div className="thumbnail-class">
                        <Swiper
                            slidesPerView={
                                mobileScreen
                                    ? window.visualViewport.width * 0.01 * 0.96
                                    : window.visualViewport.width * 0.01 * 0.4
                            }
                            pagination={{
                                clickable: true,
                            }}
                            centerInsufficientSlides={true}
                            // modules={[FreeMode, Pagination]}
                            modules={[Navigation]}
                            style={{ width: "90%" }}
                            className="mySwiper"
                        >
                            {thumbnailURL.map((item, index) => (
                                <SwiperSlide
                                    style={{
                                        height: "10vh",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                    key={item}
                                >
                                    {/* <button onClick={() => changeMainImage(index)} style={{ padding: 0, border: 0, background: "none" }}> */}
                                        <img
                                            style={{
                                                border: index === indexImage ? "2px solid red" : null,
                                            }}
                                            src={item}
                                            alt=""
                                            loading='lazy'
                                            onClick={() => changeMainImage(index)}
                                        ></img>
                                    {/* </button> */}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}

ModalViewImageHistory.propTypes = {
    open: PropTypes.bool,
    setIsOpenViewImage: PropTypes.func,
    dataDetail: PropTypes.shape({
      list_file: PropTypes.array,
      list_thumb: PropTypes.array,
    }),
  }
export default ModalViewImageHistory