import { useEffect, useState } from "react";
import "./ModalFileManager.css";
import { Button, Col, Row, Pagination } from "antd";
import dayjs from "dayjs";
import { localhost } from "../../../server";
import language from "../../../language.json";
import PriorityIcon from "../../../images/file_manager/PriorityIcon.svg";
import ModalFilterData from "./modal/ModalFilterData";
import iconSearch from "../../../images/file_manager/iconSearch.svg";
import IconStatusQualified from "../../../images/file_manager/IconStatusQualified.svg";
import IconStatusNotQualified from "../../../images/file_manager/IconStatusNotQualified.svg";
import IconStatusImgNotGood from "../../../images/file_manager/IconStatusImgNotGood.svg";
import IconStatusProcessing from "../../../images/file_manager/IconStatusProcessing.svg";
import IconPumbType from "../../../images/file_manager/IconPumbType.svg";
import IconLocation from "../../../images/file_manager/IconLocation.svg";
import IconNameOrder from "../../../images/file_manager/IconNameOrder.svg";
import IconTimeout from "../../../images/file_manager/timeOutIcon.svg";
import dataAlertIcon from "../../../images/file_manager/data_alert.svg";
import NoDataIcon from "../../../images/file_manager/NoDataIcon.svg";
import IconDeleteFilter from "../../../images/file_manager/IconDeleteFilter.svg";
import LoadingIcon from "../../../images/iconLoading.svg";
import IconTotalFile from "../../../images/file_manager/IconTotalFile.svg";

import ModalViewDetail from "./modal/ModalViewDetail";
import { authAxios } from "../../../api/axiosClient";
import { HistoryOutlined } from "@ant-design/icons";
import ModalShowHistory from "./modal/ModalShowHistory";
import { templateNodata } from "../../../Function";
import PropTypes from "prop-types";

