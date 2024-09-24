import { Button, Card, Col, Row, Select } from "antd";
import "./style.scss";
import { useEffect, useState } from "react";
import ShowModalDetailEntry from "./modal";
import { authAxios } from "../../api/axiosClient";
import { localhost } from "../../server";
import { IconButton, Tooltip } from "@mui/material";
import { openNotificationSweetAlert } from "../../Function";
import SuccessIcon from "../../images/SuccessNotiIcon.svg";
import NoDataIcon from "../../images/file_manager/NoDataIcon.svg";
import styled from "tachyons-components";
import ReactLoading from "react-loading";
import ButtonViewInforUser from "./button/ButtonViewInforUser";
import WarningIcon from "../../images/WarningNotiIcon.svg";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { check_classification } from "./data";
import ModalQA from "./modal/ModalQA";
import ModalQATotal from "./modal/ModalQATotal";

export const Prop = styled("h3")`
f5 f4-ns mb0 white`;

export const Article = styled("div")`
w-25 ma2 h4 items-center justify-center flex flex-column flex-wrap`;

const Check_Classification = () => {
  const [valueBase64, setValueBase64] = useState([]);
  const [listPumb, setListPumb] = useState([]);
  const [dataDetail, setDataDetail] = useState(undefined);
  const [isShowModalDetail, setIsShowModalDetail] = useState(false);
  const [valueSecondImgBase64, setValueSecondImgBase64] = useState(undefined);
  const [dataPumb, setDataPumb] = useState(undefined);
  const [startTime, setStartTime] = useState(0);
  const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);
  const [dataEntryOld1, setDataEntryOld1] = useState([]);
  const [dataEntryOld2, setDataEntryOld2] = useState([]);
  const [dataUserID1, setDataUserID1] = useState("");
  const [dataUserID2, setDataUserID2] = useState("");
  const [valueListPumb, setValueListPumb] = useState(undefined);
  const [isOpenModalQA, setIsOpenModalQA] = useState(false);
  const [isOpenModalQATotal, setIsOpenModalQATotal] = useState(false);
  const [isIndexQA, setIsIndexQA] = useState();
  const [listContentQA, setListContentQA] = useState([]);
  // const [valueSubmitInput, setValueSubmitInput] = useState("");
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const fetchDataInsert = (pumbModel) => {
    const FormData = require("form-data");
    let data = new FormData();
    data.append("pumb_id", pumbModel);
    data.append("user_pair", inforUser.user_pair);
    data.append("user_role", inforUser.user_role);
    const startTimeClick = Date.now();

    authAxios()
      .post(`${localhost}/get_check_clf_info`, data)
      .then((res) => {
        if (res.status === 201) {
          openNotificationSweetAlert(WarningIcon, res.data.message);
        }
        setStartTime(startTimeClick);
        sessionStorage.setItem("clf_id", res.data.clf_id);
        sessionStorage.setItem("clf_table", res.data.clf_table);

        const entry_1 = res.data.Input_e1.map((item) => {
          if (item.startsWith("QA_") || item.startsWith("OTHER_")) {
            return "QA";
          } else if (isNaN(Number(item))) {
            if (item === "S") {
              return "☑";
            } else {
              return item;
            }
          } else {
            return Number(item);
          }
        });

        const entry_1_old = res.data.Input_e1.map((item) => {
          if (item.startsWith("QA_") || item.startsWith("OTHER_")) {
            return item; // Giữ nguyên nếu bắt đầu bằng "QA_" hoặc "OTHER_"
          } else {
            return ""; // Trả về chuỗi rỗng cho các giá trị khác
          }
        });

        const entry_2 = res.data.Input_e2.map((item) => {
          if (item.startsWith("QA_") || item.startsWith("OTHER_")) {
            return "QA";
          } else if (isNaN(Number(item))) {
            if (item === "S") {
              return "☑";
            } else {
              return item;
            }
          } else {
            return Number(item);
          }
        });

        const entry_2_old = res.data.Input_e2.map((item) => {
          if (item.startsWith("QA_") || item.startsWith("OTHER_")) {
            return item; // Giữ nguyên nếu bắt đầu bằng "QA_" hoặc "OTHER_"
          } else {
            return ""; // Trả về chuỗi rỗng cho các giá trị khác
          }
        });

        const dataEntry1 = res.data.Input_e1.join("‡");
        const dataEntry2 = res.data.Input_e2.join("‡");

        setDataEntryOld1(dataEntry1);
        setDataEntryOld2(dataEntry2);

        setDataUserID1(res.data.e1_user);
        setDataUserID2(res.data.e2_user);

        const mergedList = res.data.lst_thum_base64.map((file, index) => {
          const entry_e1_value = entry_1[index];
          const entry_e2_value = entry_2[index];

          const entry_e1_value_old = entry_1_old[index];
          const entry_e2_value_old = entry_2_old[index];

          let check_QA;
          if (res.data.is_qa_e1 === "1" || res.data.is_qa_e2 === "1") {
            check_QA = true;
          } else {
            check_QA = entry_e1_value === "QA" || entry_e2_value === "QA";
          }

          // Determine the color based on the comparison of Input_e1 and Input_e2 values
          const color = entry_e1_value !== entry_e2_value;

          return {
            id: index + 1,
            img_base64: `data:image/webp;base64,${file}`,
            Input_e1: entry_e1_value,
            Input_e2: entry_e2_value,
            color: color,
            check_QA: check_QA,
            qa_e1: entry_e1_value_old,
            qa_e2: entry_e2_value_old,
            is_qa_e1: res.data.is_qa_e1,
            is_qa_e2: res.data.is_qa_e2,
          };
        });

        setDataDetail(res.data);
        setValueBase64(mergedList);
        // }
      })
      .catch((err) => {
        setValueBase64([]);
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

    const clf_id = sessionStorage.getItem("clf_id");
    const clf_table = sessionStorage.getItem("clf_table");
    if (clf_id !== "" && clf_table !== "") {
      console.log(clf_id, clf_table);
      data.append("clf_id", clf_id);
      data.append("clf_table", clf_table);
      data.append("user_pair", parseInt(inforUser.user_pair));
      data.append("user_role", inforUser.user_role);
      authAxios()
        .post(`${localhost}/return_pack_check_clf`, data)
        .then((res) => { })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const chooseModel = (value, data) => {
    if (dataDetail !== undefined) {
      returnPackage(dataDetail.clf_id, dataDetail.clf_table);
    }
    const filterPumb = listPumb.filter((e) => e.pumb_id === data.key);
    sessionStorage.setItem("OptionMachine", JSON.stringify(filterPumb));
    setValueBase64([]);
    setDataPumb(data);
    fetchDataInsert(data.value);
  };

  const getDisplayValue = (item) => {
    if (item.is_qa_e1 === "0" && item.is_qa_e2 === "1") {
      return item.Input_e1;
    } else if (item.is_qa_e1 === "1" && item.is_qa_e2 === "0") {
      return item.Input_e2;
    } else if (item.is_qa_e1 === "0" && item.is_qa_e2 === "0") {
      return item.Input_e1;
    } else if (item.is_qa_e1 === "1" && item.is_qa_e2 === "1") {
      return item.id;
    } else {
      return item.Input_e1;
    }
  };

  const onFinish = () => {
    let countNumbers = 0;
    let countCheckMark = 0;
    let countP = 0;
    let countN = 0;
    let countX = 0;

    valueBase64.forEach((item) => {
      const value = item.Input_e1;
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
          case "N":
            countN++;
            break;
          case "✖":
            countX++;
            break;
        }
      }
    });

    const updatedDataList = valueBase64.map((item) => ({
      ...item,
      Input_e1:
        item.Input_e1 === "☑"
          ? "S"
          : item.Input_e1 === "QA"
            ? item.qa_e1
            : item.Input_e1,
      Input_e2:
        item.Input_e2 === "☑"
          ? "S"
          : item.Input_e2 === "QA"
            ? item.qa_e2
            : item.Input_e2,
    }));

    const concatenatedValues = updatedDataList
      .map((item) => getDisplayValue(item))
      .join("‡");

    const endTime = Date.now();
    const duration = endTime - startTime;

    setLoadingBtnSubmit(true);
    const valueSubmitInput = JSON.parse(
      sessionStorage.getItem("ValueSubmitInput")
    );

    authAxios()
      .post(`${localhost}/submit_check_clf`, {
        user_role: parseInt(inforUser.user_role),
        user_id: parseInt(inforUser.user_id),
        clf_id: parseInt(dataDetail.clf_id),
        clf_table: dataDetail.clf_table,
        op_table: dataDetail.op_table,
        pumb_id: dataPumb.value,
        total_time: duration,
        total_cs: countNumbers,
        total_cs2: countCheckMark,
        total_orther: countP,
        total_delete: countX,
        prioriti: dataDetail.prioriti,
        lv1_fields:
          valueListPumb !== undefined
            ? valueListPumb.lv1_fields
            : dataPumb.lv1_fields,
        lv3_fields:
          valueListPumb !== undefined
            ? valueListPumb.lv3_fields
            : dataPumb.lv3_fields,
        pack_id: dataDetail.pack_id,
        result_e1: dataEntryOld1,
        result_e2: dataEntryOld2,
        result_c:
          valueSubmitInput === null ? concatenatedValues : valueSubmitInput,
        e1_user: dataUserID1,
        e2_user: dataUserID2,
        msnv_c: inforUser.user_msnv,
        path_files: dataDetail.path_files,
        path_thumbs: dataDetail.path_thumbs,
        is_multi:
          valueListPumb !== undefined
            ? valueListPumb.is_multi
            : dataPumb.is_multi,
        pumb_model:
          valueListPumb !== undefined
            ? valueListPumb.pumb_model
            : dataPumb.pumb_model,
        pump_name:
          valueListPumb !== undefined
            ? valueListPumb.pumb_model
            : dataPumb.pumb_model,
        pack_name: dataDetail.pack_name,
        upload_user: dataDetail.upload_user,
        upload_usname: dataDetail.upload_usname,
        upload_date_jp: dataDetail.upload_date_jp,
        capture_type: dataDetail.capture_type,
        user_Id: parseInt(inforUser.user_id),
        user_pair: parseInt(inforUser.user_pair),

        jp_time_ymd: dataDetail.jp_time_ymd,
        qa_all: valueSubmitInput === null ? 0 : 1,
        qa_result:
          dataPumb.value === "1"
            ? ""
            : dataPumb.value === "3"
              ? valueSubmitInput === null
                ? ""
                : valueSubmitInput
              : "",
        str_result:
          dataPumb.value === "1"
            ? valueSubmitInput === null
              ? "OK"
              : valueSubmitInput
            : "",
      })
      .then((res) => {
        setIsOpenModalQATotal(false);
        setLoadingBtnSubmit(false);
        sessionStorage.removeItem("ValueSubmitInput");
        setStartTime(0);
        setValueBase64([]);
        openNotificationSweetAlert(SuccessIcon, res.data.message);
        fetchDataInsert(dataPumb.value);
      })
      .catch((err) => {
        sessionStorage.removeItem("ValueSubmitInput");
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
      if (["☑", "P", "N", "✖", "QA"].includes(arr[h])) {
        continue;
      }
      index_pre_dif0 = h;
      break;
    }

    // Bắt đầu từ giá trị của index hiện tại về sau
    let index_next_dif0 = 0;
    for (let k = i + 1; k < arr.length; k++) {
      if (["☑", "P", "N", "✖", "QA"].includes(arr[k])) {
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
    if (return_arr[index - 1] === "☑" && index == return_arr.length - 1) {
      bool_check_error = true;
    } else {
      // TH không phải index cuối cùng

      // Nếu giá trị index hiện tại là Nút 1 và là index đầu tiên thì giữ nguyên
      if (return_arr[index] === "☑" && index == 0) {
        bool_check_error = true;

        return bool_check_error;
      }
      // Nếu giá trị index hiện tại là Nút 1 và giá trị index liền sau là Nút 1|2|3|4 thì giữ nguyên
      if (
        return_arr[index] === "☑" &&
        ["☑", "P", "N", "✖", "QA"].includes(return_arr[index - 1])
      ) {
        bool_check_error = true;
        return bool_check_error;
      }

      // Nếu giá trị của index hiện tại là Nút 1|2|3|4 và liền sau là Nút 1 thì giữ nguyên
      if (
        ["☑", "P", "N", "✖", "QA"].includes(return_arr[index]) &&
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
        if (["☑", "P", "N", "✖", "QA"].includes(return_arr[g]) && g !== index) {
          continue;
        }
        number_previous += 1;
        return_arr[g] = number_previous;
      }
      return return_arr;
    }

    for (let g = index + 1; g < return_arr.length; g++) {
      if (["☑", "P", "N", "✖", "QA"].includes(return_arr[g])) {
        continue;
      }
      number_previous += 1;
      return_arr[g] = number_previous;
    }

    return return_arr;
  }

  const handleClickButton = (e, _index, value) => {
    e.stopPropagation();
    if (value === "QA") {
      setIsIndexQA(_index);
      setIsOpenModalQA(true);
    } else {
      const updatedData = [...valueBase64];
      const arrayData = updatedData.map((item) => getDisplayValue(item));
      const return_data = updateArray(arrayData, _index, value);
      for (let i = 0; i < return_data.length; i++) {
        if (
          updatedData[i].is_qa_e1 === "0" &&
          updatedData[i].is_qa_e2 === "1"
        ) {
          updatedData[i].Input_e1 = return_data[i];
        } else if (
          updatedData[i].is_qa_e1 === "1" &&
          updatedData[i].is_qa_e2 === "0"
        ) {
          updatedData[i].Input_e2 = return_data[i];
        } else if (
          updatedData[i].is_qa_e1 === "0" &&
          updatedData[i].is_qa_e2 === "0"
        ) {
          updatedData[i].Input_e1 = return_data[i];
        } else if (
          updatedData[i].is_qa_e1 === "1" &&
          updatedData[i].is_qa_e2 === "1"
        ) {
          return updatedData[i].id;
        } else {
          updatedData[i].Input_e1 = return_data[i];
        }
      }
      if (value === "R") {
        if (
          updatedData[_index].is_qa_e1 === "0" &&
          updatedData[_index].is_qa_e2 === "1"
        ) {
          if (_index >= 0 && _index < updatedData.length) {
            updatedData[_index] = {
              ...updatedData[_index], // Keep other properties unchanged
              check_QA:
                updatedData[_index].is_qa_e1 === "0" &&
                  updatedData[_index].is_qa_e2 === "0"
                  ? false
                  : true, // Set check_QA to false
              qa_e1: "",
            };
          }
        } else if (
          updatedData[_index].is_qa_e1 === "1" &&
          updatedData[_index].is_qa_e2 === "0"
        ) {
          if (_index >= 0 && _index < updatedData.length) {
            updatedData[_index] = {
              ...updatedData[_index], // Keep other properties unchanged
              check_QA:
                updatedData[_index].is_qa_e1 === "0" &&
                  updatedData[_index].is_qa_e2 === "0"
                  ? false
                  : true, // Set check_QA to false
              qa_e2: "",
            };
          }
        } else if (
          updatedData[_index].is_qa_e1 === "0" &&
          updatedData[_index].is_qa_e2 === "0"
        ) {
          if (_index >= 0 && _index < updatedData.length) {
            updatedData[_index] = {
              ...updatedData[_index], // Keep other properties unchanged
              check_QA:
                updatedData[_index].is_qa_e1 === "0" &&
                  updatedData[_index].is_qa_e2 === "0"
                  ? false
                  : true, // Set check_QA to false
              qa_e1: "",
            };
          }
        } else if (
          updatedData[_index].is_qa_e1 === "1" &&
          updatedData[_index].is_qa_e2 === "1"
        ) {
          return updatedData[_index].id;
        } else {
          if (_index >= 0 && _index < updatedData.length) {
            updatedData[_index] = {
              ...updatedData[_index], // Keep other properties unchanged
              check_QA:
                updatedData[_index].is_qa_e1 === "0" &&
                  updatedData[_index].is_qa_e2 === "0"
                  ? false
                  : true, // Set check_QA to false
              qa_e1: "",
            };
          }
        }
      }
      console.log(updatedData);
      setValueBase64(updatedData);
    }
  };

  const handleClickQAValue = (e, _index, value) => {
    e.stopPropagation();

    const valueChangeInput = "QA";
    const updatedData = [...valueBase64];
    const arrayData = updatedData.map((item) => getDisplayValue(item));

    const return_data = updateArray(arrayData, _index, valueChangeInput);

    for (let i = 0; i < return_data.length; i++) {
      if (updatedData[i].is_qa_e1 === "0" && updatedData[i].is_qa_e2 === "1") {
        updatedData[i].Input_e1 = return_data[i];
      } else if (
        updatedData[i].is_qa_e1 === "1" &&
        updatedData[i].is_qa_e2 === "0"
      ) {
        updatedData[i].Input_e2 = return_data[i];
      } else if (
        updatedData[i].is_qa_e1 === "0" &&
        updatedData[i].is_qa_e2 === "0"
      ) {
        updatedData[i].Input_e1 = return_data[i];
      } else if (
        updatedData[i].is_qa_e1 === "1" &&
        updatedData[i].is_qa_e2 === "1"
      ) {
        return updatedData[i].id;
      } else {
        updatedData[i].Input_e1 = return_data[i];
      }
    }

    if (isIndexQA >= 0 && isIndexQA < updatedData.length) {
      if (
        updatedData[isIndexQA].is_qa_e1 === "0" &&
        updatedData[isIndexQA].is_qa_e2 === "1"
      ) {
        updatedData[isIndexQA] = {
          ...updatedData[isIndexQA], // Keep other properties unchanged
          check_QA: true,
          qa_e1: value,
        };
      } else if (
        updatedData[isIndexQA].is_qa_e1 === "1" &&
        updatedData[isIndexQA].is_qa_e2 === "0"
      ) {
        updatedData[isIndexQA] = {
          ...updatedData[isIndexQA], // Keep other properties unchanged
          check_QA: true,
          qa_e2: value,
        };
      } else if (
        updatedData[isIndexQA].is_qa_e1 === "0" &&
        updatedData[isIndexQA].is_qa_e2 === "0"
      ) {
        updatedData[isIndexQA] = {
          ...updatedData[isIndexQA], // Keep other properties unchanged
          check_QA: true,
          qa_e1: value,
        };
      } else if (
        updatedData[isIndexQA].is_qa_e1 === "1" &&
        updatedData[isIndexQA].is_qa_e2 === "1"
      ) {
        return updatedData[isIndexQA].id;
      } else {
        updatedData[isIndexQA] = {
          ...updatedData[isIndexQA], // Keep other properties unchanged
          check_QA: true,
          qa_e1: value,
        };
      }
    }

    setValueBase64(updatedData);
  };

  const handleClickResetQA = (e, _index) => {
    e.stopPropagation();
    const valueChangeInput = "R";
    const updatedData = [...valueBase64];
    const arrayData = updatedData.map((item) => item.Input_e1);

    const return_data = updateArray(arrayData, _index, valueChangeInput);

    for (let i = 0; i < return_data.length; i++) {
      updatedData[i].Input_e1 = return_data[i];
    }
    if (isIndexQA >= 0 && isIndexQA < updatedData.length) {
      updatedData[isIndexQA] = {
        ...updatedData[isIndexQA], // Keep other properties unchanged
        check_QA:
          updatedData[isIndexQA].is_qa_e1 === "0" &&
            updatedData[isIndexQA].is_qa_e2 === "0"
            ? false
            : true, // Set check_QA to false
      };
    }
    setValueBase64(updatedData);
  };

  const KeyPressF1 = () => {
    document.getElementById("btn-submit").click();
  };

  const showModalQA = () => {
    setIsOpenModalQATotal(true);
  };

  useEffect(() => {
    fetchListQaValue();
    fetchListPumb();
  }, []);

  useEffect(() => {
    if (valueBase64.length !== 0) {
      const handleKeyPress = (event) => {
        if (isOpenModalQATotal !== true && isOpenModalQA !== true) {
          if (event.key === "F1") {
            event.preventDefault();
            KeyPressF1();
          }
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
  }, [valueBase64, isOpenModalQATotal, isOpenModalQA]);

  const fetchListQaValue = () => {
    authAxios()
      .get(`${localhost}/get_qa_value`, {
        params: {
          user_role: inforUser.user_role,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setListContentQA(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showValueQaE1 = () => {
    let newValue = "";
    if (Number(dataDetail.is_qa_e1) === 1) {
      if (dataDetail.Input_e1[0].includes("OTHER_")) {
        newValue = dataDetail.Input_e1[0].replace("OTHER_", "");
        return newValue;
      } else if (dataDetail.Input_e1[0].includes("QA_")) {
        newValue = dataDetail.Input_e1[0].replace("QA_", "");
        for (const element of listContentQA) {
          if (newValue === element.qa_stt) {
            newValue = element.qa_vn;
            break;
          }
        }
        return newValue;
      }
    } else {
      return "";
    }
  };
  const showValueQaE2 = () => {
    let newValue = "";
    if (Number(dataDetail.is_qa_e2) === 1) {
      if (dataDetail.Input_e2[0].includes("OTHER_")) {
        newValue = dataDetail.Input_e2[0].replace("OTHER_", "");
        return newValue;
      } else if (dataDetail.Input_e2[0].includes("QA_")) {
        newValue = dataDetail.Input_e2[0].replace("QA_", "");
        for (const element of listContentQA) {
          if (newValue === element.qa_stt) {
            newValue = element.qa_vn;
            break;
          }
        }
        return newValue;
      } else {
        return "";
      }
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

      <Row style={{ display: "flex", justifyContent: "center", width: "100%" }}>

        <span style={{ fontWeight: "bold", fontSize: 16, padding: "0% 1%", alignContent: "center" }}>Phân loại:</span> <Select
          size={"middle"}
          id="code_city"
          style={{ width: "10%" }}
          optionFilterProp="children"
          placeholder="Chọn mã máy"
          onChange={chooseModel}
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
        {valueBase64.length !== 0 && (
          <ButtonViewInforUser dataDetail={dataDetail} />
        )}
      </Row>
      <Row style={{ display: "flex", padding: "1% 0% 0% 1%" }}>
        {valueBase64.length !== 0 && (
          <>
            <Col span={6}>
              <span ><span style={{ fontWeight: "bold" }}>Nội dung QA 1:</span> {showValueQaE1()}</span>
            </Col>
            <Col span={6}>
              <span ><span style={{ fontWeight: "bold" }}>Nội dung QA 2:</span> {showValueQaE2()}</span>
            </Col>
          </>
        )}
      </Row>



      {valueBase64.length !== 0 ? (
        <>
          <div className="check_classification_container-fluid">
            <div className="check_classification_container">
              <Row gutter={16} className="check_classification_row">
                {valueBase64.length !== 0 &&
                  valueBase64.map((item, _index) => (
                    <Col span={3} key={item.id}>
                      <Card
                        hoverable
                        className="check_classification_card"
                        cover={
                          <img
                            alt="Red dot"
                            src={item.img_base64}
                            style={{ height: "18vh" }}
                          ></img>
                        }
                        data-color={!item.check_QA && item.color}
                        data-check_qa={item.check_QA}
                        onClick={() => handleClickCard(_index)}
                      >
                        {dataPumb.key !== "1" && (
                          <>
                            <span
                              style={{
                                fontWeight: 600,
                                display: "flex",
                                justifyContent: "center",
                                fontSize: 18,
                              }}
                            >
                              {getDisplayValue(item)}
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
          <div>
            <Row>
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
                <Button id="btn-submit" type="primary" onClick={onFinish}>
                  SUBMIT F1
                </Button>
              </Col>
            </Row>
          </div>
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

      <ShowModalDetailEntry
        isShowModalDetail={isShowModalDetail}
        setIsShowModalDetail={setIsShowModalDetail}
        valueSecondImgBase64={valueSecondImgBase64}
      />

      {isOpenModalQA && (
        <ModalQA
          open={isOpenModalQA}
          setIsOpenModalQA={setIsOpenModalQA}
          isIndexQA={isIndexQA}
          valueBase64={valueBase64}
          handleClickResetQA={handleClickResetQA}
          setValueBase64={setValueBase64}
          handleClickQAValue={handleClickQAValue}
          inforUser={inforUser}
        />
      )}

      {isOpenModalQATotal && (
        <ModalQATotal
          open={isOpenModalQATotal}
          setIsOpenModalQATotal={setIsOpenModalQATotal}
          onFinish={onFinish}
          valueBase64={valueBase64}
          isIndexQA={isIndexQA}
          inforUser={inforUser}
        />
      )}
    </>
  );
};

export default Check_Classification;
