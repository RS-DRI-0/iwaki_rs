import { Button, Col, Form, Input, Row, Select, Table, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { localhost } from "../../server";

import "./InsertInformationCheck.css";

import SuccessIcon from "../../images/SuccessNotiIcon.svg";
import ErrorIcon from "../../images/ErrorNotifiIcon.svg";
import WarningIcon from "../../images/WarningNotiIcon.svg";

import { MinusOutlined } from "@ant-design/icons";
import { openNotificationSweetAlert } from "../../Function";

import { IconButton } from "@mui/material";
import ModalShortcut from "../input/ModalShortcut";
import ModalCheckQA from "./modal/ModalCheckQA";
import ButtonViewInforUser from "./button/ButtonViewInforUser";
import ImageCheck from "./show_image/ImageCheck";
import { authAxios } from "../../api/axiosClient";

const { Option } = Select;

const InsertInformationCheck = () => {
  const [form] = Form.useForm();
  const [formGrid] = Form.useForm();
  const [dataDetail, setDataDetail] = useState();
  const [loadingTable, setLoadingTable] = useState(false);
  const [listDataGrid, setListDataGrid] = useState([]);
  const [currentFieldName, setCurrentFieldName] = useState(null);
  const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);
  const [listPumb, setListPumb] = useState([]);
  const [dataPumb, setDataPumb] = useState();

  const [hotKey, setHotKey] = useState([]);

  const [dataGridUser1, setDataGridUser1] = useState([]);
  const [dataGridUser2, setDataGridUser2] = useState([]);
  const [dataInputUser1, setDataInputUser1] = useState([]);
  const [dataInputUser2, setDataInputUser2] = useState([]);

  const [dataQAuser1, setDataQAuser1] = useState("");
  const [dataQAuser2, setDataQAuser2] = useState("");

  const [indexInput, setIndexInput] = useState("");
  const [indexGrid, setIndexGrid] = useState("");
  const [indexGridCol, setIndexGridCol] = useState("");

  const [dataGridSubmit, setDataGridSubmit] = useState([]);

  const [dataChange, setDataChange] = useState("");
  const [listHotKeys, setListHotKeys] = useState([]);
  const [modalShortcut, setModalShortcut] = useState(false);
  const [isOpenModalCheckQA, setIsOpenModalCheckQA] = useState(false);

  const [listCheckColor, setListCheckColor] = useState([]);
  const [listCheckColorGrid, setListCheckColorGrid] = useState([]);

  const [inputRows, setInputRows] = useState([]);
  const [pumpType, setPumpType] = useState();
  const [isLengthIndexCol, setIsLengthIndexCol] = useState(0);

  const listSymbol = ["☑", "✔", "✖", "●", "Φ"];
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const [dataGridOld1, setDataGridOld1] = useState([]);
  const [dataGridOld2, setDataGridOld2] = useState([]);
  const [dataInputOld1, setDataInputOld1] = useState([]);
  const [dataInputOld2, setDataInputOld2] = useState([]);
  const [dataUserID1, setDataUserID1] = useState("");
  const [dataUserID2, setDataUserID2] = useState("");
  const [valueChangeDataResult, setValueChangeDataResult] = useState(undefined);

  const columnsInput = [
    {
      title: "#",
      align: "center",
      ellipsis: true,
      width: 30,
      render: (value, item, index) => index + 1,
    },
    {
      title: "No.",
      dataIndex: "No",
      key: "No",
      align: "center",
      ellipsis: true,
      width: 30,
    },
    {
      title: "field name",
      dataIndex: "field_name",
      key: "field_name",
      align: "center",
      ellipsis: true,
      width: 120,
      render: (text, record, index) => (
        <span style={{ color: listCheckColor[index] === 1 ? "red" : "black" }}>
          {text}
        </span>
      ),
    },

    {
      title: "Input",
      dataIndex: "result",
      key: "result",
      align: "center",
      ellipsis: true,
      width: 140,
      render: (text, record, index) =>
        formInsertInput(
          index,
          MainFunction(
            dataInputUser1[index].result,
            dataInputUser2[index].result,
            index
          ),
          "result"
        ),
    },

    {
      title: "Sheet name",
      dataIndex: "sheet_name",
      key: "sheet_name",
      align: "center",
      ellipsis: true,
      width: 90,
      render: (text, record, index) => text,
    },
  ];

  const columns = [
    {
      title: "#",
      align: "center",
      ellipsis: true,
      width: 40,
      render: (value, item, index) => index + 1,
    },
    {
      title: "No.",
      dataIndex: "No",
      key: "No",
      align: "center",
      ellipsis: true,
      width: 40,
    },
    ...dataGridUser1.map((item, index) => ({
      title: item.field_name,
      dataIndex: "",
      key: item.field_name,
      align: "center",
      ellipsis: true,
      width: 120,
      render: (text, record, indexCol) => {
        const rowIndex = index; // row index
        const colIndex = indexCol; // column index
        const valueGrid1 = dataGridUser1[index].result.split("†");
        const valueGrid2 = dataGridUser2[index].result.split("†");
        return formInsert(
          rowIndex,
          item.field_name,
          record,
          colIndex,
          MainFunctionGrid(
            valueGrid1[colIndex],
            valueGrid2[colIndex],
            rowIndex
          ),
          "result"
        );
      },
    })),
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      align: "center",
      ellipsis: true,
      width: 100,
      render: (text, record, index) => (
        <IconButton
          onClick={() => handleClickClearCol(index)}
          variant="outlined"
        >
          <MinusOutlined />
        </IconButton>
      ),
    },
  ];

  const handleClickClearCol = (index) => {
    // Clear data associated with the removed row from the input fields
    const updatedRows = [...inputRows];
    updatedRows.splice(index, 1);
    setInputRows(updatedRows); // Update inputRows state with the removed row

    const updatedFormValues = { ...formGrid.getFieldsValue() };
    for (const key in updatedFormValues) {
      if (key.includes(`grid__${index}__`)) {
        delete updatedFormValues[key];
      }
    }

    const resetFormValues = {};

    if (dataGridSubmit.length === 0) {
      const newDataGrid = dataGridUser1.map((item) => {
        const valueGrid1 = item.result.split("†");

        const newList = [...valueGrid1];

        // Loại bỏ phần tử tại chỉ số đã biết
        newList.splice(index, 1);
        return {
          ...item, // Spread the original object properties
          result: newList.join("†"), // Update the result with the sliced list
        };
      });
      const newDataGrid2 = dataGridUser2.map((item) => {
        const valueGrid1 = item.result.split("†");

        const newList = [...valueGrid1];

        // Loại bỏ phần tử tại chỉ số đã biết
        newList.splice(index, 1);
        return {
          ...item, // Spread the original object properties
          result: newList.join("†"), // Update the result with the sliced list
        };
      });
      setDataGridUser1(newDataGrid);
      setDataGridUser2(newDataGrid2);
    } else {
      const newDataGrid = dataGridSubmit.map((item) => {
        const valueGrid1 = item.result;

        const newList = [...valueGrid1];
        newList.splice(index, 1);
        return {
          ...item, // Spread the original object properties
          result: newList.join("†"), // Update the result with the sliced list
        };
      });
      setDataGridUser1(newDataGrid);
    }

    formGrid.resetFields();
    formGrid.setFieldsValue(resetFormValues);
  };

  const handleChangeDataResultGrid = (value, fieldName, index, event) => {
    setValueChangeDataResult(value.target.outerText);

    let arrDataGrid = [];
    let arr_key = fieldName.split("__");
    setIndexChangeValueGrid(arr_key);
    for (const valueGrid of dataGridUser1) {
      const valueGrid1 = valueGrid.result.split("†");

      arrDataGrid.push({
        check_result: valueGrid.check_result,
        field_name: valueGrid.field_name,
        mark: valueGrid.mark,
        sheet_name: valueGrid.sheet_name,
        result: valueGrid1,
        hotkeys: valueGrid.hotkeys,
        grid: "",
        type: "grid",
      });
    }
    const newData = [...arrDataGrid];
    const originalList = arrDataGrid[arr_key[3]].result;
    const newList = [...originalList];
    newList[arr_key[1]] = value.target.outerText;

    if (newData[arr_key[3]] && newData[arr_key[3]].result) {
      newData[arr_key[3]].result = newList;
      const newDataGrid = newData.map((item) => {
        return {
          ...item, // Spread the original object properties
          result: item.result.join("†"), // Update the result with the sliced list
        };
      });

      const updatedFormValues = { ...formGrid.getFieldsValue() };

      const hasGrid7Data = Object.keys(updatedFormValues).includes(fieldName);

      if (hasGrid7Data) {
        const grid7Data = updatedFormValues[fieldName];
        if (grid7Data !== undefined) {
          formGrid.resetFields();
          setDataGridUser1(newDataGrid);
        } else {
          setDataGridUser1(newDataGrid);
          let arr1 = newDataGrid[0].result.split("†");

          const newDataGrid2 = dataGridUser2.map((item) => {
            let result = item.result.split("†"); // Clone the result array
            if (arr1.length > result.length) {
              while (result.length < isLengthIndexCol) {
                result.push(""); // Add empty strings until the desired length is reached
              }
            }

            return {
              ...item,
              result: result.map((value) => value.replace(/,/g, "†")).join("†"),
            };
          });
          formGrid.resetFields();

          setDataGridUser2(newDataGrid2);
        }
      } else {
        console.log("grid__7__grid__0 does not exist");
      }
    }
  };

  useEffect(() => {
    if (valueChangeDataResult !== undefined) {
      const input = document.getElementById(
        `grid__${indexChangeValueGrid[1]}__${indexChangeValueGrid[3]}`
      );
      input.focus();
    }
  }, [valueChangeDataResult]);

  const formInsert = (
    index,
    dataIndex,
    record,
    indexCol,
    valueCheck,
    dataValueResult
  ) => {
    setIsLengthIndexCol(indexCol + 1);

    return (
      <div>
        <Form.Item
          name={`grid__${indexCol}__grid__${index}`}
          label={""}
          key={dataIndex}
          // Phải có initalValue
          initialValue={valueCheck}
          // initialValue={inputValues["data_add" + index + dataIndex] || ''}
          className="insert-infor"
        >
          <div
            key={indexCol}
            // id={dataIndex + "_" + indexCol}
            id={`grid__${indexCol}__${index}`}
            ref={(el) =>
              gridRefs.current !== null
                ? (gridRefs.current[indexCol] = el)
                : null
            } // Lưu tham chiếu vào mảng ref
            contentEditable={true}
            placeholder="Nhập giá trị"
            suppressContentEditableWarning={true}
            onInput={(e) =>
              handleChangeDataResultGrid(
                e,
                `grid__${indexCol}__grid__${index}`,
                index
              )
            }
            onFocus={() => {
              setCurrentFieldName(`grid__${indexCol}__grid__${index}`);
            }}
            onKeyDown={(e) =>
              handleKeyPressChangeGrid(e, "grid", indexCol, index)
            }
            onMouseDown={(e) =>
              e.button === 2
                ? ExChangeValueGrid(
                  index,
                  valueCheck,
                  dataValueResult,
                  record,
                  indexCol
                )
                : setIndexGrid("")
            }
            style={{
              border: "1px solid #d9d9d9",
              textAlign: "left",
            }}
            className="btn-like-antd"
          >
            {valueCheck}
          </div>
        </Form.Item>
      </div>
    );
  };

  useEffect(() => {
    if (dataGridUser1.length !== 0 && dataGridUser2.length !== 0) {
      const length1 = dataGridUser1[0].result.split("†").length;
      const length2 = dataGridUser2[0].result.split("†").length;
      if (length1 > length2) {
        for (let i = 0; i < length1; i++) {
          setInputRows((prevRows) => [...prevRows, {}]);
        }
      } else {
        for (let i = 0; i < length2; i++) {
          setInputRows((prevRows) => [...prevRows, {}]);
        }
      }
    }
  }, [listDataGrid]);

  const showHotKey = (index, dataIndex) => {
    setCurrentFieldName(`input__${index}__${dataIndex}`);
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

  const BackTrack = (str1, str2, i, j) => {
    try {
      const c = LCS(str1, str2);
      if (i === 0 || j === 0) return "";
      if (str1[i - 1] === str2[j - 1]) {
        return BackTrack(str1, str2, i - 1, j - 1) + (i - 1);
      } else if (c[i - 1][j] > c[i][j - 1]) {
        return BackTrack(str1, str2, i - 1, j);
      } else {
        return BackTrack(str1, str2, i, j - 1);
      }
    } catch {
      console.log("Lỗi");
    }
  };

  const MainFunction = (s1, s2, index) => {
    try {
      // debugger

      const indexCorrect = BackTrack(s1, s2, s1.length, s2.length).split("");
      return highlightLetter(s1, indexCorrect, index);
    } catch (err) {
      console.log(err);
    }
  };

  const LCS = (s1, s2) => {
    const c = [];
    for (let i = 0; i <= s1.length; i++) {
      c[i] = [];
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0 || j === 0) {
          c[i][j] = 0;
        } else if (s1[i - 1] === s2[j - 1]) {
          c[i][j] = c[i - 1][j - 1] + 1;
        } else {
          c[i][j] = Math.max(c[i - 1][j], c[i][j - 1]);
        }
      }
    }
    return c;
  };

  const highlightLetter = (s1, indexCorrect, indexCheck) => {
    try {
      if (listCheckColor[indexCheck] === 1) {
        // không fix sonar ở đây

        return s1.split("").map((char, index) => {
          if (!indexCorrect.includes(index.toString())) {
            return (
              <span key={index} style={{ color: "red" }}>
                {char}
              </span>
            );
          } else {
            return (
              <span key={index} style={{ color: "black" }}>
                {char}
              </span>
            );
          }
        });
      } else {
        return s1.split("").map((char, index) => {
          return (
            <span key={index} style={{ color: "black" }}>
              {char}
            </span>
          );
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const BackTrackGrid = (str1, str2, i, j) => {
    try {
      const c = LCSGrid(str1, str2);
      if (i === 0 || j === 0) return "";
      if (str1[i - 1] === str2[j - 1]) {
        return BackTrackGrid(str1, str2, i - 1, j - 1) + (i - 1);
      } else if (c[i - 1][j] > c[i][j - 1]) {
        return BackTrackGrid(str1, str2, i - 1, j);
      } else {
        return BackTrackGrid(str1, str2, i, j - 1);
      }
    } catch {
      console.log("Lỗi");
    }
  };

  const MainFunctionGrid = (s1, s2, index) => {
    try {
      if (s1 !== undefined && s2 !== undefined) {
        const indexCorrect = BackTrackGrid(s1, s2, s1.length, s2.length).split(
          ""
        );
        return highlightLetterGrid(s1, indexCorrect, index);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const LCSGrid = (s1, s2) => {
    const c = [];
    for (let i = 0; i <= s1.length; i++) {
      c[i] = [];
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0 || j === 0) {
          c[i][j] = 0;
        } else if (s1[i - 1] === s2[j - 1]) {
          c[i][j] = c[i - 1][j - 1] + 1;
        } else {
          c[i][j] = Math.max(c[i - 1][j], c[i][j - 1]);
        }
      }
    }
    return c;
  };

  const highlightLetterGrid = (s1, indexCorrect, indexCheck) => {
    try {
      if (listCheckColorGrid[indexCheck] === 1) {
        // không fix sonar ở đây
        return s1.split("").map((char, index) => {
          if (!indexCorrect.includes(index.toString())) {
            return (
              <span key={index} style={{ color: "red" }}>
                {char}
              </span>
            );
          } else {
            return (
              <span key={index} style={{ color: "black" }}>
                {char}
              </span>
            );
          }
        });
      } else {
        return s1.split("").map((char, index) => {
          return (
            <span key={index} style={{ color: "black" }}>
              {char}
            </span>
          );
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ExChangeValue = (index) => {
    setIndexInput(index);
  };

  const ExChangeValueGrid = (
    index,
    valueCheck,
    dataValueResult,
    record,
    indexCol
  ) => {
    setIndexGrid(index);
    setIndexGridCol(indexCol);
  };

  // Click right mouse
  useEffect(() => {
    try {
      if (indexInput !== "") {
        const inputFocus = document.getElementById(`input_${indexInput}`);
        const handleContextMenu = (event) => {
          event.preventDefault();
          if (listCheckColor[indexInput] === 1) {
            setIndexChangeValue("");

            const updatedDataUser1 = dataCloneInput.map((data, newIndex) => {
              if (newIndex == indexInput) {
                return { ...data, result: dataInputUser2[newIndex].result };
              }
              return data;
            });
            const updatedDataUser2 = dataInputUser2.map((data, newIndex) => {
              if (newIndex == indexInput) {
                return { ...data, result: dataCloneInput[newIndex].result };
              }
              return data;
            });
            form.resetFields();
            setDataInputUser1(updatedDataUser1);
            setDataCloneInput(updatedDataUser1);
            setDataInputUser2(updatedDataUser2);
          }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        inputFocus.focus();
        return () => {
          setIndexInput("");
          document.removeEventListener("contextmenu", handleContextMenu);
        };
      }
    } catch (err) {
      console.log(err);
    }
  }, [indexInput, dataInputUser1, dataInputUser2]); // Include dependencies if needed

  useEffect(() => {
    try {
      if (indexGrid !== "") {
        const inputFocus = document.getElementById(
          `grid__${indexGridCol}__${indexGrid}`
        );
        const handleContextMenuGrid = (event) => {
          event.preventDefault();
          formGrid.resetFields();
          if (listCheckColorGrid[indexGrid] === 1) {
            setIndexChangeValueGrid("");
            const updatedDataUser1 = dataGridUser1.map((data, newIndex) => {
              if (newIndex == indexGrid) {
                let result_new = data.result.split("†");
                let arr_result_2 = dataGridUser2[newIndex].result.split("†");
                arr_result_2.map((item2, index2) => {
                  if (index2 === indexGridCol) {
                    result_new[indexGridCol] = item2;
                    return true;
                  }
                });
                return { ...data, result: result_new.join("†") };
              }
              return data;
            });
            const updatedDataUser2 = dataGridUser2.map((data, newIndex) => {
              if (newIndex == indexGrid) {
                let result_new = data.result.split("†");
                let arr_result_1 = dataGridUser1[newIndex].result.split("†");
                arr_result_1.map((item1, index1) => {
                  if (index1 === indexGridCol) {
                    result_new[indexGridCol] = item1;
                    return true;
                  }
                });
                return { ...data, result: result_new.join("†") };
              }
              return data;
            });
            setDataGridUser1(updatedDataUser1);
            setDataGridUser2(updatedDataUser2);
          }
        };

        document.addEventListener("contextmenu", handleContextMenuGrid);
        inputFocus.focus();

        return () => {
          setIndexGrid("");
          document.removeEventListener("contextmenu", handleContextMenuGrid);
        };
      }
    } catch {
      console.log("Error click right mouse");
    }
  }, [indexGrid, dataGridUser1, dataGridUser2]); // Include dependencies if needed

  const inputRefs = useRef([]);
  const gridRefs = useRef([]);

  function setCaretToEnd(element) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Hàm tập trung vào một trường nhập liệu cụ thể
  const focusInput = (index) => {
    try {
      if (inputRefs.current[index]) {
        inputRefs.current[index].focus();
      }
    } catch {
      console.error("Lỗi");
    }
  };

  useEffect(() => {
    if (!loadingTable) {
      focusInput(0);
    }
  }, [loadingTable]);

  const focusGrid = (index) => {
    try {
      if (gridRefs.current[index]) {
        gridRefs.current[index].focus();
      }
    } catch {
      console.error("Lỗi");
    }
  };

  useEffect(() => {
    if (!loadingTable) {
      focusGrid(0);
    }
  }, [loadingTable]);
  const formInsertInput = (index, text, dataIndex) => {
    return (
      <Form.Item
        name={`input__${index}__${dataIndex}`}
        label={""}
        key={dataIndex}
        // Phải có initalValue
        // initialValue={text}
        className="insert-infor"
      >
        <div
          id={`input_${index}`}
          ref={(el) =>
            inputRefs.current !== null ? (inputRefs.current[index] = el) : null
          } // Lưu tham chiếu vào mảng ref
          contentEditable={true}
          // onBlur={() => setIndexInput("")} // Xử lý sự kiện khi mất focus khỏi thẻ
          placeholder="Nhập giá trị"
          suppressContentEditableWarning={true}
          onInput={(e) =>
            handleChangeDataResult(e, `input__${index}__${dataIndex}`, index)
          }
          onFocus={() => {
            showHotKey(index, dataIndex);
          }}
          onKeyDown={(e) => handleKeyPressChange(e, "input", index)}
          onMouseDown={(e) => {
            if (e.button === 2) {
              ExChangeValue(index);
            }
          }}
          style={{
            border: "1px solid #d9d9d9",
            textAlign: "left",
          }}
          className="btn-like-antd"
        >
          {text}
        </div>
      </Form.Item>
    );
  };

  // Hàm Input

  const [indexChangeValue, setIndexChangeValue] = useState("");
  const [indexChangeValueGrid, setIndexChangeValueGrid] = useState("");

  // Hàm phím tắt Alt + number

  const [dataCloneInput, setDataCloneInput] = useState([]);
  const functionSetData = (event, value, fieldName) => {
    try {
      const index = fieldName.split("__")[1];
      const fields = form.getFieldsValue();

      const newData = dataCloneInput;

      const updatedDataUser1 = newData.map((data, newIndex) => {
        if (newIndex === parseInt(index)) {
          return { ...data, result: data.result + "" + value };
        }
        return data;
      });
      form.resetFields();

      Object.keys(fields).forEach((fieldKey, index) => {
        if (fieldKey.includes("input")) {
          if (fieldKey === fieldName) {
            form.setFieldValue(fieldName, [updatedDataUser1[index].result]);
          } else {
            form.setFieldValue(`input__${index}__result`, [
              updatedDataUser1[index].result,
            ]);
          }
        }
      });

      setIndexChangeValue(index);
      setDataInputUser1(updatedDataUser1);
      setDataCloneInput(updatedDataUser1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeDataResult = (event, fieldName, index) => {
    try {
      const fields = form.getFieldsValue();
      const newData = dataInputUser1;

      const updatedData = dataCloneInput.map((data, newIndex) => {
        if (newIndex === parseInt(index)) {
          return {
            ...data,
            result: event.target.innerText,
          };
        } else {
          return data;
        }
      });

      Object.keys(fields).forEach((fieldKey, index) => {
        if (fieldKey === fieldName) {
          form.setFieldValue(fieldName, [newData[index].result]);
        } else {
          form.setFieldValue(fieldKey, [newData[index].result]);
        }
      });

      setDataCloneInput(updatedData);
    } catch (err) {
      console.log(err);
    }
  };

  const functionSetDataGrid = (event, value, fieldName) => {
    try {
      const index = fieldName.split("__");
      setIndexChangeValueGrid(index);

      formGrid.resetFields();
      let arrDataGrid = [];
      for (const valueGrid of dataGridUser1) {
        const valueGrid1 = valueGrid.result.split("†");

        arrDataGrid.push({
          check_result: valueGrid.check_result,
          field_name: valueGrid.field_name,
          mark: valueGrid.mark,
          sheet_name: valueGrid.sheet_name,
          result: valueGrid1,
          hotkeys: valueGrid.hotkeys,
          grid: "",
          type: "grid",
        });
      }
      const newData = [...arrDataGrid];
      let arr_key = fieldName.split("__");
      const originalList = arrDataGrid[arr_key[3]].result;
      const newList = [...originalList];
      newList[arr_key[1]] = event.target.outerText + value;
      if (newData[arr_key[3]] && newData[arr_key[3]].result) {
        newData[arr_key[3]].result = newList;

        const newDataGrid = newData.map((item) => {
          return {
            ...item, // Spread the original object properties
            result: item.result.join("†"), // Update the result with the sliced list
          };
        });

        const updatedFormValues = { ...formGrid.getFieldsValue() };

        const hasGrid7Data = Object.keys(updatedFormValues).includes(fieldName);

        if (hasGrid7Data) {
          const grid7Data = updatedFormValues[fieldName];
          if (grid7Data !== undefined) {
            formGrid.resetFields();
            setDataGridUser1(newDataGrid);
          } else {
            setDataGridUser1(newDataGrid);
            let arr1 = newDataGrid[0].result.split("†");

            const newDataGrid2 = dataGridUser2.map((item) => {
              let result = item.result.split("†"); // Clone the result array
              // console.log(result.split("†"), isLengthIndexCol);
              if (arr1.length > result.length) {
                while (result.length < isLengthIndexCol) {
                  result.push(""); // Add empty strings until the desired length is reached
                }
              }

              return {
                ...item,
                result: result
                  .map((value) => value.replace(/,/g, "†"))
                  .join("†"),
              };
            });
            formGrid.resetFields();

            setDataGridUser2(newDataGrid2);
          }
        } else {
          console.log("grid__7__grid__0 does not exist");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    try {
      if (indexChangeValueGrid !== "") {
        const input = document.getElementById(
          `grid__${indexChangeValueGrid[1]}__${indexChangeValueGrid[3]}`
        );
        input.focus();
        const updatedDataInputSubmit = dataGridSubmit.map((data, newIndex) => {
          if (newIndex === parseInt(indexChangeValueGrid[0])) {
            return { ...data, result: dataGridUser1[newIndex].result };
          }
          return data;
        });

        setCaretToEnd(input);
        setDataGridSubmit(updatedDataInputSubmit);
      }
    } catch (err) {
      console.log(err);
    }
  }, [dataGridUser1]);

  useEffect(() => {
    try {
      if (indexChangeValue !== "") {
        const input = document.getElementById(`input_${indexChangeValue}`);
        input.focus();
        setCaretToEnd(input);
      }
    } catch (err) {
      console.log(err);
    }
  }, [dataInputUser1]);

  const [startTime, setStartTime] = useState(0);

  const fetchDataInsert = (pumbModel) => {
    setLoadingTable(true);
    const FormData = require("form-data");
    let data = new FormData();
    data.append("pumb_id", pumbModel.value);
    data.append("user_lvl", inforUser.user_lvl);
    data.append("user_role", inforUser.user_role);
    let arrDataGrid = [];
    const startTimeClick = Date.now();

    authAxios()
      .post(`${localhost}/get_check_info`, data)

      .then((res) => {
        setStartTime(startTimeClick);
        sessionStorage.setItem("current_pack", JSON.stringify(res.data));

        if (res.status === 200) {
          setCookieRemember("op_id", res.data.op_id, 1);
          setCookieRemember("op_table", res.data.op_table, 1);

          setLoadingTable(false);
          setDataDetail(res.data);
        } else {
          setCookieRemember("op_id", "", 1);
          setCookieRemember("op_table", "", 1);
          setLoadingTable(true);
          setDataDetail();
          openNotificationSweetAlert(WarningIcon, res.data.message);
        }

        setDataQAuser1(res.data.e1_qa);
        setDataQAuser2(res.data.e2_qa);

        setDataInputUser1(res.data.Input_e1);
        setDataCloneInput(res.data.Input_e1);
        setDataInputUser2(res.data.Input_e2);

        setDataGridOld1(res.data.Grid_e1);
        setDataGridOld2(res.data.Grid_e2);

        setDataInputOld1(res.data.Input_e1);
        setDataInputOld2(res.data.Input_e2);

        setDataUserID1(res.data.e1_user);
        setDataUserID2(res.data.e2_user);

        let arrColor = [];

        for (let i = 0; i < res.data.Input_e1.length; i++) {
          if (res.data.Input_e1[i].result === res.data.Input_e2[i].result) {
            arrColor.push(0);
          } else {
            arrColor.push(1);
          }
        }
        setListCheckColor(arrColor);

        const newArr = res.data.Input_e1.map((item) => item.hotkeys);

        setListHotKeys(newArr);
        for (const valueGrid of res.data.Grid_e1) {
          const valueGrid1 = valueGrid.result.split("†");

          arrDataGrid.push({
            check_result: valueGrid.check_result,
            field_name: valueGrid.field_name,
            mark: valueGrid.mark,
            sheet_name: valueGrid.sheet_name,
            result: valueGrid1,
            hotkeys: valueGrid.hotkeys,
            grid: "",
            type: "grid",
          });
        }
        const maxLengthData1 = Math.max(
          ...res.data.Grid_e1.map((item) => item.result.split("†").length)
        );
        const maxLengthData2 = Math.max(
          ...res.data.Grid_e2.map((item) => item.result.split("†").length)
        );

        if (maxLengthData1 > maxLengthData2) {
          const processedData = res.data.Grid_e2.map((item) => {
            const resultList = item.result.split("†");
            const paddingLength = maxLengthData1 - resultList.length;
            return {
              ...item,
              result: [...resultList, ...Array(paddingLength).fill("")].join(
                "†"
              ),
            };
          });
          setDataGridUser2(processedData);
          setDataGridUser1(res.data.Grid_e1);
        } else if (maxLengthData1 < maxLengthData2) {
          const processedData = res.data.Grid_e1.map((item) => {
            const resultList = item.result.split("†");
            const paddingLength = maxLengthData2 - resultList.length;
            return {
              ...item,
              result: [...resultList, ...Array(paddingLength).fill("")].join(
                "†"
              ),
            };
          });
          setDataGridUser2(res.data.Grid_e2);
          setDataGridUser1(processedData);
        } else {
          setDataGridUser1(res.data.Grid_e1);
          setDataGridUser2(res.data.Grid_e2);
        }

        let arrColorGrid = [];

        for (let i = 0; i < res.data.Grid_e1.length; i++) {
          if (res.data.Grid_e1[i].result === res.data.Grid_e2[i].result) {
            arrColorGrid.push(0);
          } else {
            arrColorGrid.push(1);
          }
        }
        setListCheckColorGrid(arrColorGrid);

        setListDataGrid(arrDataGrid);

        funcSetFieldCheckResult(res.data.Input);
        setLoadingTable(false);
      })
      .catch((err) => {
        setLoadingTable(false);
      });
  };

  const listKeyShortcuts = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

  const functionHandleCtrlKey = (e, nameColumn, indexColumn, index, input) => {
    if (e.code === "ArrowDown") {
      if (index === listCheckColor.length - 1) {
        return;
      } else {
        input = document.getElementById(nameColumn + "_" + (indexColumn + 1));
        e.preventDefault();
        input.focus();
      }
    } else if (e.code === "ArrowUp") {
      if (index === 0) {
        return;
      } else {
        input = document.getElementById(nameColumn + "_" + (indexColumn - 1));
        e.preventDefault();
        input.focus();
      }
    }
  }

  const functionHandleAltKey = (e, fieldName) => {
    if (e.key === "1" && fieldName) {
      functionSetData(e, "☑", fieldName);
    } else if (e.key === "2" && fieldName) {
      functionSetData(e, "✔", fieldName);
    } else if (e.key === "3" && fieldName) {
      functionSetData(e, "✖", fieldName);
    } else if (e.key === "4" && fieldName) {
      functionSetData(e, "●", fieldName);
    } else if (e.key === "5" && fieldName) {
      functionSetData(e, "Φ", fieldName);
    }
  }

  const handleKeyPressChange = (e, dataIndex, index) => {
    let input = document.getElementById(dataIndex + "_" + index);
    let nameColumn = dataIndex;
    let indexColumn = index;
    if (e.ctrlKey) {
      functionHandleCtrlKey(e, nameColumn, indexColumn, index, input)
    } else if (e.shiftKey) {
      if (listKeyShortcuts.includes(e.key)) {
        e.preventDefault();
      }
    } else if (e.altKey) {
      if (currentFieldName !== null) {
        if (e.code.slice(0, 5) === "Digit") {
          functionHandleAltKey(e, currentFieldName)
        }
      }
    }
  };

  const handleKeyPressChangeGrid = (e, dataIndex, indexCol, index) => {
    let input = document.getElementById(
      dataIndex + "__" + indexCol + "__" + index
    );
    let nameColumn = dataIndex;
    let indexColumn = indexCol;
    if (e.ctrlKey) {
      if (e.code === "ArrowDown") {
        if (indexCol === listCheckColor.length - 1) {
          return;
        } else if (inputRows.length > 1 && indexColumn + 2 <= inputRows.length) {
          input = document.getElementById(
            nameColumn + "__" + (indexColumn + 1) + "__" + index
          );
          e.preventDefault();
          input.focus();
        }
      } else if (e.code === "ArrowUp") {
        if (indexCol === 0) {
          return;
        } else if (indexColumn >= 1) {
          input = document.getElementById(
            nameColumn + "__" + (indexColumn - 1) + "__" + index
          );
          e.preventDefault();
          input.focus();
        }
      }
    } else if (e.code === "ArrowUp") {
      input = document.getElementById(nameColumn + "_" + indexColumn);
      e.preventDefault();
      input.focus();
    } else if (e.shiftKey) {
      if (listKeyShortcuts.includes(e.key)) {
        e.preventDefault();
      }
    } else if (e.altKey) {
      if (currentFieldName !== null) {
        if (e.code.slice(0, 5) === "Digit") {
          if (e.key === "1" && currentFieldName) {
            functionSetDataGrid(e, "☑", currentFieldName);
          } else if (e.key === "2" && currentFieldName) {
            functionSetDataGrid(e, "✔", currentFieldName);
          } else if (e.key === "3" && currentFieldName) {
            functionSetDataGrid(e, "✖", currentFieldName);
          } else if (e.key === "4" && currentFieldName) {
            functionSetDataGrid(e, "●", currentFieldName);
          } else if (e.key === "5" && currentFieldName) {
            functionSetDataGrid(e, "Φ", currentFieldName);
          }
        }
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

  const returnPackage = (opID, opTable) => {
    const FormData = require("form-data");
    let data = new FormData();
    if (opID !== undefined && opID !== null && opID !== "") {
      data.append("op_id", opID);
      data.append("op_table", opTable);
      data.append("user_role", inforUser.user_role);
      authAxios()
        .post(`${localhost}/return_pack_check`, data)
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
    for (const element of cookieArray) {
      let c = element;
      while (c.startsWith(" ")) {
        c = c.substring(1);
      }
      if (c.startsWith(name)) {
        const encodedValue = c.substring(name.length, c.length);
        // Giải mã dữ liệu khi lấy từ cookie
        return window.atob(encodedValue); // Giải mã dữ liệu từ Base64
      }
    }
    return "";
  }

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

  const funcSetFieldCheckResult = (arrData) => {
    arrData.forEach((item, index) => {
      form.setFieldValue(`data_add__${index}__check_result`, item.check_result);
    });
  };

  useEffect(() => {
    fetchListPumb();
    document.addEventListener("keydown", function (event) {
      try {
        if (event.key === "Enter") {
          event.preventDefault();
        }
        if (event.key === "F3") {
          event.preventDefault();
          setModalShortcut((prevState) => !prevState);
          return;
        }
      } catch {
        console.log("Lỗi");
      }
    });

    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    const handleBeforeUnload = async (event) => {
      const dataID = getCookie("op_id");
      const dataTable = getCookie("op_table");
      if (dataID !== "" && dataID !== undefined && dataID !== null) {
        const FormData = require("form-data");
        let data = new FormData();
        data.append("op_id", dataID);
        data.append("op_table", dataTable);
        data.append("user_role", inforUser.user_role);

        authAxios()
          .post(`${localhost}/return_pack_check`, data)
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

  useEffect(() => {
    const handleBeforeUnload1 = async (event) => {
      if (event.key === "F1") {
        event.preventDefault();
        if (isOpenModalCheckQA === false) {
          document.getElementById("btn-submit").click();
          return;
        } else {
          onFinish();
        }
      }
    };

    window.addEventListener("keydown", handleBeforeUnload1);

    return () => {
      window.removeEventListener("keydown", handleBeforeUnload1);
    };
  }, [isOpenModalCheckQA]);

  const onFinish = (values) => {
    const endTime = Date.now();
    const duration = endTime - startTime;

    let contentQA = "";
    if (dataQAuser1 === "" && dataQAuser2 !== "") {
      contentQA = dataQAuser2;
    } else if (dataQAuser1 !== "" && dataQAuser2 !== "") {
      contentQA = dataQAuser1;
    } else {
      contentQA = dataQAuser1;
    }

    const newData = dataGridSubmit.map((item) => {
      let result = item.result.slice(); // Clone the result array
      if (isLengthIndexCol > result.length) {
        while (result.length < isLengthIndexCol) {
          result.push(""); // Add empty strings until the desired length is reached
        }
      }
      return {
        ...item,
        result: result.map((value) => value.replace(/,/g, "†")).join("†"),
      };
    });

    const newDataGrid = dataGridUser1.map((item) => {
      let result = item.result.split("†"); // Clone the result array
      if (isLengthIndexCol > result.length) {
        while (result.length < isLengthIndexCol) {
          result.push(""); // Add empty strings until the desired length is reached
        }
      }

      return {
        ...item,
        result: result.map((value) => value.replace(/,/g, "†")).join("†"),
      };
    });
    authAxios()
      .post(`${localhost}/submit_check`, {
        user_Id: parseInt(inforUser.user_id),
        user_lvl: parseInt(inforUser.user_lvl),
        qa_content: contentQA,
        op_id: Number(dataDetail.op_id),
        op_table: dataDetail.op_table,
        pack_id: dataDetail.pack_id,
        pack_table: dataDetail.pack_table,
        Input: dataCloneInput,
        Grid: newData.length === 0 ? newDataGrid : newData,
        pumb_id: pumpType,
        is_multi: dataPumb.is_multi,
        result_e1: dataInputOld1,
        result_e2: dataInputOld2,
        grid_e1: dataGridOld1,
        grid_e2: dataGridOld2,
        id_user_e1: dataUserID1,
        id_user_e2: dataUserID2,
        total_time: duration,
        msnv_c: inforUser.user_msnv,
        user_role: inforUser.user_role,
        from_pack_id: dataDetail.from_pack_id,
        is_checksheet: dataDetail.is_checksheet,
      })
      .then((res) => {
        setLoadingBtnSubmit(false);
        openNotificationSweetAlert(SuccessIcon, res.data.message);
        form.resetFields();
        formGrid.resetFields();
        fetchDataInsert(dataPumb);
        setIsOpenModalCheckQA(false);
        setInputRows([]);
      })
      .catch((err) => {
        openNotificationSweetAlert(ErrorIcon, err.response.data.message);
        setLoadingBtnSubmit(false);
      });
  };

  const finishHaveQA = () => {
    if (dataQAuser1 !== "" || dataQAuser2 !== "") {
      setIsOpenModalCheckQA(true);
    } else if (dataQAuser1 === "" && dataQAuser2 === "") {
      onFinish();
    }
  };

  const chooseModel = (value, data) => {
    if (dataDetail !== undefined) {
      returnPackage(dataDetail.op_id, dataDetail.op_table);
    }
    const filterPumb = listPumb.filter((e) => e.pumb_id === data.key);
    sessionStorage.setItem("OptionMachine", JSON.stringify(filterPumb));

    setPumpType(value);
    setDataPumb(data);
    setListHotKeys([]);
    fetchDataInsert(data);
  };

  const handleDataQA = (data) => {
    // setDataChange(data.target.value);

    setDataQAuser1(dataQAuser2);
    setDataQAuser2(dataQAuser1);
  };


  // useEffect(() => {

  //   setDataQAuser1(dataQAuser2);
  //   setDataQAuser2(dataQAuser1);

  // }, [dataChange]);

  const handleChangeDataQA = (e) => {
    setDataQAuser1(e.target.value);
  };

  const downTheLine = (e) => {
    if (e.altKey === true && e.key === "Enter") {
      let txtArea = document.getElementById("textQA");
      txtArea.value = e.target.value + "\r\n";
    }
  };

  const handleAddRow = () => {
    setInputRows((prevRows) => [...prevRows, {}]);
  };

  const handleCloseModalShortcut = () => {
    setModalShortcut(false);
  };

  const screenHeight = window.innerHeight;

  const dynamicHeightInput =
    dataGridUser1.length === 0 ? screenHeight - 300 : screenHeight - 660;

  const shouldDisplayRow =
    dataGridUser1.length !== 0 || dataInputUser1.length !== 0;

  return (
    <Row>
      <ImageCheck dataDetail={dataDetail} loadingTable={loadingTable} />
      <Col span={16} style={{ height: "92vh", padding: "0.5% 1%" }}>
        <Row>
          <Col span={6}>
            <Select
              size={"middle"}
              id="code_city"
              className="SelectTTDN"
              style={{ textAlign: "left", width: "70%" }}
              optionFilterProp="children"
              placeholder="Chọn mã máy"
              onChange={chooseModel}
            >
              {listPumb.map((item, index) => (
                <Option
                  key={item.pumb_id}
                  value={item.pumb_id}
                  is_multi={item.is_multi}
                >
                  {item.pumb_model}
                </Option>
              ))}
            </Select>
          </Col>
          {dataInputUser1.length > 0 ? (
            <>
              <Col span={12} style={{ textAlign: "center" }}>
                <Tooltip
                  title={
                    <span>
                      原票がはっきり見えない: 1<br></br>
                      ※特注要素・備考: ご自身でご確認ください。: 2
                    </span>
                  }
                  color={"#108ee9"}
                  key={"#108ee9"}
                  placement="topRight"
                  className="tooltip-qa-lc"
                >
                  <Input.TextArea
                    id="textQA"
                    style={{
                      width: "70%",
                      background: dataQAuser1 !== "" ? "#ffff003b" : "#fff",
                    }}
                    placeholder="Q/A"
                    onChange={(e) => handleChangeDataQA(e)}
                    // onBlur={() => setDataChange("")}
                    onMouseDown={(e) =>
                      e.button === 2 ? handleDataQA(e) : null
                    }
                    onKeyDown={downTheLine}
                    autoSize={{
                      minRows: 1,
                      maxRows: 2,
                    }}
                    value={dataQAuser1 !== "" ? dataQAuser1 : " "}
                  ></Input.TextArea>
                </Tooltip>
              </Col>
              <Col span={6} style={{ textAlign: "end" }}>
                <ButtonViewInforUser dataDetail={dataDetail} />
              </Col>
            </>
          ) : null}
        </Row>

        {!loadingTable && (
          <>
            {dataInputUser1.length !== 0 && (
              <Row>
                <Col span={17}>
                  <Form
                    form={form}
                    onFinish={onFinish}
                    style={{
                      height: "40vh",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Table
                      style={{ marginTop: 30 }}
                      size="small"
                      columns={columnsInput}
                      dataSource={dataInputUser1}
                      pagination={false}
                      loading={loadingTable}
                      scroll={{
                        // y: dynamicHeightInput,
                        y: dataGridUser1.length > 0 ? "30vh" : "65vh"
                      }}
                    ></Table>
                  </Form>
                </Col>
                <Col span={6} offset={1} style={{ paddingTop: 30 }}>
                  <div className="container-hotKeys">
                    <div id="title-hotKeys">
                      <span>HotKeys</span>
                    </div>
                    <Row id="content-hotKeys">
                      {hotKey.length > 0
                        ? hotKey.map((item) => <span key={item}>{item}</span>)
                        : null}
                    </Row>
                  </div>
                </Col>
              </Row>
            )}
          </>
        )}

        <Form
          form={formGrid}
          onFinish={onFinish}
          style={{ height: "35vh", display: "flex", flexDirection: "column" }}
        >
          {dataGridUser1.length !== 0 && (
            <>
              <Button onClick={handleAddRow} style={{ marginTop: 20 }}>
                Add Row
              </Button>
              <Table
                style={{ marginTop: 30 }}
                size="small"
                columns={columns}
                dataSource={inputRows}
                pagination={false}
                scroll={{
                  y: "28vh",
                }}
              ></Table>
            </>
          )}
        </Form>

        {shouldDisplayRow && (
          <Row
            style={{
              position: "absolute",
              bottom: 5,
              paddingTop: "1.5%",
              right: 0,
              paddingRight: "1.5%",
              width: "100%",
            }}
          >
            <Col
              span={18}
              style={{
                display: "flex",
                paddingLeft: "5%",
                columnGap: "5ch",
                alignItems: "center",
              }}
            >
              {listSymbol.map((item, index) => (
                <Col span={4} key={item} style={{ fontSize: 18 }}>
                  Alt+{index + 1}: &nbsp;&nbsp;{item}
                </Col>
              ))}
            </Col>
            <Col
              span={5}
              offset={1}
              style={{
                display: "flex",
                columnGap: "2ch",
                justifyContent: "flex-end",
              }}
            >
              <Button
                id="btn-submit"
                // disabled={!loadingTable}
                loading={loadingBtnSubmit}
                style={{
                  float: "right",
                  marginTop: "1%",
                  fontWeight: "bold",
                }}
                type="primary"
                // htmlType="button"
                onClick={finishHaveQA}
              >
                SUBMIT (F1)
              </Button>
            </Col>
          </Row>
        )}
      </Col>

      <ModalShortcut
        modalShortcut={modalShortcut}
        handleCloseModalShortcut={handleCloseModalShortcut}
      />

      {isOpenModalCheckQA === true ? (
        <ModalCheckQA
          isOpenModalCheckQA={isOpenModalCheckQA}
          onFinish={onFinish}
          setIsOpenModalCheckQA={setIsOpenModalCheckQA}
        />
      ) : null}
    </Row>
  );
};

export default InsertInformationCheck;
