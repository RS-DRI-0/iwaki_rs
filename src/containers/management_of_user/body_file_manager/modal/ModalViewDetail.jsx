import { CloseOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import IconViewImages from "../../../../images/file_manager/IconViewImages.svg";
import IconStatusNotQualifiedFooter from "../../../../images/file_manager/IconStatusNotQualifiedFooter.svg";
import IconStatusImgNotGoodFooter from "../../../../images/file_manager/IconStatusImgNotGoodFooter.svg";
import iconProcessingDetail from "../../../../images/file_manager/iconProcessingDetail.svg";
import DetailIcon from "../../../../images/ViewDetail.svg"
import LoadingIcon from "../../../../images/iconLoading.svg";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import IconStatusQualifiedFooter from "../../../../images/file_manager/IconStatusQualifiedFooter.svg";
import ModalViewImage from "../ModalViewImage";
import dayjs from "dayjs";
import { localhost } from "../../../../server";
import language from "../../../../language.json";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { authAxios } from "../../../../api/axiosClient";
import PropTypes from "prop-types";

const iconCircle = () => {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        background: "red",
        borderRadius: "100%",
        marginInlineEnd: 8,
      }}
    ></div>
  );
};

const ModalViewDetail = ({
  open,
  setOpenModalDetail,
  dataDetail,
  chooseLanguage,
  fetchListData,
  fieldFilter,
}) => {
  const [openViewImage, setOpenViewImage] = useState(false);
  const [dataNotQualified, setDataNotQualified] = useState([]);
  const [dataQA, setDataQA] = useState("");
  const [listDataMDG, setListDataMDG] = useState([])
  const [showCheckVerified, setShowCheckVerified] = useState(
    dataDetail.pack_status === "1" && dataDetail.cus_status === "-1"
  );
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const handleCancel = () => {
    setOpenModalDetail(false)
  }

  const showListImageDetail = () => {
    setOpenViewImage(true);
  };

  const UpdateCusStatus = async (value, type) => {
    if (type !== value.cus_status) {
      const FormData = require("form-data");
      let data = new FormData();
      data.append("id_user", inforUser.user_id);
      data.append("user_role", inforUser.user_role);
      data.append("tb_package", value.tb_package);
      data.append("vl_status", type);
      data.append("pack_id", value.pack_id);
      await authAxios()
        .post(`${localhost}/update_cus_status`, data)
        .then((res) => {
          fetchListData(fieldFilter);
          setShowCheckVerified(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const showIconStatus = (src) => {
    return (
      <img
        src={src}
        alt=""
        style={{ marginInlineEnd: 8 }}
      ></img>
    )
  }

  const functionSetContentBasedOnTotal = () => {
    if (Number(dataDetail.total_qa) > 0 || Number(dataDetail.total_warning) > 0) {
      return showIconStatus(IconStatusImgNotGoodFooter)
    } else if (Number(dataDetail.total_notqualified) > 0) {
      return showIconStatus(IconStatusNotQualifiedFooter)
    } else {
      return showIconStatus(IconStatusQualifiedFooter)
    }
  }

  const functionHandlePumpMulti = () => {
    if (parseInt(dataDetail.is_checksheet) === 0 || parseInt(dataDetail.is_checksheet) === 3) {
      if (Number(dataDetail.pack_status) < 1) {
        return showIconStatus(iconProcessingDetail)
      }
      else if (Number(dataDetail.pack_status) >= 1) {
        if (Number(dataDetail.check_status) === 1) {
          return showIconStatus(IconStatusQualifiedFooter)
        }
        else if (Number(dataDetail.check_status) === 2) {
          return showIconStatus(IconStatusNotQualifiedFooter)
        }
        else if (Number(dataDetail.check_status) === 3) {
          return showIconStatus(IconStatusImgNotGoodFooter)
        } else {
          return functionSetContentBasedOnTotal()
        }
      }
    }
    else if (parseInt(dataDetail.is_checksheet) === 1) {
      if (Number(dataDetail.pack_status) >= 1) {
        return functionSetContentBasedOnTotal()
      } else {
        return showIconStatus(iconProcessingDetail)
      }
    }
  }

  const showIconCheckStatus = () => {
    if (parseInt(dataDetail.is_multi) === 0) {
      return functionHandlePumpMulti()
      // MDG
    } else if (parseInt(dataDetail.is_checksheet) === 0) {
      if (dataDetail.lst_data_multi.length === 0) {
        return showIconStatus(iconProcessingDetail)
      }
      else if (parseInt(dataDetail.total_qa) > 0 || Number(dataDetail.total_warning) > 0) {
        return showIconStatus(IconStatusImgNotGoodFooter)
      } else if (parseInt(dataDetail.total_notqualified) > 0) {
        return showIconStatus(IconStatusNotQualifiedFooter)
      } else {
        return showIconStatus(IconStatusQualifiedFooter)
      }
    } else if (dataDetail.check_status.toString() === "2") {
      return showIconStatus(IconStatusNotQualifiedFooter)
    } else if (dataDetail.check_status.toString() === "1") {

      return showIconStatus(IconStatusQualifiedFooter)

    } else if (dataDetail.check_status.toString() === "0") {
      return showIconStatus(iconProcessingDetail)
    } else {
      return showIconStatus(IconStatusImgNotGoodFooter)
    }
  };

  useEffect(() => {
    if (dataDetail !== undefined) {
      const newList = dataDetail.lst_data_multi.filter(item => item.not_qualified.length > 0 || item.qa_content !== "" || item.lst_qa_content.length > 0)
      if (dataDetail.lst_data.length > 0) {
        setDataNotQualified(dataDetail.lst_data[0].not_qualified);
        setDataQA(dataDetail.lst_data[0].qa_content);
      }
      setListDataMDG(newList)
    }
  }, [dataDetail]);

  const showData = (data) => {
    if (chooseLanguage.toLowerCase() === "japanese") {
      return data.qa_jp
    } else if (chooseLanguage.toLowerCase() === "english") {
      return data.qa_en
    } else {
      return data.qa_vn
    }
  }
  return (
    <>
      <Modal className="container-modal-view-detail" open={open} footer={false} onCancel={handleCancel}>
        <div style={{ height: "auto" }}>
          <Row className="container-header-view-detail">
            <Col span={4}>
              <Button className="btn-view-detail" onClick={showListImageDetail}>
                <img src={IconViewImages} alt=""></img>
              </Button>
            </Col>
            <Col span={16} className="title-view-detail">
              <span style={{ display: "flex" }}>
                {showIconCheckStatus()}
                {dataDetail.vl_mfg_no.toUpperCase()}
              </span>
            </Col>
            <Col span={4} style={{ textAlign: "-webkit-right" }}>
              <Button className="btn-view-detail" onClick={handleCancel}>
                <CloseOutlined />
              </Button>
            </Col>
          </Row>
          <div style={{ width: "100%" }}>
            <Row className="container-detail-information">
              <span>
                {language[chooseLanguage].pump_type}:{" "}
                <span className="text-detail">{dataDetail.pumb_name}</span>
              </span>
              <span>
                {language[chooseLanguage].model_name}:{" "}
                <span className="text-detail">{dataDetail.vl_model_name === "" ? "N/A" : dataDetail.vl_model_name}</span>
              </span>
              {/* <span>
                {language[chooseLanguage].location}:{" "}
                <span className="text-detail">{dataDetail.pump_location}</span>
              </span> */}

              <span>
                {language[chooseLanguage].upload_date}:{" "}
                <span className="text-detail">
                  {dayjs(dataDetail.upload_date).format("DD-MM-YYYY HH:mm:ss")}
                </span>
              </span>

              <span>
                {language[chooseLanguage].completion_date}:{" "}
                <span className="text-detail"> {dataDetail.submit_date.toLowerCase() !== "none" ? dayjs(dataDetail.submit_date).format("DD-MM-YYYY HH:mm:ss") : "" }</span>
              </span>

              {parseInt(dataDetail.pumb_id) !== 1 && <span>
                {language[chooseLanguage].total} {language[chooseLanguage].checksheet}:
                <span className="text-detail">
                  {dataDetail.total_pump + " / " + dataDetail.total_files}
                </span>
              </span>}

              {Number(dataDetail.is_multi) === 0 &&
                <span>
                  {language[chooseLanguage].vl_scan_no}:{" "}
                  <span className="text-detail">
                    {dataDetail.vl_scan_no}
                  </span>
                </span>
              }
            </Row>

            {parseInt(dataDetail.is_checksheet) === 1 ?
              <StatusFieldLK
                dataDetail={dataDetail}
                chooseLanguage={chooseLanguage}
                dataNotQualified={dataNotQualified}
                showCheckVerified={showCheckVerified}
                // iconCircle={iconCircle}
                dataQA={dataQA}
                showData={showData}
              />
              :
              <StatusFieldMDG
                dataDetail={dataDetail}
                chooseLanguage={chooseLanguage}
                listDataMDG={listDataMDG}
                inforUser={inforUser}
                showData={showData}

              />
            }

            {showCheckVerified ? (
              <Row className="container-footer-view-detail">
                <Col span={24}>
                  <Button
                    size="large"
                    onClick={() => UpdateCusStatus(dataDetail, "0")}
                  >
                    {language[chooseLanguage].not_ok}
                  </Button>
                </Col>
                <Col span={24}>
                  <Button
                    size="large"
                    onClick={() => UpdateCusStatus(dataDetail, "1")}
                    style={{ background: "#0C4DA2", color: "#fff" }}
                  >
                    {language[chooseLanguage].ok}
                  </Button>
                </Col>
              </Row>
            ) : null}
          </div>
        </div>
      </Modal>

      {openViewImage === true ? (
        <ModalViewImage
          open={openViewImage}
          setIsOpenDetail={setOpenViewImage}
          dataDetail={dataDetail}
        />
      ) : null}
    </>
  );
};

const StatusFieldLK = ({
  dataDetail,
  chooseLanguage,
  dataNotQualified,
  showCheckVerified,
  showData,
  dataQA
}) => {

  const returnDataQA = () => {
    const data = dataDetail.lst_data[0]
    if (dataDetail.qa_all === "0") {
      if (data.qa_content.includes("002")) {
        return language[chooseLanguage].code_002
      } else if (data.qa_content.includes("003")) {
        return language[chooseLanguage].code_003
      } else {
        return data.qa_content
      }
    } else if (data.lst_qa_content.length > 0) {
      if (data.lst_qa_content.length === 1) {
        return data.lst_qa_content[0][chooseLanguage]
      } else {
        let newData = data.lst_qa_content.map(item => item[chooseLanguage]).join(",")
        return newData
      }
    }
  }

  const showContentNotQualified = (data) => {
    if (data === "vietnamese") {
      return <p style={{ display: "flex" }}>
        {language[data].there_are}
        <p style={{ color: "#F51313" }}>
          &nbsp;"{language[data].content_notQualified_detail.replace("X", dataNotQualified.length)}"&nbsp;
        </p>
      </p>
    } else if (data === "japanese") {
      return <p style={{ color: "#F51313" }}>
        {language[data].content_notQualified_detail.replace("X", dataNotQualified.length)}
      </p>
    } else {
      return <p style={{ display: "flex" }}>
        {language[data].there_are}
        <p style={{ color: "#F51313" }}>
          &nbsp;"{language[data].content_notQualified_detail.replace("X", dataNotQualified.length)}"&nbsp;
        </p>
        {language[data].fields}
      </p>
    }
  }

  return (
    <>
      {parseInt(dataDetail.check_status) === 2 ? (
        <div className="container-error-field">
          {showContentNotQualified(chooseLanguage)}
          <div
            style={{
              height: showCheckVerified ? "35svh" : "50svh",
              overflow: "auto",
            }}
          >
            {dataNotQualified.map((item) => (
              <span key={item} style={{ display: "grid", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  {iconCircle()}
                  {item.field}:{" "}
                </span>
                <span className="text-detail" style={{ paddingLeft: '6%' }}>
                  {showData(item)}
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : parseInt(dataDetail.check_status) === 3 ? (
        <div className="container-qa-field">
          <p>Note: {returnDataQA()}</p>
        </div>
      ) : null}
    </>
  )
}

const StatusFieldMDG = ({
  dataDetail,
  chooseLanguage,
  listDataMDG,
  inforUser,
  showData
}) => {
  const [isOpenModalImage, setIsOpenModalImage] = useState(false)
  const [items, setItems] = useState([])
  const [dataDetailPackage, setDataDetailPackage] = useState()

  const labelCollapse = (text, data) => {
    let colorLabel = ''
    if (Number(data.is_warning) === 1) {
      colorLabel = "rgb(14, 102, 231)"
    } else if (data.qa_content !== "") {
      colorLabel = "#BB890A"
    } else {
      colorLabel = "#F60505"
    }

    return (
      <span style={{ columnGap: 8, color: colorLabel, textTransform: "uppercase" }}><img alt=''></img>{text}</span>
    )
  }
  const showImage = (data) => {
    setDataDetailPackage(data)
    setIsOpenModalImage(true)
  }
  const genExtra = (data) => {
    return (
      <button
        style={{ border: 0, background: "none" }}
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
          showImage(data)
        }}
      >
        <img
          style={{ opacity: "0.7" }}
          src={DetailIcon} alt=''
        ></img>
      </button>

    )
  };

  useEffect(() => {
    if (listDataMDG.length > 0) {
      listDataMDG.sort((a, b) => Number(b.is_warning) - Number(a.is_warning))
      let newItem = []
      let newListDatMDG = []
      for (const element of listDataMDG) {
        if (element.lst_qa_content.length > 0) {
          element.lst_qa_content.forEach((item, index) => {
            newListDatMDG.push({
              is_warning: element.is_warning,
              lst_qa_img: [element.lst_qa_img[index]],
              lst_qa_thumb: [element.lst_qa_thumb[index]],
              vietnamese: element.lst_qa_content[index].vietnamese,
              japanese: element.lst_qa_content[index].japanese,
              english: element.lst_qa_content[index].english,

              not_qualified: element.not_qualified,
              mfg_no: element.mfg_no,
              path_files: element.path_files,
              path_thumbs: element.path_thumbs,
              qa_content: element.qa_content,
            })
          })
        } else {
          newListDatMDG.push({
            is_warning: element.is_warning,
            lst_qa_img: [],
            lst_qa_thumb: [],
            vietnamese: "",
            japanese: "",
            english: "",

            not_qualified: element.not_qualified,
            mfg_no: element.mfg_no,
            path_files: element.path_files,
            path_thumbs: element.path_thumbs,
            qa_content: element.qa_content,
          })
        }
      }

      newListDatMDG.forEach((item, index) =>
        newItem.push({
          key: index + 1,
          label: labelCollapse(item.mfg_no, item),
          children: <BoxPackage data={item} chooseLanguage={chooseLanguage} showData={showData} dataDetail={dataDetail} />,
          extra: genExtra(item),
        })
      )

      setItems(newItem)
    }
  }, [listDataMDG]);
  return (
    <>
      <Row className="container-detail-information">
        <span><span style={{ color: "#0fa958" }}>{language[chooseLanguage].qualified} </span> {language[chooseLanguage].checksheet}:  <span className="text-detail">{dataDetail.total_qualified}</span></span>
        <span><span style={{ color: "#f60505" }}>{language[chooseLanguage].not_qualified}</span> {language[chooseLanguage].checksheet}:   <span className="text-detail">{dataDetail.total_notqualified}</span></span>
        <span><span style={{ color: "#c7a242" }}>{language[chooseLanguage].images_not_good} </span>{language[chooseLanguage].checksheet}: <span className="text-detail">{dataDetail.total_qa}</span></span>
        <span><span style={{ color: "rgb(14 102 231)", fontWeight: "bold" }}>{language[chooseLanguage].warning}: </span><span className="text-detail">  {dataDetail.total_warning}   </span></span>
      </Row>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Collapse className='collapse-desktop' style={{ maxHeight: "30vh", marginTop: "2%", border: "1px solid #e7dfdf" }} expandIconPosition="start" size='small' items={items} defaultActiveKey={[]} />
      </div>
      {isOpenModalImage === true ?
        <ModalViewImageMDG
          open={isOpenModalImage}
          setIsOpenModalImage={setIsOpenModalImage}
          dataDetailPackage={dataDetailPackage}
          inforUser={inforUser}
        />
        : null}
    </>
  )
}

const BoxPackage = ({ data, chooseLanguage, showData, dataDetail }) => {
  const [newData, setNewData] = useState([])

  const returnDataQA = () => {
    if (dataDetail.qa_all === "0") {
      if (data.qa_content !== "") {
        if (data.qa_content.includes("002")) {
          return <span style={{ fontSize: 12 }}>{language[chooseLanguage].code_002}</span>
        } else if (data.qa_content.includes("003")) {
          return <span style={{ fontSize: 12 }}>{language[chooseLanguage].code_003}</span>
        } else {
          return <span style={{ fontSize: 12 }}>{data.qa_content}</span>
        }
      } else {
        return <span style={{ fontSize: 12 }}>{data[chooseLanguage]}</span>
      }
    }
    else if (dataDetail.qa_all === "1") {
      return <span style={{ fontSize: 12 }}>{data[chooseLanguage]}</span>
    }

  }

  useEffect(() => {
    let arr = []
    data.not_qualified.forEach((item, index) => {
      arr.push({ ...item, id: index })
    })
    setNewData(arr)
  }, [data]);

  return (
    <div
      style={{
        maxHeight: "20svh",
        overflow: "auto",
      }}
      className="content-collapse"
    >
      {returnDataQA()}

      {newData.map((item) => (
        <span key={item.id} style={{ display: "grid", alignItems: "center", fontSize: 12 }}>
          <span style={{ color: "red", display: "flex", alignItems: "center" }}> {iconCircle()}{item.field}:{" "} &nbsp;</span>
          <span className="text-detail" style={{ paddingLeft: "6%" }}>
            {showData(item)}
          </span>
        </span>
      ))}
    </div>
  )
}

const ModalViewImageMDG = ({ open, setIsOpenModalImage, dataDetailPackage, inforUser }) => {
  const [mainImageURL, setMainImageURL] = useState();
  const [thumbnailURL, setThumbnailURL] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [indexImage, setIndexImage] = useState(0);
  const handleCancel = () => {
    setIsOpenModalImage(false);
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

  const fetchListImage = async (index) => {
    setLoadingImage(true);
    await authAxios()
      .post(
        `${localhost}/file_details`,
        {
          pack_file_path: dataDetailPackage.path_files.length > 0 ? dataDetailPackage.path_files[index] : dataDetailPackage.lst_qa_img[index],
          pack_list_thumbnail_path: dataDetailPackage.path_thumbs.length > 0 ? dataDetailPackage.path_thumbs : dataDetailPackage.lst_qa_thumb,
          user_role: inforUser.user_role
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
    if (open === true) {
      fetchListImage(indexImage);
    }
  }, [open]);

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

  return (
    <Modal
      className='container-modal-view-detail detail-view-image'
      open={open}
      width={mobileScreen ? "96%" : "50%"}
      onCancel={handleCancel}
      footer={false}
      style={{ top: 10, maxHeight: "75vh" }}
    >
      <Row>
        <Row style={{ width: "100%", paddingTop: 6 }}>
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
            <Button className='btn-view-detail' style={{ height: 30 }} onClick={handleCancel}>
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
              modules={[Navigation]}
              style={{ width: "90%" }}
              className="mySwiper"
            >
              {thumbnailURL.map((item, index) => (
                <SwiperSlide
                  style={{
                    height: "12vh",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  key={item}
                >
                  {/* <button onClick={() => changeMainImage(index)} style={{ padding: 0, border: 0, background: "none", width: "70px"}}> */}
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
        </Col>
      </Row>
    </Modal>
  );
}

ModalViewDetail.propTypes = {
  open: PropTypes.bool,
  setOpenModalDetail: PropTypes.func,
  chooseLanguage: PropTypes.string,
  fetchListData: PropTypes.func,
  fieldFilter: PropTypes.object,
  dataDetail: PropTypes.shape({
    pack_status: PropTypes.string,
    cus_status: PropTypes.string,
    is_multi: PropTypes.string,
    is_checksheet: PropTypes.string,
    pumb_name: PropTypes.string,
    check_status: PropTypes.string,
    pump_location: PropTypes.string,
    total_pump: PropTypes.string,
    total_files: PropTypes.string,
    vl_scan_no: PropTypes.string,
    vl_model_name: PropTypes.string,
    upload_date: PropTypes.string,
    pumb_id: PropTypes.string,
    total_warning: PropTypes.string,
    total_qa: PropTypes.string,
    total_notqualified: PropTypes.string,
    lst_data_multi: PropTypes.array,
    vl_mfg_no: PropTypes.string,
    lst_data: PropTypes.arrayOf(
      PropTypes.shape({
        not_qualified: PropTypes.any,
        qa_content: PropTypes.any
      })
    )
  }),
}
StatusFieldLK.propTypes = {
  chooseLanguage: PropTypes.string,
  showCheckVerified: PropTypes.bool,
  showData: PropTypes.func,
  dataQA: PropTypes.string,
  dataNotQualified: PropTypes.array,
  dataDetail: PropTypes.shape({
    check_status: PropTypes.string,
  }),
}
StatusFieldMDG.propTypes = {
  chooseLanguage: PropTypes.string,
  listDataMDG: PropTypes.array,
  inforUser: PropTypes.object,
  showData: PropTypes.func,
  dataDetail: PropTypes.shape({
    total_qualified: PropTypes.string,
    total_notqualified: PropTypes.string,
    total_qa: PropTypes.string,
    total_warning: PropTypes.string,
  }),
}
BoxPackage.propTypes = {
  chooseLanguage: PropTypes.string,
  showData: PropTypes.func,
  data: PropTypes.shape({
    qa_content: PropTypes.string,
    qa_jp: PropTypes.string,
    qa_en: PropTypes.string,
    qa_vn: PropTypes.string,
    not_qualified: PropTypes.any,
  }),
}
ModalViewImageMDG.propTypes = {
  open: PropTypes.bool,
  setIsOpenModalImage: PropTypes.func,
  inforUser: PropTypes.shape({
    user_role: PropTypes.string,
  }),

  dataDetailPackage: PropTypes.shape({
    path_files: PropTypes.array,
    path_thumbs: PropTypes.string,
  }),
}


export default ModalViewDetail;
