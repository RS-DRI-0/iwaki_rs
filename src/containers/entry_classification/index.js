import { Button, Card, Col, Row, Select } from "antd";
import "./style.scss";
import React, { useEffect, useState } from "react";
import ShowModalDetailEntry from "./modal";
import { authAxios } from "../../api/axiosClient";
import { localhost } from "../../server";
import { IconButton, Tooltip } from "@mui/material";
import { openNotificationSweetAlert } from "../../Function";
import SuccessIcon from "../../images/SuccessNotiIcon.svg";
import NoDataIcon from "../../images/file_manager/NoDataIcon.svg";
import ReactLoading from "react-loading";
import styled from "tachyons-components";
import WarningIcon from "../../images/WarningNotiIcon.svg";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { entry_classification } from "./data";
import ModalQA from "./modal/ModalQA";
import ModalQaImage from "./modal/ModalQaImage";

export const Prop = styled("h3")`
f5 f4-ns mb0 white`;

export const Article = styled("div")`
w-25 ma2 h4 items-center justify-center flex flex-column flex-wrap`;

const Entry_Classification = () => {
  const [valueBase64, setValueBase64] = useState([]);
  const [listPumb, setListPumb] = useState([]);
  const [dataDetail, setDataDetail] = useState(undefined);
  const [isShowModalDetail, setIsShowModalDetail] = useState(false);
  const [valueSecondImgBase64, setValueSecondImgBase64] = useState(undefined);
  const [dataPumb, setDataPumb] = useState(undefined);
  const [pumbIsMulti, setPumbIsMulti] = useState(undefined);
  const [startTime, setStartTime] = useState(0);
  const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);
  const [valueListPumb, setValueListPumb] = useState(undefined);
  const [isOpenModalQA, setIsOpenModalQA] = useState(false);
  const [isOpenModalQaImage, setIsOpenModalQaImage] = useState(false);
  const [dataResult, setDataResult] = useState([]);
  const listHaveNotValueReset = ["☑", "P", "N", "✖", "QA"];
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const fetchDataInsert = (pumbModel) => {
    const FormData = require("form-data");
    let data = new FormData();
    data.append("pumb_id", pumbModel);
    data.append("user_pair", inforUser.user_pair);
    data.append("user_role", inforUser.user_role);
    const startTimeClick = Date.now();

    authAxios()
      .post(`${localhost}/get_entry_clf_info`, data)
      .then((res) => {
        let arrData = [];

        setStartTime(startTimeClick);
        sessionStorage.setItem("clf_id", res.data.clf_id);
        sessionStorage.setItem("clf_table", res.data.clf_table);

        res.data.lst_thum_base64.forEach((base64, index) => {
          arrData.push({
            id: index + 1,
            img_base64: `data:image/webp;base64,${base64}`,
            value_id: index + 1,
          });
        });
        // entry_classification.lst_thum_base64.forEach((base64, index) => {
        //   arrData.push({
        //     id: index + 1,
        //     img_base64: `data:image/webp;base64,${base64}`,
        //     value_id: index + 1,
        //   });
        // });

        if (res.status === 201) {
          openNotificationSweetAlert(WarningIcon, res.data.message);
        }
        setDataDetail(res.data);

        // setDataDetail(entry_classification);

        setValueBase64(arrData);
        setDataResult(arrData);
      })
      .catch((err) => {
        setValueBase64([]);
        setDataResult([]);

        console.log(err);
      });
  };

  const fetchListPumb = () => {
    authAxios()
      .get(`${localhost}/get_list_pump`, {
        params: {
          user_role: inforUser.user_role,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setListPumb(res.data.list_pumb);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const returnPackage = (packageID, packageInfo) => {
    const FormData = require("form-data");
    let data = new FormData();
    console.log(packageID);
    const listCheckValue = [undefined, null, ""];
    if (!listCheckValue.includes(packageID)) {
      //  const data = JSON.parse(dataReturn)
      const clf_id = sessionStorage.getItem("clf_id");
      const clf_table = sessionStorage.getItem("clf_table");

      data.append("clf_id", clf_id);
      data.append("clf_table", clf_table);
      data.append("user_pair", parseInt(inforUser.user_pair));
      data.append("user_role", inforUser.user_role);
      authAxios()
        .post(`${localhost}/return_pack_entry_clf`, data)
        .then((res) => { })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const chooseModel = (value, data) => {
    console.log(data);
    if (dataDetail !== undefined) {
      returnPackage(dataDetail.clf_id, dataDetail.clf_table);
    }
    const filterPumb = listPumb.filter((e) => e.pumb_id === data.key);
    sessionStorage.setItem("OptionMachine", JSON.stringify(filterPumb));

    setDataPumb(data);
    setPumbIsMulti(data.is_multi);
    fetchDataInsert(data.value);
  };

  const onFinish = () => {

    if (isOpenModalQA === true || isOpenModalQaImage === true) {
      return
    }
    let countNumbers = 0;
    let countCheckMark = 0;
    let countP = 0;
    let countX = 0;
    valueBase64.forEach((item) => {
      const value = item.value_id;
      if (typeof value === "number") {
        countNumbers++;
      } else {
        switch (value) {
          case "☑":
            countCheckMark++;
            break;
          case "P":
            countP++;
            break;
          case "✖":
            countX++;
            break;
        }
      }
    });

    const updatedDataList = dataResult.map((item) => ({
      ...item,
      value_id: item.value_id === "☑" ? "S" : item.value_id,
    }));
    // const updatedDataList = valueBase64.map((item) => ({
    //   ...item,
    //   value_id: item.value_id === "☑" ? "S" : item.value_id,
    // }));

    const concatenatedValues = updatedDataList
      .map((item) => item.value_id)
      .join("‡");

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(dataPumb.is_multi);
    setLoadingBtnSubmit(true);
    authAxios()
      .post(`${localhost}/submit_entry_clf`, {
        results: concatenatedValues,
        user_Id: parseInt(inforUser.user_id),
        user_pair: parseInt(inforUser.user_pair),
        user_role: parseInt(inforUser.user_role),
        user_id: parseInt(inforUser.user_id),

        pumb_id: dataPumb.value,
        lv1_fields: dataPumb.lv1_fields,
        lv3_fields: dataPumb.lv3_fields,
        is_multi: dataPumb.is_multi,
        pumb_model: dataPumb.pumb_model,

        msnv_e: inforUser.user_msnv,
        total_time: duration,
        total_cs: countNumbers,
        total_cs2: countCheckMark,
        total_orther: countP,
        total_delete: countX,

        prioriti: dataDetail.prioriti,
        clf_id: parseInt(dataDetail.clf_id),
        clf_table: dataDetail.clf_table,
        op_table: dataDetail.op_table,
        path_files: dataDetail.path_files,
        path_thumbs: dataDetail.path_thumbs,
        pack_id: dataDetail.pack_id,
        pack_name: dataDetail.pack_name,
        upload_user: dataDetail.upload_user,
        upload_usname: dataDetail.upload_usname,
        upload_date_jp: dataDetail.upload_date_jp,
        capture_type: dataDetail.capture_type,
        qa_all: 0,
        qa_result: "",
        jp_time_ymd: dataDetail.jp_time_ymd,
      })
      .then((res) => {
        setLoadingBtnSubmit(false);
        setStartTime(0);
        setValueBase64([]);
        openNotificationSweetAlert(SuccessIcon, res.data.message);

        fetchDataInsert(dataPumb.value);
      })
      .catch((err) => {
        setLoadingBtnSubmit(false);
      });
  };

  const handleClickCard = (_index) => {
    setIsShowModalDetail(true);
    const secondImgBase64 = valueBase64[_index].img_base64;

    setValueSecondImgBase64(secondImgBase64);
  };

  function return_index_diff(arr, i) {
    // Chắc chắn giá trị của index hiện tại ko phải số

    // Bắt đầu từ giá trị của index hiện tại về trước
    let index_pre_dif0 = 0;
    for (let h = i - 1; h >= 0; h--) {
      if (listHaveNotValueReset.includes(arr[h])) {
        continue;
      }
      index_pre_dif0 = h;
      break;
    }

    // Bắt đầu từ giá trị của index hiện tại về sau
    let index_next_dif0 = 0;
    for (let k = i + 1; k < arr.length; k++) {
      if (listHaveNotValueReset.includes(arr[k])) {
        continue;
      }
      index_next_dif0 = k;
      break;
    }

    return [index_pre_dif0, index_next_dif0];
  }

  function return_check_error(return_arr, index) {
    // ----- TH giữ nguyên giá trị của index hiện tại nếu nhập sai quy tắc
    let bool_check_error = false;
    // Nếu giá trị index liền trước là Nút T và index hiện tại là phần tử cuối cùng đang nhập thì giữ nguyên
    if (return_arr[index - 1] === "☑" && index === return_arr.length - 1) {
      if (index === return_arr.length - 1) {
        if (
          return_arr[index] === "☑" &&
          listHaveNotValueReset.includes(return_arr[index - 1])
        ) {
          bool_check_error = true;
          return bool_check_error;
        }
      } else {
        bool_check_error = true;
      }
    } else {
      // TH không phải index cuối cùng
      // Nếu giá trị index hiện tại là Nút 1 và là index đầu tiên thì giữ nguyên

      if (return_arr[index] === "☑" && index === 0) {
        bool_check_error = true;
        return bool_check_error;
      }
      // Nếu giá trị index hiện tại là Nút 1 và giá trị index liền sau là Nút 1|2|3|4 thì giữ nguyên
      if (
        return_arr[index] === "☑" &&
        listHaveNotValueReset.includes(return_arr[index - 1])
      ) {
        bool_check_error = true;
        return bool_check_error;
      }

      // Nếu giá trị của index hiện tại là Nút 1|2|3|4 và liền sau là Nút 1 thì giữ nguyên
      if (
        listHaveNotValueReset.includes(return_arr[index]) &&
        return_arr[index + 1] === "☑"
      ) {
        bool_check_error = true;
      }
    }
    return bool_check_error;
  }

  function updateArray(arr, index, newValue) {
    let return_arr = arr.slice();
    return_arr[index] = newValue;
    // ----- TH giữ nguyên giá trị của index hiện tại nếu nhập sai quy tắc
    let bool_check_error = return_check_error(return_arr, index);
    if (bool_check_error) {
      return arr; // Trả lại dữ liệu lần liền trước
    }

    // -----TH cho phép nhập Nút thì thay đổi giá trị các index kế sau
    let index_diff = return_index_diff(return_arr, index); // lấy ra index kế trước/sau (mà giá trị khác 0) cần tìm
    let number_previous = return_arr[index_diff[0]]; // Giá trị của index kế sau (khác Nút)
    // TH này chỉ chạy khi là Nhập cho index đầu tiên
    if (["☑", "P", "N", "✖", "R", "QA"].includes(number_previous)) {
      number_previous = 0;
    }

    // TH thay đổi giá trị các index hiện tại (Nút 5 R)
    if (["R"].includes(return_arr[index])) {
      for (let g = index; g < return_arr.length; g++) {
        if (listHaveNotValueReset.includes(return_arr[g]) && g !== index) {
          continue;
        }
        number_previous += 1;
        return_arr[g] = number_previous;
      }
      return return_arr;
    }

    // TH thay đổi giá trị các index kế sau
    for (let g = index + 1; g < return_arr.length; g++) {
      if (listHaveNotValueReset.includes(return_arr[g])) {
        continue;
      }
      number_previous += 1;
      return_arr[g] = number_previous;
    }

    return return_arr;
  }
  const [indexArr, setIndexArr] = useState(null);

  const handleClickButton = (e, _index, value) => {
    // Nút T: "☑", Nút P: "P", Nút N: "N", Nút X: "✖"
    e.stopPropagation();

    if (value === "QA") {
      setIndexArr(_index);
      setIsOpenModalQaImage(true);
    } else {
      const updatedData = [...valueBase64];
      const arrayData = updatedData.map((item) => item.value_id);

      const newDataResult = [...dataResult];

      const return_data = updateArray(arrayData, _index, value);

      for (let i = 0; i < return_data.length; i++) {
        updatedData[i].value_id = return_data[i];
      }
      setValueBase64(updatedData);
      if (value === "R") {
        for (let i = 0; i < updatedData.length; i++) {
          if (updatedData[i].value_id !== "QA") {
            newDataResult[i].value_id = updatedData[i].value_id;
          }
        }
      } else {
        newDataResult[_index].value_id = value

      }
    }
  };

  const KeyPressF1 = () => {
    document.getElementById("btn-submit").click();
  };

  useEffect(() => {
    fetchListPumb();
  }, []);

  useEffect(() => {
    if (valueBase64.length !== 0) {
      const handleKeyPress = (event) => {
        if (event.key === "F1") {
          event.preventDefault();
          KeyPressF1();
        }
        if (event.key === "Enter") {
          event.preventDefault();
        }
        if (event.key === "F2") {
          event.preventDefault();
          document.getElementById("btn-show-qa").click();
        }
      };

      document.addEventListener("keydown", handleKeyPress);

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [valueBase64]);

  const showModalQA = () => {
    if (isOpenModalQaImage === false) {
      setIsOpenModalQA(true);
    }
  };

  return (
    <>
      {loadingBtnSubmit && (
        <div className="loading-overlay">
          <Article key="bars">
            <ReactLoading type="bars" color="#fff" />
            <Prop>Đang phân loại dữ liệu...</Prop>
          </Article>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* {valueListPumb !== undefined && ( */}
        <Select
          size={"middle"}
          id="code_city"
          style={{ width: "10%", height: "4vh" }}
          optionFilterProp="children"
          placeholder="Chọn mã máy"
          onChange={chooseModel}
        // defaultValue={valueListPumb.pumb_model}
        >
          {listPumb.map((item, index) => (
            <Select.Option
              key={item.pumb_id}
              value={item.pumb_id}
              is_multi={item.is_multi}
              lv1_fields={item.lv1_fields}
              lv3_fields={item.lv3_fields}
              pumb_model={item.pumb_model}
            >
              {item.pumb_model}
            </Select.Option>
          ))}
        </Select>
        {/* )} */}
      </div>

      {valueBase64.length !== 0 ? (
        <>
          <div className="entry_classification_container-fluid">
            <div className="entry_classification_container">
              <Row gutter={16} className="entry_classification_row">
                {valueBase64.length !== 0 &&
                  valueBase64.map((item, _index) => (
                    <Col span={3} key={item.id}>
                      <Card
                        hoverable
                        className="entry_classification_card"
                        style={{
                          boxShadow:
                            item.value_id === "QA" &&
                            "0 -1px 2px 2px rgb(231 205 15 / 52%), 0 3px 6px 0 rgb(232 239 7 / 70%), 0 5px 12px 4px rgb(203 235 28 / 22%)",
                        }}
                        cover={
                          <button
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            onClick={() => handleClickCard(_index)}
                          >
                            <img
                              alt="Red dot"
                              src={item.img_base64}
                              style={{ height: "18vh", width: "100%" }}
                            ></img>
                          </button>
                        }
                      // onClick={() => handleClickCard(_index)}
                      >
                        {Number(pumbIsMulti) === 1 && (
                          <>
                            <span
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                justifyContent: "center",
                                fontSize: 18,
                              }}
                            >
                              {item.value_id}
                            </span>
                            <Row
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Col span={8} style={{ textAlign: "center" }}>
                                <Tooltip title="Mặt sau">
                                  <IconButton
                                    onClick={(e) =>
                                      handleClickButton(e, _index, "☑")
                                    }
                                  >
                                    <span style={{ fontSize: 12 }}>☑</span>
                                  </IconButton>
                                </Tooltip>
                              </Col>
                              <Col span={8} style={{ textAlign: "center" }}>
                                <Tooltip title="Other">
                                  <IconButton
                                    onClick={(e) =>
                                      handleClickButton(e, _index, "P")
                                    }
                                  >
                                    <span style={{ fontSize: 12 }}>P</span>
                                  </IconButton>
                                </Tooltip>
                              </Col>

                              <Col span={8} style={{ textAlign: "center" }}>
                                <Tooltip title="Nameplate">
                                  <IconButton
                                    onClick={(e) =>
                                      handleClickButton(e, _index, "N")
                                    }
                                  >
                                    <span style={{ fontSize: 12 }}>N</span>
                                  </IconButton>
                                </Tooltip>
                              </Col>

                              <Col span={8} style={{ textAlign: "center" }}>
                                <Tooltip title="Xóa ảnh">
                                  <IconButton
                                    onClick={(e) =>
                                      handleClickButton(e, _index, "✖")
                                    }
                                  >
                                    <span style={{ fontSize: 12 }}>✖</span>
                                  </IconButton>
                                </Tooltip>
                              </Col>
                              <Col span={8} style={{ textAlign: "center" }}>
                                <Tooltip title="Reset">
                                  <IconButton
                                    onClick={(e) =>
                                      handleClickButton(e, _index, "R")
                                    }
                                  >
                                    <AutorenewIcon style={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                              </Col>
                              <Col span={8} style={{ textAlign: "center" }}>
                                <Tooltip title="QA">
                                  <IconButton
                                    onClick={(e) =>
                                      handleClickButton(e, _index, "QA")
                                    }
                                  >
                                    <span
                                      style={{ fontSize: 12, color: "#e3e321" }}
                                    >
                                      QA
                                    </span>
                                  </IconButton>
                                </Tooltip>
                              </Col>
                            </Row>
                          </>
                        )}
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>
          </div>
          <Row style={{ padding: "0% 1%" }}>
            <Col
              span={12}
              style={{
                fontWeight: 600,
                fontSize: 18,
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                marginTop: 15,
              }}
            >
              <Col span={4}>☑: Mặt sau</Col>
              <Col span={4}>P: Other</Col>
              <Col span={4}>N: Nameplate</Col>
              <Col span={4}>✖: Xóa ảnh</Col>
              <Col span={4} style={{ display: "flex", alignItems: "center" }}>
                <AutorenewIcon style={{ fontSize: 16 }} />: Reset
              </Col>
              <Col span={4}>
                <span style={{ color: "#e3e321" }}>QA</span>: QA ảnh
              </Col>
            </Col>
            <Col
              span={12}
              style={{
                margin: "auto",
                display: "flex",
                justifyContent: "end",
                marginTop: 10,
                paddingRight: 10,
                columnGap: "2ch",
              }}
            >
              <Button
                id="btn-show-qa"
                onClick={showModalQA}
                // loading={loadingBtnSubmit}
                style={{
                  color: "#fff",
                  padding: "0% 5%",
                  background: "#bbbb46",
                }}
              >
                QA (F2)
              </Button>
              <Button
                id="btn-submit"
                type="primary"
                onClick={onFinish}
                loading={loadingBtnSubmit}

              >
                SUBMIT (F1)
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <Col span={24}>
          <div className="container-noData-file-manager">
            <div style={{ display: "grid" }}>
              <img src={NoDataIcon} alt=""></img>
              <p>There is no data to display</p>
            </div>
          </div>
        </Col>
      )}
      {isShowModalDetail && (
        <ShowModalDetailEntry
          isShowModalDetail={isShowModalDetail}
          setIsShowModalDetail={setIsShowModalDetail}
          valueSecondImgBase64={valueSecondImgBase64}
        />
      )}
      {isOpenModalQA && (
        <ModalQA
          open={isOpenModalQA}
          setIsOpenModalQA={setIsOpenModalQA}
          inforUser={inforUser}
          valueBase64={valueBase64}
          startTime={startTime}
          setLoadingBtnSubmit={setLoadingBtnSubmit}
          dataPumb={dataPumb}
          dataDetail={dataDetail}
          setStartTime={setStartTime}
          setValueBase64={setValueBase64}
          fetchDataInsert={fetchDataInsert}
        />
      )}
      {isOpenModalQaImage && (
        <ModalQaImage
          open={isOpenModalQaImage}
          setIsOpenModalQaImage={setIsOpenModalQaImage}
          inforUser={inforUser}
          valueBase64={valueBase64}
          startTime={startTime}
          setLoadingBtnSubmit={setLoadingBtnSubmit}
          dataPumb={dataPumb}
          dataDetail={dataDetail}
          setStartTime={setStartTime}
          setValueBase64={setValueBase64}
          fetchDataInsert={fetchDataInsert}
          indexArr={indexArr}
          updateArray={updateArray}
          dataResult={dataResult}
          setDataResult={setDataResult}
        />
      )}
    </>
  );
};

export default Entry_Classification;
