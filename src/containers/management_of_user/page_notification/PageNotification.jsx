import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import PriorityIcon from "../../../images/file_manager/PriorityIcon.svg";
import dayjs from "dayjs";
import { localhost } from "../../../server";
import language from "../../../language.json";
import IconStatusQualified from "../../../images/file_manager/IconStatusQualified.svg";
import IconTimeout from "../../../images/file_manager/timeOutIcon.svg";
import IconStatusNotQualified from "../../../images/file_manager/IconStatusNotQualified.svg";
import IconStatusImgNotGood from "../../../images/file_manager/IconStatusImgNotGood.svg";
import IconStatusProcessing from "../../../images/file_manager/IconStatusProcessing.svg";
import IconLocation from "../../../images/file_manager/IconLocation.svg";

import ArrowBackIcon from "../../../images/arrow/ArrowBack.svg";

import IconPumbType from "../../../images/file_manager/IconPumbType.svg";
import NoDataIcon from "../../../images/file_manager/NoDataIcon.svg";
import { authAxios } from "../../../api/axiosClient";
import LoadingIcon from "../../../images/iconLoading.svg";

import PropTypes from "prop-types";
import { templateNodata } from "../../../Function";


const PageNotification = ({
  setCheckNoti,
  setDataSource,
  setListStatus,
  chooseLanguage,
  setPager
}) => {
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const [listNotification, setListNotification] = useState([]);
  const [loadingData, setLoadingData] = useState(false)

  const backFileManager = () => {
    setCheckNoti(false);
  };

  const showData = () => {
    setLoadingData(true)
    const FormData = require("form-data");
    let data = new FormData();

    data.append("id_user", inforUser.user_id);
    data.append("user_role", inforUser.user_role);
    data.append("date_now", dayjs().format("YYYY-MM-DD"));
    authAxios()
      .post(`${localhost}/top_notifi`, data)
      .then((res) => {
        setLoadingData(false)
        setListNotification(res.data.list_file);
      })
      .catch((err) => {
        setLoadingData(false)
        console.log(err);
      });

  }

  useEffect(() => {
    window.addEventListener("popstate", function (event) {
      // Xử lý sự kiện khi người dùng nhấn nút "back" ở đây
      console.log("Nút back được nhấn!");
    });
    showData()
  }, []);

  const showContent = (icon, color, content) => {
    return (
      <span className="text-check-status" style={{ background: color, width: "fit-content" }}>
        <img src={icon} alt=""></img> {content}
      </span>
    );
  };

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

  const showDetail = (value) => {
    const FormData = require("form-data");
    let data = new FormData();

    data.append("id_user", inforUser.user_id);
    data.append("user_role", inforUser.user_role);
    data.append("page_index", 1);
    data.append("page_size", 5);
    data.append("upload_date", dayjs().format("YYYY-MM-DD"));

    data.append("input_search", "");
    data.append("pump_id", "");
    data.append("is_search", "2");
    data.append("pack_status", "");

    data.append("pack_id", value.pack_id);
    data.append("tb_package", value.tb_package);
    // data.append("is_sort", 0);

    authAxios()
      .post(`${localhost}/list_file`, data)
      .then((res) => {
        setListStatus(res.data.list_status[0]);
        setCheckNoti(false);
        setDataSource(res.data.list_file);
        setPager({
          pageSize: 5,
          count: 1,
          current: 1,
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const iconCircle = (item) => {
    return (
      <div
        style={{
          width: 8,
          height: 8,
          background: parseInt(item.notified) === 1 ? "#00AAF1" : "#94A3B8",
          borderRadius: "100%",
        }}
      ></div>
    );
  };



  return (
    <div style={{ display: "grid", padding: "0% 5%" }}>
      <Row style={{ paddingTop: "2%" }}>
        <Col span={2} onClick={backFileManager} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={ArrowBackIcon} alt=""></img>
        </Col>
        <Col
          span={20}
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: 14,
            color: "#25355B",
            textTransform: "uppercase"
          }}
        >
          {language[chooseLanguage].notifications}
        </Col>
        <Col span={2}></Col>
      </Row>
      {!loadingData ?

        listNotification.length > 0 ? (
          <div className="container-list-package" style={{ maxHeight: "80svh" }}>
            {listNotification.map((item) => (
              <Row
                onClick={() => showDetail(item)}
                className="bg-thumbnail-list-file"
                style={{
                  background:
                    String(item.notified) === "1" ? "aliceBlue" : null,
                }}
                key={item.pack_id}
              >
                <div className="content-type-pump">
                  <span>{item.pumb_name}</span>
                </div>
                <Row style={{ width: "100%", paddingTop: 5 }}>
                  <Col span={8} style={{ position: "relative" }}>
                    <img
                      src={`data:image/jpeg;base64,${item.thumb_base64}`}
                      alt=""
                      className="img-list-package"
                    ></img>
                  </Col>
                  <Col
                    span={15}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0% 2%",
                    }}
                  >
                    <div className="list-thumbnail-manager">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Col
                          span={24}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>
                            {" "}
                            {item.prioriti === "1" ? (
                              <img src={PriorityIcon} alt=""></img>
                            ) : null}{" "}
                            &nbsp;
                          </span>
                          <span className="title-thumbnail-manager">
                            {item.vl_mfg_no.toUpperCase()}
                          </span>
                        </Col>
                      </div>
                      <Row
                        style={{
                          width: "100%",
                          display: "flex",
                        }}
                      >
                        {/* <Col
                          span={8}
                          style={{ display: "flex", alignItems: "flex-start" }}
                        >
                          <img src={IconPumbType} alt=""></img>&nbsp;
                          {item.pumb_name}
                        </Col> */}
                        <Col span={24} style={{ display: "grid", rowGap: "0.5ch" }}>
                          {textStatus(item.check_status, item)}
                          {/* {Number(item.qa_timeout) === 1 ?
                            <span style={{ color: "red", fontWeight: "bold", fontSize: 10, display: "flex", alignItems: "center", columnGap: "0.5ch" }}><img src={IconTimeout} alt=""></img>{language[chooseLanguage].time_out}</span>
                            : null} */}
                        </Col>
                      </Row>
                      <Row className="row-time-handle">
                          <span style={{display: "flex", alignItems: "center"}}><img src={IconLocation} alt=""></img>&nbsp;{item.vl_scan_no}</span>
                      </Row>
                    </div>
                  </Col>
                  <Col span={1} className="centerItems">
                    {iconCircle(item)}
                  </Col>
                </Row>
              </Row>
            ))}
          </div>
        ) :
          templateNodata(NoDataIcon, language, chooseLanguage)
        :
        <div className="container-loading-file-manager">
          <img
            style={{ width: "7%", height: "auto" }}
            src={LoadingIcon}
            className="load-image-desktop"
            alt=""
          ></img>
        </div>}
    </div>
  );
};

PageNotification.propTypes = {
  chooseLanguage: PropTypes.string,
  setCheckNoti: PropTypes.func,
  setDataSource: PropTypes.func,
  setListStatus: PropTypes.func,
  setPager: PropTypes.func,
}

export default PageNotification;
