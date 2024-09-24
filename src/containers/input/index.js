/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { localhost } from "../../server";
import "./InsertInformation.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { MinusOutlined } from "@ant-design/icons";
import { openNotificationSweetAlert } from "../../Function";
import SuccessIcon from "../../images/SuccessNotiIcon.svg";
import ErrorIcon from "../../images/ErrorNotifiIcon.svg";
import WarningIcon from "../../images/WarningNotiIcon.svg";
import { IconButton } from "@mui/material";
import InsertInformation from "./InsertInformation";
import { authAxios } from "../../api/axiosClient";

const InsertInformationIndex = () => {
  const [form] = Form.useForm();
  const [indexImage, setIndexImage] = useState(0);
  const [mainImageURL, setMainImageURL] = useState();
  const [thumbnailURL, setThumbnailURL] = useState([]);
  const [dataSourceInput, setDataSourceInput] = useState([]);
  const [dataSourceGrid, setDataSourceGrid] = useState([]);
  const [dataDetail, setDataDetail] = useState(undefined);
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [listDataDefault, setListDataDefault] = useState([]);
  const [listDataInput, setListDataInput] = useState([]);
  const [listDataGrid, setListDataGrid] = useState([]);
  const [currentFieldName, setCurrentFieldName] = useState(null);
  const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);
  const [lockBtnNextPage, setLockBtnNextPage] = useState(false);
  const [lockBtnPreviousPage, setLockBtnPreviousPage] = useState(true);
  const [checkBtnRotate, setCheckBtnRotate] = useState(true);
  const [rotate, setRotate] = useState(0);
  const [fieldName, setFieldName] = useState();
  const [listPumb, setListPumb] = useState([]);
  const [dataPumb, setDataPumb] = useState(undefined);
  const [checkChooseModel, setCheckChooseModel] = useState(false);
  const defaultPageSize = 10;
  const pager = {
    pageSize: defaultPageSize,
    count: 0,
    current: 1,
  };
  const [inputRows, setInputRows] = useState([{}]);
  const [openModalQA, setOpenModalQA] = useState(false);
  const positionZoom = window.screen.availWidth * 0.25;
  const [listHotKeys, setListHotKeys] = useState([]);
  const [hotKey, setHotKey] = useState([]);
  const [valueQA, setValueQA] = useState(undefined);
  const [modalShortcut, setModalShortcut] = useState(false);

  const listSymbol = ["☑", "✔", "✖", "●", "Φ"];

  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const convertToImage = (value) => {
    let arrData = [];

    for (const base64 of value.lst_thum_base64) {
      arrData.push(`data:image/webp;base64,${base64}`);
    }

    setThumbnailURL(arrData);
    setMainImageURL(`data:image/webp;base64,${value.img_base64}`);
    setLoadingImage(false);
  };

  const columnsInput = [
    {
      title: "#",
      // dataIndex: "no",
      // key: "no",
      align: "center",
      ellipsis: true,
      width: 40,
      render: (value, item, index) =>
        ((pager.current || 1) - 1) * pager.pageSize + index + 1,
    },
    {
      title: "No.",
      dataIndex: "No",
      key: "No",
      align: "center",
      ellipsis: true,
      width: 40,
    },
    {
      title: "field name",
      dataIndex: "field_name",
      key: "field_name",
      align: "center",
      ellipsis: true,
      width: 80,
    },

    {
      title: "Input",
      dataIndex: "input",
      key: "input",
      align: "center",
      ellipsis: true,
      width: 120,
      render: (text, record, index) =>
        formInsertInput(index, text, "input", record),
    },

    {
      title: "Sheet name",
      dataIndex: "sheet_name",
      key: "sheet_name",
      align: "center",
      ellipsis: true,
      width: 80,
    },
  ];

  const columns = [
    {
      title: "#",
      // dataIndex: "no",
      // key: "no",
      align: "center",
      ellipsis: true,
      width: 40,
      render: (value, item, index) =>
        ((pager.current || 1) - 1) * pager.pageSize + index + 1,
    },
    {
      title: "No.",
      dataIndex: "No",
      key: "No",
      align: "center",
      ellipsis: true,
      width: 40,
    },
    ...dataSourceGrid.map((item, index) => ({
      title: item.field_name,
      dataIndex: "",
      key: item.field_name,
      align: "center",
      ellipsis: true,
      width: 120,
      render: (text, record, indexCol) =>
        formInsert(index, text, item.field_name, record, indexCol),
    })),
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      align: "center",
      ellipsis: true,
      width: 100,
      render: (text, record, index) => (
        <>
          {inputRows.length > 1 && (
            <IconButton
              onClick={() => handleClickClearCol(index)}
              variant="outlined"
            >
              <MinusOutlined />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const handleButtonClick = () => {
    setInputRows((prevRows) => [...prevRows, {}]);
  };

  const handleClickClearCol = (index) => {
    // Clear data associated with the removed row from the input fields
    const updatedRows = [...inputRows];
    updatedRows.splice(index, 1);
    setInputRows(updatedRows); // Update inputRows state with the removed row

    const updatedFormValues = { ...form.getFieldsValue() };
    for (const key in updatedFormValues) {
      if (key.includes(`grid__${index}__`)) {
        delete updatedFormValues[key];
      }
    }
    // Cập nhật lại các key từ grid__0 đến grid__1
    const resetFormValues = {};
    let currentGroupIndex = index; // Biến đếm cho số đầu tiên trong key
    let currentIndex = 0; // Biến đếm cho số thứ hai trong key

    const arrData = Object.keys(updatedFormValues);
    arrData.forEach((key, inxUp) => {
      if (key.includes(`grid__`)) {
        const [group] = key.match(/\d+/g); // Tách số đầu tiên và số thứ hai từ key
        let intGroup = parseInt(group, 10);
        if (intGroup !== 0) {
          if (intGroup >= currentGroupIndex) {
            currentGroupIndex = intGroup;
            currentIndex = intGroup - 1; // Lấy index trong key hiện tại -1
          } else {
            currentIndex = intGroup; // Tăng index lên +1 nếu index key nhỏ hơn index xóa
          }
        }

        let newKey = key.replace(/grid__(\d+)__/g, `grid__${currentIndex}__`);
        resetFormValues[newKey] = updatedFormValues[key]; // Add giá trị cũ vào key mới
      } else {
        resetFormValues[key] = updatedFormValues[key]; // Giữ nguyên key và giá trị khác (input)
      }
    });

    form.resetFields();
    form.setFieldsValue(resetFormValues);
  };

  const formInsert = (index, text, dataIndex, record, indexCol) => {
    const isFirstInput = index === 0;

    return (
      <Form.Item
        name={`grid__${indexCol}__grid__${index}`}
        label={""}
        key={dataIndex}
        className="insert-infor"
      >
        <Input
          key={indexCol}
          id={dataIndex + indexCol}
          name="input"
          onFocus={() => {
            setCurrentFieldName(`grid__${indexCol}__grid__${index}`);
            setFieldName(dataIndex);
          }}
          onKeyDown={(e) => handleKeyPressChange(e, dataIndex, index, indexCol)}
          autoFocus={dataSourceInput.length === 0 && isFirstInput}
          autoComplete="off"
        />
      </Form.Item>
    );
  };

  const showHotKey = (index) => {
    if (listHotKeys[index] !== "") {
      if (listHotKeys[index].includes("\r\n")) {
        setHotKey(listHotKeys[index].split("\r\n"));
      } else {
        setHotKey(listHotKeys[index].split("\n"));
      }
    } else {
      setHotKey(["Không có phím tắt"]);
    }
  };

  const formInsertInput = (index, text, dataIndex, record) => {
    const isFirstInput = index === 0;
    return (
      <Form.Item
        name={`input__${index}__${dataIndex}`}
        label={""}
        key={dataIndex}
        // Phải có initalValue
        initialValue={text}
        className="insert-infor"
      >
        <Input
          type="text"
          name="input"
          id={dataIndex + index}
          onKeyDown={(e) => handleKeyPressChange(e, dataIndex, index)}
          onFocus={() => {
            setCurrentFieldName(`input__${index}__${dataIndex}`);
            setFieldName(record.input);
            showHotKey(index);
          }}
          autoFocus={isFirstInput}
          autoComplete="off"
        ></Input>
      </Form.Item>
    );
  };

  const functionSetData = (event, value) => {
    // Lấy danh sách các field trong form
    event.preventDefault();
    const fields = form.getFieldsValue();
    // Duyệt qua từng field
    Object.keys(fields).forEach((fieldKey) => {
      if (fieldKey === currentFieldName) {
        form.setFieldsValue({
          [currentFieldName]: event.target.value + value,
        });
      }
    });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (currentFieldName !== null) {
        if (event.altKey) {
          validateEventCode(event);
        } else {
          validateFieldName(event);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [form, currentFieldName, fieldName]);

  function validateEventCode(event) {
    if (event.code.slice(0, 5) === "Digit") {
      if (event.altKey && event.key === "1" && currentFieldName) {
        functionSetData(event, "☑");
      } else if (event.altKey && event.key === "2" && currentFieldName) {
        functionSetData(event, "✔");
      } else if (event.altKey && event.key === "3" && currentFieldName) {
        functionSetData(event, "✖");
      } else if (event.altKey && event.key === "4" && currentFieldName) {
        functionSetData(event, "●");
      } else if (event.altKey && event.key === "5" && currentFieldName) {
        functionSetData(event, "Φ");
      }
    }
  }

  function headMaterial(event) {
    if (event.key === "1" && event.altKey === false) {
      functionSetData(event, "PVC");
    }
    if (event.key === "2" && event.altKey === false) {
      functionSetData(event, "PVDF");
    }
    if (event.key === "3" && event.altKey === false) {
      functionSetData(event, "SUS304");
    }
    if (event.key === "4" && event.altKey === false) {
      functionSetData(event, "SUS316");
    }
  }

  function valveMaterial(event) {
    if (event.key === "1" && event.altKey === false) {
      functionSetData(event, "CE");
    }
    if (event.key === "2" && event.altKey === false) {
      functionSetData(event, "HC");
    }
  }

  function sheetMaterial(event) {
    if (event.key === "1" && event.altKey === false) {
      functionSetData(event, "PVC");
    }
    if (event.key === "2" && event.altKey === false) {
      functionSetData(event, "FKM（白）");
    }
    if (event.key === "3" && event.altKey === false) {
      functionSetData(event, "EPDM黄");
    }
    if (event.key === "4" && event.altKey === false) {
      functionSetData(event, "PVDF");
    }
    if (event.key === "5" && event.altKey === false) {
      functionSetData(event, "SUS304");
    }
    if (event.key === "6" && event.altKey === false) {
      functionSetData(event, "SUS316");
    }
  }

  function guideMaterial(event) {
    const keyMaterialMap = {
      1: "PVC",
      2: "PVDF",
      3: "SUS304",
      4: "SUS316",
    };

    if (event.altKey === false && keyMaterialMap[event.key]) {
      functionSetData(event, keyMaterialMap[event.key]);
    }
  }

  function ringMaterial(event) {
    if (event.key === "1" && event.altKey === false) {
      functionSetData(event, "FKM（白）");
    }
    if (event.key === "2" && event.altKey === false) {
      functionSetData(event, "EPDM黄");
    }
  }

  function ringMaterialConfirmation(event) {
    const keyMaterialMap = {
      1: "FKM（白）",
      2: "EPDM黄",
    };

    if (event.altKey === false && keyMaterialMap[event.key]) {
      functionSetData(event, keyMaterialMap[event.key]);
    }
  }

  function validateFieldName(event) {
    if (fieldName === "Flange/P head material") {
      headMaterial(event);
    } else if (fieldName === "Valve material") {
      valveMaterial(event);
    } else if (fieldName === "V. Sheet material") {
      sheetMaterial(event);
    } else if (fieldName === "Gasket installation confirmation") {
      if (event.key === "1" && event.altKey === false) {
        functionSetData(event, "PTFE");
      }
    } else if (fieldName === "V. Guide material") {
      guideMaterial(event);
    } else if (fieldName === "O-ring material") {
      ringMaterial(event);
    } else if (fieldName === "O-ring (P-20) material confirmation") {
      ringMaterialConfirmation(event);
    }
  }
  const [startTime, setStartTime] = useState(0);

  const fetchDataInsert = (pumbModel) => {
    setLoadingTable(true);
    const FormData = require("form-data");
    let data = new FormData();
    data.append("pumb_id", pumbModel.value);
    data.append("user_pair", inforUser.user_pair);
    data.append("user_lvl", inforUser.user_lvl);
    data.append("user_role", inforUser.user_role);
    let arrDataInput = [];
    let arrDataGrid = [];
    const startTimeClick = Date.now();

    authAxios()
      .post(`${localhost}/get_entry_info`, data)

      .then((res) => {
        setStartTime(startTimeClick);

        if (res.status === 200) {
          setCookieRemember("op_id", res.data.op_id, 1);
          setCookieRemember("op_table", res.data.op_table, 1);
          if (res.data.path_files[0].length === 1) {
            setLockBtnNextPage(true);
            setLockBtnPreviousPage(true);
          } else if (res.data.path_files[0].length === 2) {
            setLockBtnNextPage(false);
            setLockBtnPreviousPage(true);
          }

          setLoadingTable(false);
          setDataDetail(res.data);
          setCheckBtnRotate(false);
        } else {
          setCookieRemember("op_id", "", 1);
          setCookieRemember("op_table", "", 1);
          setLoadingTable(true);
          setLoadingImage(true);
          setThumbnailURL([]);
          openNotificationSweetAlert(WarningIcon, res.data.message);
        }

        setDataSourceInput(res.data.Input);
        setDataSourceGrid(res.data.Grid);

        for (const valueInput of res.data.Input) {
          arrDataInput.push({
            check_result: valueInput.check_result,
            field_name: valueInput.field_name,
            req_value: valueInput.req_value,
            mark: valueInput.mark,
            sheet_name: valueInput.sheet_name,
            type: "input",
          });
        }

        for (const valueGrid of res.data.Grid) {
          arrDataGrid.push({
            check_result: valueGrid.check_result,
            field_name: valueGrid.field_name,
            req_value: valueGrid.req_value,
            mark: valueGrid.mark,
            sheet_name: valueGrid.sheet_name,
            grid: "",
            type: "grid",
          });
        }

        const newArr = res.data.Input.map((item) => item.hotkeys);

        setListHotKeys(newArr);

        form.resetFields();
        fetchListImage(0, res.data, true);

        setListDataInput(arrDataInput);
        setListDataGrid(arrDataGrid);
        setListDataDefault(arrDataInput.concat(arrDataGrid));
        setLoadingTable(false);
        sessionStorage.setItem("current_pack", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err);
        setThumbnailURL([]);
        setListDataInput([]);
        setListDataGrid([]);
        setDataSourceInput([]);
        setDataSourceGrid([]);
        setLoadingTable(false);
      });
  };

  function ArrowDown(index, input, nameColumn, e, indexCol) {
    if (index === listDataDefault.length - 1) {
      return;
    } else {
      if (listDataInput.length > 1 && index + 2 <= listDataInput.length) {
        input = document.getElementById(nameColumn + (index + 1));
        e.preventDefault();
        input.focus();
      }
      if (inputRows.length > 1 && indexCol + 2 <= inputRows.length) {
        input = document.getElementById(nameColumn + (indexCol + 1));
        e.preventDefault();
        input.focus();
      }
    }
  }

  function ArrowRight(index, input, nameColumn, e, indexColumn) {
    if (nameColumn === "check_result" && index === listDataDefault.length - 1) {
      return;
    } else {
      switch (nameColumn) {
        case "required_value":
          nameColumn = "checksheet_ocr_value";
          break;
        case "checksheet_ocr_value":
          nameColumn = "nameplate_ocr_value";
          break;
        case "nameplate_ocr_value":
          nameColumn = "check_result";
          break;
        case "check_result":
          nameColumn = "required_value";
          indexColumn = indexColumn + 1;
          break;
        default:
      }
      input = document.getElementById(nameColumn + indexColumn);
      e.preventDefault();
      input.focus();
    }
  }

  function ArrowLeft(index, input, nameColumn, e, indexColumn) {
    if (nameColumn === "required_value" && index === 0) {
      return;
    } else {
      switch (nameColumn) {
        case "required_value":
          nameColumn = "check_result";
          indexColumn = indexColumn - 1;
          break;
        case "checksheet_ocr_value":
          nameColumn = "required_value";
          break;
        case "nameplate_ocr_value":
          nameColumn = "checksheet_ocr_value";
          break;
        case "check_result":
          nameColumn = "nameplate_ocr_value";
          break;
        default:
      }
      input = document.getElementById(nameColumn + indexColumn);
      e.preventDefault();
      input.focus();
    }
  }

  function ArrowUp(index, input, nameColumn, e, indexCol) {
    if (index >= 1) {
      input = document.getElementById(nameColumn + (index - 1));
      e.preventDefault();
      input.focus();
    }
    if (indexCol >= 1) {
      input = document.getElementById(nameColumn + (indexCol - 1));
      e.preventDefault();
      input.focus();
    }
  }

  const handleKeyPressChange = (e, dataIndex, index, indexCol) => {
    let input = document.getElementById(dataIndex + index);
    let nameColumn = dataIndex;
    let indexColumn = index;

    if (e.ctrlKey) {
      if (e.code === "ArrowDown") {
        ArrowDown(index, input, nameColumn, e, indexCol);
      } else if (e.code === "ArrowRight") {
        ArrowRight(index, input, nameColumn, e, indexColumn);
      } else if (e.code === "ArrowLeft") {
        ArrowLeft(index, input, nameColumn, e, indexColumn);
      } else if (e.code === "ArrowUp") {
        ArrowUp(index, input, nameColumn, e, indexCol);
      }
    }
  };

  function setCookieRemember(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();

    // Mã hóa dữ liệu trước khi lưu vào cookie
    const encodedValue = window.btoa(cvalue); // Mã hóa dữ liệu bằng Base64
    document.cookie = cname + "=" + encodedValue + ";" + expires + ";path=/";
  }

  const fetchListImage = (index, data, changeModel) => {
    setCheckChooseModel(changeModel);
    setLoadingImage(true);
    setIndexImage(index);
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
        setLoadingImage(false);
        convertToImage(res.data);
        setCheckChooseModel(false);
      })
      .catch((err) => {
        setLoadingImage(false);
        setCheckChooseModel(false);
      });
  };

  const returnPackage = (packageID, packageInfo) => {
    const FormData = require("form-data");
    let data = new FormData();
    if (packageID !== undefined && packageID !== null) {
      //  const data = JSON.parse(dataReturn)
      data.append("op_id", parseInt(dataDetail.op_id));
      data.append("op_table", dataDetail.op_table);
      data.append("user_pair", parseInt(inforUser.user_pair));
      data.append("user_role", inforUser.user_role);
      authAxios()
        .post(`${localhost}/return_pack_entry`, data)
        .then((res) => { })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (const c of cookieArray) {
      let trimmedC = c.trim(); // Remove leading and trailing whitespace
      if (trimmedC.startsWith(name)) {
        const encodedValue = trimmedC.substring(name.length);
        return window.atob(encodedValue); // Decode the value
      }
    }
    return "";
  }

  // F5 return
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      const dataID = getCookie("op_id");
      const dataTable = getCookie("op_table");
      if (dataID !== "" && dataID !== undefined && dataID !== null) {
        const FormData = require("form-data");
        let data = new FormData();
        data.append("op_id", parseInt(dataID));
        data.append("op_table", dataTable);
        data.append("user_pair", parseInt(inforUser.user_pair));
        data.append("user_role", inforUser.user_role);
        authAxios()
          .post(`${localhost}/return_pack_entry`, data)
          .then((res) => { })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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

  useEffect(() => {
    try {
      document.addEventListener("keydown", function (event) {
        if (listDataInput.length > 0 || listDataGrid.length > 0) {
          if (dataSourceInput.length !== 0 || dataSourceGrid.length !== 0) {
            if (event.key === "F2") {
              setModalShortcut(false);
              setOpenModalQA((prevState) => !prevState);
              event.preventDefault();
              return;
            }

            if (event.shiftKey && event.key === "+") {
              handleButtonClick();
              event.preventDefault();
            }
          }
        }
      });
    } catch {
      console.log("Lỗi");
    }
  }, [dataSourceInput.length !== 0, dataSourceGrid.length !== 0]);

  const KeyPressF1 = () => {
    if (listDataInput.length > 0 || listDataGrid.length > 0) {
      if (dataSourceInput.length !== 0 || dataSourceGrid.length !== 0) {
        if (openModalQA === true) {
          if (valueQA === undefined) {
            openNotificationSweetAlert(ErrorIcon, "Vui lòng nhập Q&A!");
          } else {
            document.getElementById("btn-submit").click();
          }
        } else if (modalShortcut === false) {
          document.getElementById("btn-submit").click();
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "F1") {
        event.preventDefault();
        KeyPressF1();
      }
      if (event.key === "Enter") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    dataSourceInput.length !== 0,
    dataSourceGrid.length !== 0,
    openModalQA,
    valueQA,
    modalShortcut,
  ]);

  useEffect(() => {
    fetchListPumb();
    try {
      document.addEventListener("keydown", function (event) {
        if (event.key === "F3") {
          event.preventDefault();
          setOpenModalQA(false);
          setModalShortcut((prevState) => !prevState);
        }
      });
    } catch {
      console.log("Lỗi");
    }
  }, []);

  const listKeyShortcuts = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

  useEffect(() => {
    if (loadingImage !== true) {
      try {
        document.addEventListener("keydown", function (event) {
          const arrNum = ["5", "6", "7", "8", "9"];
          if (event.key === "0" && event.ctrlKey) {
            document.getElementById("reset-zoom").click();
            event.preventDefault();
          } else if (event.key === "1" && event.ctrlKey) {
            document.getElementById("zoom-in1").click();
            event.preventDefault();
          } else if (event.key === "2" && event.ctrlKey) {
            document.getElementById("zoom-in2").click();
            event.preventDefault();
          } else if (event.key === "3" && event.ctrlKey) {
            document.getElementById("zoom-in3").click();
            event.preventDefault();
          } else if (event.key === "4" && event.ctrlKey) {
            document.getElementById("zoom-in4").click();
            event.preventDefault();
          } else if (arrNum.includes(event.key) && event.ctrlKey) {
            event.preventDefault();
          }
        });

        const handleKeyPress = (event) =>
          thumbnailURL.forEach((item, index) => {
            const shortcutKey = listKeyShortcuts[index];
            if (event.shiftKey && event.key === shortcutKey) {
              event.preventDefault();
              if (indexImage !== index) {
                if (index !== indexImage) {
                  return fetchListImage(index, dataDetail, false);
                }
              }
            }
          });

        document.addEventListener("keydown", handleKeyPress);

        return () => {
          document.removeEventListener("keydown", handleKeyPress);
        };
      } catch {
        console.log("Lỗi");
      }
    }
  }, [loadingImage]);

  const onFinish = (values) => {
    let arrDataInput = [];
    let arrDataGrid = [];
    let listPushDataGrid = [];
    const endTime = Date.now();
    const duration = endTime - startTime;

    Object.keys(values)
      .filter((key) => key !== "qa_content")
      .forEach((item) => {
        let arr_key = item.split("__");
        if (arr_key[0] === "input") {
          listDataInput[arr_key[1]][arr_key[2]] = values[item];
        } else {
          listPushDataGrid.push(values[item] === undefined ? "" : values[item]);
        }
      });
    const allEmpty = listPushDataGrid.every((item) => item === "");
    const test1 = allEmpty ? "†".repeat(listPushDataGrid.length) : "";
    const list_new = listPushDataGrid.join("†");
    let listData = listDataInput.concat(listDataGrid);
    setListDataDefault(listData);

    for (let i = 0; i < listDataInput.length; i++) {
      arrDataInput.push({
        check_result: listData[i].check_result,
        field_name: listData[i].field_name,
        req_value: listData[i].req_value,
        result:
          listDataInput[i].input === undefined ? "" : listDataInput[i].input,
        mark: listData[i].mark,
        sheet_name: listData[i].sheet_name,
      });
    }

    for (const valueDataGrid of listDataGrid) {
      arrDataGrid.push({
        field_name: valueDataGrid.field_name,
        result: test1 === "" ? list_new : test1,
        mark: valueDataGrid.mark,
        sheet_name: valueDataGrid.sheet_name,
      });
    }

    setLoadingBtnSubmit(false);

    authAxios()
      .post(`${localhost}/submit_entry`, {
        user_Id: parseInt(inforUser.user_id),
        msnv_e: inforUser.user_msnv,
        user_lvl: parseInt(inforUser.user_lvl),
        user_pair: parseInt(inforUser.user_pair),
        qa_content: valueQA === undefined ? "" : valueQA,
        op_id: parseInt(dataDetail.op_id),
        op_table: dataDetail.op_table,
        pack_id: dataDetail.pack_id,
        pack_table: dataDetail.pack_table,
        Input: arrDataInput,
        Grid: arrDataGrid,
        pumb_id: dataPumb.value,
        is_multi: dataPumb.is_multi,
        total_time: duration,
        user_role: inforUser.user_role,
        from_pack_id: dataDetail.from_pack_id,
        is_checksheet: dataDetail.is_checksheet,
      })
      .then((res) => {
        setLoadingBtnSubmit(false);
        openNotificationSweetAlert(SuccessIcon, res.data.message);
        form.resetFields();
        fetchDataInsert(dataPumb);
        setOpenModalQA(false);
        setInputRows([{}]);
        setValueQA(undefined);
        setStartTime(0);
      })
      .catch((err) => {
        openNotificationSweetAlert(ErrorIcon, err.response.data.message);
        setLoadingBtnSubmit(false);
        setOpenModalQA(false);
      });
  };

  const changeMainImage = (index) => {
    if (index !== indexImage) {
      fetchListImage(index, dataDetail, false);
    }
  };

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

  const chooseModel = (value, data) => {
    if (dataDetail !== undefined) {
      returnPackage(dataDetail.pack_id, dataDetail.pack_info);
    }
    const filterPumb = listPumb.filter((e) => e.pumb_id === data.key);
    sessionStorage.setItem("OptionMachine", JSON.stringify(filterPumb));

    setIndexImage(0);
    setDataPumb(data);
    fetchDataInsert(data);
  };

  const nextImage = () => {
    fetchListImage(indexImage + 1, dataDetail, false);
    setIndexImage(indexImage + 1);
  };

  const previousImage = () => {
    fetchListImage(indexImage - 1, dataDetail, false);
    setIndexImage(indexImage - 1);
  };

  const screenHeight = window.innerHeight;

  const dynamicHeightInput =
    dataSourceGrid.length === 0 ? screenHeight - 300 : screenHeight - 645;

  const dynamicHeightGrid =
    dataSourceInput.length === 0 ? screenHeight - 310 : screenHeight - 620;

  const shouldDisplayRow =
    dataSourceInput.length !== 0 || dataSourceGrid.length !== 0;

  const handleOpenModalQA = () => {
    setOpenModalQA(true);
  };

  const handleSubmitModalQA = () => {
    const mainFormValues = form.getFieldsValue();
    if (valueQA === undefined || valueQA.length === 0) {
      openNotificationSweetAlert(ErrorIcon, "Vui lòng nhập Q&A!");
    } else {
      onFinish(mainFormValues);
    }
  };

  const handleChangeModalQA = (e) => {
    setValueQA(e.target.value);
  };

  const handleCloseModalQA = () => {
    setOpenModalQA(false);
  };

  const handleCloseModalShortcut = () => {
    setModalShortcut(false);
  };

  return (
    <InsertInformation
      shouldDisplayRow={shouldDisplayRow}
      checkBtnRotate={checkBtnRotate}
      setRotate={setRotate}
      rotate={rotate}
      mainImageURL={mainImageURL}
      thumbnailURL={thumbnailURL}
      nextImage={nextImage}
      lockBtnNextPage={lockBtnNextPage}
      previousImage={previousImage}
      lockBtnPreviousPage={lockBtnPreviousPage}
      loadingImage={loadingImage}
      positionZoom={positionZoom}
      loadingTable={loadingTable}
      checkChooseModel={checkChooseModel}
      changeMainImage={changeMainImage}
      indexImage={indexImage}
      chooseModel={chooseModel}
      listPumb={listPumb}
      dataDetail={dataDetail}
      form={form}
      onFinish={onFinish}
      dataSourceInput={dataSourceInput}
      columnsInput={columnsInput}
      dynamicHeightInput={dynamicHeightInput}
      hotKey={hotKey}
      dataSourceGrid={dataSourceGrid}
      handleButtonClick={handleButtonClick}
      columns={columns}
      inputRows={inputRows}
      dynamicHeightGrid={dynamicHeightGrid}
      listSymbol={listSymbol}
      handleOpenModalQA={handleOpenModalQA}
      loadingBtnSubmit={loadingBtnSubmit}
      openModalQA={openModalQA}
      handleCloseModalQA={handleCloseModalQA}
      handleSubmitModalQA={handleSubmitModalQA}
      handleChangeModalQA={handleChangeModalQA}
      valueQA={valueQA}
      modalShortcut={modalShortcut}
      handleCloseModalShortcut={handleCloseModalShortcut}
    />
  );
};

export default InsertInformationIndex;