const FileManager = ({
  chooseLanguage,
  setCheckNoti,
  setCountNotification,
  inforUser,
  pager,
  fetchListData,
  dataSource,
  loadingPage,
  form
}) => {
  const [dataDetail, setDataDetail] = useState();
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [rotatePhone, setRotatePhone] = useState(false);

  const [fieldFilter, setFieldFilter] = useState({
    id_user: inforUser.user_id,
    upload_date: dayjs().format("YYYY-MM-DD"),
    page_index: 1,
    page_size: pager.pageSize,

    input_search: "",
    pump_id: "",
    is_search: "",
    pack_status: "",

    pack_id: "",
    tb_package: "",
  });

  const [isOpenModalHistory, setIsOpenModalHistory] = useState(false);

  const functionSetData = (date) => {
    return {
      id_user: inforUser.user_id,
      upload_date: date,
      page_index: 1,
      page_size: pager.pageSize,

      input_search: "",
      pump_id: "",
      is_search: "",
      pack_status: "",

      pack_id: "",
      tb_package: "",
    }
  }

  const showContent = (icon, color, content) => {
    return (
      <span className="text-check-status" style={{ background: color, width: "fit-content" }}>
        <img src={icon} alt=""></img>{" "}
        {content}
      </span>
    );
  }

  const functionSetContentBasedOnTotal = (data) => {
    if (Number(data.total_qa) > 0 || Number(data.total_warning) > 0) {
      return showContent(IconStatusImgNotGood, "#DAA400", language[chooseLanguage].images_not_good)
    } else if (Number(data.total_notqualified) > 0) {
      return showContent(IconStatusNotQualified, "#C63F3F", language[chooseLanguage].not_qualified)
    } else {
      return showContent(IconStatusQualified, "#07864B", language[chooseLanguage].qualified)
    }
  }

  const functionHandlePumpMulti = (data) => {
    const listIsCheckSheet = [0, 3]
    if (listIsCheckSheet.includes(parseInt(data.is_checksheet))) {
      if (Number(data.pack_status) < 1) {
        return showContent(IconStatusProcessing, "#64748B", language[chooseLanguage].processing)
      }
      else if (Number(data.pack_status) >= 1) {
        if (Number(data.check_status) === 1) {
          return showContent(IconStatusQualified, "#07864B", language[chooseLanguage].qualified)
        }
        else if (Number(data.check_status) === 2) {
          return showContent(IconStatusNotQualified, "#C63F3F", language[chooseLanguage].not_qualified)
        }
        else if (Number(data.check_status) === 3) {
          return showContent(IconStatusImgNotGood, "#DAA400", language[chooseLanguage].images_not_good)
        } else {
          return functionSetContentBasedOnTotal(data)
        }
      }
    }

    else if (parseInt(data.is_checksheet) === 1) {
      if (Number(data.pack_status) >= 1) {
        return functionSetContentBasedOnTotal(data)
      } else {
        return showContent(IconStatusProcessing, "#64748B", language[chooseLanguage].processing)
      }
    }
  }

  const functionHandlePumpSingle = (data, text) => {
    if (parseInt(data.is_checksheet) === 0) {
      if (data.lst_data_multi.length === 0) {
        return showContent(IconStatusProcessing, "#64748B", language[chooseLanguage].processing)
      }
      else if (parseInt(data.total_qa) > 0 || Number(data.total_warning) > 0) {
        return showContent(IconStatusImgNotGood, "#DAA400", language[chooseLanguage].images_not_good)

      } else if (parseInt(data.total_notqualified) > 0) {
        return showContent(IconStatusNotQualified, "#C63F3F", language[chooseLanguage].not_qualified)

      } else {
        return showContent(IconStatusQualified, "#07864B", language[chooseLanguage].qualified)
      }
    } else if (parseInt(data.is_checksheet) !== 0) {
      if (text.toString() === "2") {
        return showContent(IconStatusNotQualified, "#C63F3F", language[chooseLanguage].not_qualified)
      } else if (text.toString() === "1") {
        return showContent(IconStatusQualified, "#07864B", language[chooseLanguage].qualified)
      } else if (text.toString() === "0") {
        return showContent(IconStatusProcessing, "#64748B", language[chooseLanguage].processing)
      } else {
        return showContent(IconStatusImgNotGood, "#DAA400", language[chooseLanguage].images_not_good)
      }
    }
  }

  const textStatus = (text, data) => {
    // MDG
    if (parseInt(data.is_multi) === 0) {
      return functionHandlePumpMulti(data)
      // LK
    } else {
      return functionHandlePumpSingle(data, text)
    }
  };

  const handleChangePagination = (page, pageSize) => {
    const data = {
      ...fieldFilter,
      page_index: page,
      page_size: pageSize,
    }
    fetchListData(data);
    setFieldFilter(data);
  };

  const UpdateCusStatus = async (value, type) => {
    if (type !== value.cus_status) {
      const FormData = require("form-data");
      let data = new FormData();
      data.append("id_user", inforUser.user_id);
      data.append("tb_package", value.tb_package);
      data.append("vl_status", type);
      data.append("pack_id", value.pack_id);
      data.append("user_role", inforUser.user_role);

      await authAxios()
        .post(`${localhost}/update_cus_status`, data)
        .then((res) => {
          fetchCountNotification()
          fetchListData(fieldFilter);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchCountNotification = async () => {
    const FormData = require("form-data");
    let data = new FormData();

    data.append("id_user", inforUser.user_id);
    data.append("user_role", inforUser.user_role);
    data.append("date_now", dayjs().format("YYYY-MM-DD"));

    await authAxios()
      .post(`${localhost}/count_notifi`, data)
      .then((res) => {
        setCheckNoti(false);
        setCountNotification(res.data.total_notif);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const colorText = (data) => {
    if (data.pack_status === "2") {
      if (data.cus_status === "1") {
        return "green"
      } else if (data.cus_status === "0") {
        return "red"
      } else {
        return "black"
      }
    } else {
      return "black"
    }
  }

  const showModalDetail = (record) => {
    setDataDetail(record);
    setOpenModalDetail(true);
  };

  const clearFilter = () => {
    form.resetFields();
    form.setFieldsValue({
      date: dayjs(),
    });

    fetchListData(functionSetData(dayjs().format("YYYY-MM-DD")));
  };

  useEffect(() => {
    function handleOrientationChange() {
      if (window.orientation === 90 || window.orientation === -90) {
        setRotatePhone(true);
      } else {
        setRotatePhone(false);
      }
    }

    // Thêm event listener khi component được mount
    window.addEventListener("orientationchange", handleOrientationChange);

    // Loại bỏ event listener khi component unmount
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  const showModalHistory = () => {
    setIsOpenModalHistory(true)
  }

  return (
    <div
      className="container-file-manager"
      style={{ height: rotatePhone === true ? "110svh" : "81svh" }}
    >

      <div style={{ padding: "0% 5%" }}>
        <Row className="title-page-manager" style={{ paddingTop: "2%" }}>
          <Col span={15} style={{ display: "flex", alignItems: "center" }}>
            <span
              className="text-title-manager"
            >
              {language[chooseLanguage].file_manager}
            </span>
          </Col>
          <Col
            span={9}
            className="col-btn-manager"
          >
            <Button
              className="btn-history"
              onClick={showModalHistory}
              aria-label="history"
            >
              <HistoryOutlined style={{ fontSize: 21, color: 'rgb(57, 75, 118)' }} />
            </Button>
            <Button
              style={{ padding: "4px" }}
              onClick={() => setOpenModalFilter(true)}
              aria-label="filter"
            >
              <img src={iconSearch} alt=""></img>
            </Button>
            <Button style={{ padding: "4px" }} onClick={clearFilter} aria-label="search">
              <img src={IconDeleteFilter} alt=""></img>
            </Button>
          </Col>
        </Row>

        {!loadingPage ? (
          dataSource.length > 0 ? (
            <>
              <div className="container-list-package">
                {dataSource.map((item, index) => (
                  <Row className="bg-thumbnail-list-file" key={item.pack_id}>
                    <Row style={{ width: "100%" }}>
                      <Col span={8} style={{ position: "relative" }}>
                        <button aria-label="btn-detail" className="thumbNail-manager-app" onClick={() => showModalDetail(item)} style={{ background: "none", padding: 0, border: 0 }}>
                          <img
                            src={`data:image/webp;base64,${item.thumb_base64}`}
                            alt=""
                          ></img>
                        </button>
                      </Col>
                      <Col
                        span={16}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "4% 2%",
                        }}
                      >
                        <div className="list-thumbnail-manager">
                          <Row
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Col
                              span={24}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: '0.5ch'
                              }}
                            >
                              <span>
                                {item.is_wait_order === "1" && item.qa_all === "0" && item.cus_status === "-1" && item.is_checksheet !== 3 ? (
                                  <img src={dataAlertIcon} alt=""></img>
                                ) : null}
                              </span>
                              <button aria-label="button-view-detail" onClick={() => showModalDetail(item)} style={{ background: "none", padding: 0, border: 0 }}>
                                <span
                                  style={{ color: colorText(item) }}
                                  className="title-thumbnail-manager"

                                // role="button"
                                >
                                  {item.vl_mfg_no.toUpperCase()}
                                </span>
                              </button>

                              <span>
                                {item.prioriti === "1" ? (
                                  <img src={PriorityIcon} alt=""></img>
                                ) : null}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={8}>
                              <span
                                style={{
                                  paddingLeft: "1.5%",
                                  color: "#64748B",
                                  fontWeight: 400,
                                }}
                              >
                                {dayjs(item.upload_date).format("HH:mm:ss")}
                              </span>
                            </Col>
                            <Col span={16} style={{ display: "grid", rowGap: "0.5ch" }}>
                              {textStatus(item.check_status, item)}
                              {Number(item.qa_timeout) === 1 ?
                                <span style={{ color: "red", fontWeight: "600", fontSize: 10, display: "flex", alignItems: "center", columnGap: "0.5ch" }}><img src={IconTimeout} alt=""></img>{language[chooseLanguage].cannot_make_decision}</span>
                                : null}
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    <Row style={{ width: "100%" }}>
                      <Col
                        span={8}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <img src={IconPumbType} alt=""></img>&nbsp;
                        {item.pumb_name}
                      </Col>
                      <Col
                        span={11}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <img src={IconNameOrder} alt=""></img>&nbsp;
                        {item.vl_model_name.toUpperCase()}
                      </Col>
                      <Col
                        span={5}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <img src={IconLocation} alt=""></img>&nbsp;
                        {item.vl_scan_no}
                      </Col>
                    </Row>

                    {
                      item.pack_status === "1" ? (
                        <Row className="container-check-cusStatus">
                          <Col span={8}>
                            <Button
                              style={{ color: "#394B76" }}
                              onClick={() => UpdateCusStatus(item, "0")}
                            >
                              {language[chooseLanguage].not_ok}
                            </Button>
                          </Col>
                          <Col span={8}>
                            <Button
                              style={{ color: "#fff", background: "#0C4DA2" }}
                              onClick={() => UpdateCusStatus(item, "1")}
                            >
                              {language[chooseLanguage].ok}
                            </Button>
                          </Col>
                        </Row>
                      ) : null
                    }
                  </Row>
                ))}
              </div>
              <div className="pagination-file-manager">
                <Pagination
                  simple
                  current={pager.current}
                  defaultPageSize={pager.pageSize}
                  total={pager.count}
                  onChange={handleChangePagination}
                  showSizeChanger
                  pageSizeOptions={[5, 10, 15, 20]}
                  locale={{ items_per_page: "" }}
                />
                <span>{pager.count}</span>
                <img src={IconTotalFile} alt=""></img>
              </div>
            </>
          ) :
            templateNodata(NoDataIcon, language, chooseLanguage)
        ) : (
          <div className="container-loading-file-manager">
            <img
              style={{ width: "7%", height: "auto" }}
              src={LoadingIcon}
              className="load-image-desktop"
              alt=""
            ></img>
          </div>
        )}
      </div>

      {openModalFilter ? (
        <ModalFilterData
          open={openModalFilter}
          setOpenModalFilter={setOpenModalFilter}
          setFieldFilter={setFieldFilter}
          fetchListData={fetchListData}
          form={form}
          pager={pager}
          chooseLanguage={chooseLanguage}
        />
      ) : null}

      {isOpenModalHistory ? (
        <ModalShowHistory
          open={isOpenModalHistory}
          setIsOpenModalHistory={setIsOpenModalHistory}
          chooseLanguage={chooseLanguage}
        />
      ) : null}

      {openModalDetail ? (
        <ModalViewDetail
          open={openModalDetail}
          setOpenModalDetail={setOpenModalDetail}
          dataDetail={dataDetail}
          chooseLanguage={chooseLanguage}
          fetchListData={fetchListData}
          fieldFilter={fieldFilter}
          pager={pager}
        />
      ) : null}
    </div>
  );
};

FileManager.propTypes = {
  chooseLanguage: PropTypes.string,
  setCheckNoti: PropTypes.func,
  setCountNotification: PropTypes.func,
  dataSource: PropTypes.any,
  fetchListData: PropTypes.func,
  loadingPage: PropTypes.bool,
  inforUser: PropTypes.shape({
    user_id: PropTypes.any,
    user_role: PropTypes.any,
  }),
  form: PropTypes.shape({
    resetFields: PropTypes.func,
    setFieldsValue: PropTypes.func,
  }),
  pager: PropTypes.shape({
    pageSize: PropTypes.any,
    count: PropTypes.any,
    current: PropTypes.any,
  }),
}



export default FileManager;
