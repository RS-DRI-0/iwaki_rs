import { useEffect, useState } from "react";
import "./ModalFileManager.css";
import { Button, Col, Row, Pagination, FloatButton} from "antd";
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
import IconLocation from "../../../images/file_manager/IconLocation.svg";
import IconTimeout from "../../../images/file_manager/timeOutIcon.svg";
import dataAlertIcon from "../../../images/file_manager/data_alert.svg";
import NoDataIcon from "../../../images/file_manager/NoDataIcon.svg";
import IconDeleteFilter from "../../../images/file_manager/IconDeleteFilter.svg";
import IconDecreasing from "../../../images/file_manager/decreasingIcon.svg";
import IconAscending from "../../../images/file_manager/ascendingIcon.svg";
import IconTimeHandle from "../../../images/file_manager/timeHandleIcon.svg";
import LoadingIcon from "../../../images/iconLoading.svg";
import IconTotalFile from "../../../images/file_manager/IconTotalFile.svg";
import IconHistory from "../../../images/file_manager/historyIcon.svg";

import ModalViewDetail from "./modal/ModalViewDetail";
import { authAxios } from "../../../api/axiosClient";
import { LeftOutlined } from "@ant-design/icons";
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
  form,
  setValueIsSort,
  valueIsSort
}) => {
  const [dataDetail, setDataDetail] = useState();
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [rotatePhone, setRotatePhone] = useState(false);
  const [onShowOption, setOnShowOption] = useState(false)
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
    setFieldFilter(functionSetData(dayjs().format("YYYY-MM-DD")))
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

  const sortData = () => {

    fetchListData(fieldFilter, !valueIsSort ? 1 : 0)
    setValueIsSort(prev => !prev)
  }

  useEffect(() => {
    // Tìm input trong .ant-select-selector và đặt readonly
    const timeoutId = setTimeout(() => {
      const inputElement = document.querySelector('.pagination-search-page .ant-select-selector input');
      if (inputElement) {
        inputElement.readOnly = true;
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className="container-file-manager"
      style={{ height: rotatePhone === true ? "110svh" : "81svh" }}
    >
      <div style={{ padding: "0% 5%" }}>
        <Row className="title-page-manager" style={{ paddingTop: "2%" }}>
          <span
            className="text-title-manager"
          >
            {language[chooseLanguage].file_manager}
          </span>
          <FloatButton.Group
            trigger="click"
            placement={'left'}
            style={{
              position: "sticky"
            }}
            key={'left'}
            open={onShowOption}
            icon={<LeftOutlined key="left" />}
            onClick={() => setOnShowOption(prev => !prev)}
          >
            <FloatButton onClick={sortData} icon={<img style={{ paddingTop: 2 }} src={!valueIsSort ? IconDecreasing : IconAscending} alt=""></img>} />
            <FloatButton onClick={showModalHistory} icon={<img style={{ paddingTop: 2 }} src={IconHistory} alt=""></img>} />
            <FloatButton onClick={() => setOpenModalFilter(true)} icon={<img style={{ paddingTop: 2 }} src={iconSearch} alt=""></img>} />
            <FloatButton onClick={clearFilter} icon={<img style={{ paddingTop: 2 }} src={IconDeleteFilter} alt=""></img>} />
          </FloatButton.Group>
        </Row>

        {!loadingPage ? (
          dataSource.length > 0 ? (
            <>
              <div className="container-list-package">
                {dataSource.map((item, index) => (
                  <Row className="bg-thumbnail-list-file" key={item.pack_id} >
                    <div className="content-type-pump">
                      <span>{item.pumb_name}</span>
                    </div>
                    <Row style={{ width: "100%", paddingTop: 5 }}>
                      <Col span={8} style={{ position: "relative" }}>

                        <button aria-label="btn-detail" className="thumbNail-manager-app" onClick={() => showModalDetail(item)}>
                          <img
                            src={`data:image/jpeg;base64,${item.thumb_base64}`}
                            alt=""
                          ></img>
                        </button>
                      </Col>
                      <Col
                        span={16}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "0%",
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
                                columnGap: item.is_wait_order === "1" && item.qa_all === "0" && item.cus_status === "-1" && item.is_checksheet !== 3 && '0.5ch'
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
                          <Row style={{ display: "flex", columnGap: "1ch" }}>

                            {textStatus(item.check_status, item)}

                            {Number(item.qa_timeout) === 1 ?
                              <span className="text-timeOut"><img src={IconTimeout} alt=""></img>{language[chooseLanguage].time_out}</span>
                              : null}

                          </Row>
                          <Row className="row-time-handle">
                            <Col span={16} style={{ display: "flex", alignItems: "center", columnGap: "0.5ch" }}>
                              <span>
                                <img src={IconTimeHandle} alt=""></img>
                              </span>
                              <span>
                                {dayjs(item.upload_date).format("HH:mm:ss")} ~ {item.submit_date.toLowerCase() !== "none" ? dayjs(item.submit_date).format("HH:mm:ss") : "N/A"}
                              </span>
                            </Col>
                            <Col span={7} offset={1} style={{ display: "flex", alignItems: "center", columnGap: "0.5ch" }}>

                              <span>
                                <img src={IconLocation} alt=""></img>
                              </span>

                              <span className="content-vl-no">
                                {item.vl_scan_no}
                              </span>
                            </Col>

                          </Row>
                        </div>
                      </Col>
                    </Row>

                    {
                      item.pack_status === "1" ? (
                        <Row className="container-check-cusStatus">
                          <Col span={8}>
                            <Button
                              className="btn-notOK"
                              onClick={() => UpdateCusStatus(item, "0")}
                            >
                              {language[chooseLanguage].not_ok}
                            </Button>
                          </Col>
                          <Col span={8}>
                            <Button
                              className="btn-ok"
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
                  className="pagination-search-page"
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
