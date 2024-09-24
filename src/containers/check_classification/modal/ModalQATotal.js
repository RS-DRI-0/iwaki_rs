import React, { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { authAxios } from "../../../api/axiosClient";
import { localhost } from "../../../server";

const ModalQATotal = ({
  open,
  setIsOpenModalQATotal,
  onFinish,
  valueBase64,
  inforUser,
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceLength, setDataSourceLength] = useState([]);

  const handleCancel = () => {
    setIsOpenModalQATotal(false);
  };

  const columns = [
    {
      title: "STT",
      align: "center",
      ellipsis: true,
      width: 60,
      dataIndex: "qa_stt",
    },
    {
      title: "Nội dung tiếng Việt",
      dataIndex: "qa_vn",
      key: "qa_vn",
      // ellipsis: true,
      // width: "40%"
    },
  ];

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
        // setListPumb(res.data.list_pumb);
        const originalData = res.data.data; // Assuming res.data.data is the array you provided
        const length = originalData.length; // Get the length of the array
        const midIndex = Math.ceil(length / 2); // Calculate the mid index

        // Split the data into two parts
        const firstPart = originalData.slice(0, midIndex); // First half
        const secondPart = originalData.slice(midIndex);

        setDataSource({
          firstPart: firstPart,
          secondPart: secondPart,
        });
        setDataSourceLength(originalData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchListQaValue();
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btn-qa").click();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const valueAtIndex = valueBase64[0];
  const [isQaE1QA, setIsQaE1QA] = useState(true);
  const [isQaE1Other, setIsQaE1Other] = useState(true);

  const [inputValue, setInputValue] = useState(() => {
    const removePrefix = (value) => {
      if (value === undefined) {
        return "";
      } else if (value.startsWith("OTHER_")) {
        return "";
      } else if (value.startsWith("QA_")) {
        return value.substring(3);
      } else {
        return value;
      }
    };

    let initialValue = "";

    if (valueAtIndex.is_qa_e1 === "1" && valueAtIndex.qa_e1) {
      initialValue = removePrefix(valueAtIndex.qa_e1);
    } else if (valueAtIndex.is_qa_e2 === "1" && valueAtIndex.qa_e2) {
      initialValue = removePrefix(valueAtIndex.qa_e2);
    }

    return initialValue;
  });

  const [inputValueOther, setInputValueOther] = useState(() => {
    const removePrefix = (value) => {
      if (value === undefined) {
        return "";
      } else if (value.startsWith("QA_")) {
        return "";
      } else if (value.startsWith("OTHER_")) {
        return value.substring(6); // Loại bỏ "QA_" (3 ký tự)
      } else {
        return value;
      }
    };

    // Xử lý giá trị qa_e1
    let initialValue = "";

    if (valueAtIndex.is_qa_e1 === "1" && valueAtIndex.qa_e1) {
      initialValue = removePrefix(valueAtIndex.qa_e1);
    } else if (valueAtIndex.is_qa_e2 === "1" && valueAtIndex.qa_e2) {
      initialValue = removePrefix(valueAtIndex.qa_e2);
    }

    return initialValue;
  });

  const handleContextMenuQA = (e) => {
    e.preventDefault();

    if (isQaE1QA) {
      if (valueAtIndex.is_qa_e2 === "0") {
        // Prevent clicking qa_e2 if is_qa_e2 is 1
        return;
      }

      const isOther = valueAtIndex.qa_e2.startsWith("OTHER_");

      if (isOther) {
        setInputValue("");
      } else {
        const removePrefix = (value) => {
          if (value.startsWith("OTHER_")) {
            return "";
          } else if (value.startsWith("QA_")) {
            return value.substring(3); // Loại bỏ "QA_" (3 ký tự)
          } else {
            return value;
          }
        };

        const initialValue = removePrefix(valueAtIndex.qa_e2);

        setInputValue(initialValue);
      }
    } else {
      if (valueAtIndex.is_qa_e1 === "0") {
        // Prevent showing qa_e1 if is_qa_e1 is 1
        return;
      }

      const isOther = valueAtIndex.qa_e1.startsWith("OTHER_");
      if (isOther) {
        setInputValue("");
      } else {
        const removePrefix = (value) => {
          if (value.startsWith("OTHER_")) {
            return "";
          } else if (value.startsWith("QA_")) {
            return value.substring(3); // Loại bỏ "QA_" (3 ký tự)
          } else {
            return value;
          }
        };

        const initialValue = removePrefix(valueAtIndex.qa_e1);

        setInputValue(initialValue);
      }
    }

    // Cập nhật trạng thái
    setIsQaE1QA(!isQaE1QA); // Đổi giá trị thành qa_e2
  };

  const handleContextMenuOther = (e) => {
    e.preventDefault(); // Ngăn chặn menu ngữ cảnh mặc định
    if (isQaE1Other) {
      if (valueAtIndex.is_qa_e2 === "0") {
        // Prevent clicking qa_e2 if is_qa_e2 is 1
        return;
      }

      const isOther = valueAtIndex.qa_e2.startsWith("QA_");

      if (isOther) {
        setInputValueOther("");
      } else {
        const removePrefix = (value) => {
          if (value.startsWith("QA_")) {
            return "";
          } else if (value.startsWith("OTHER_")) {
            return value.substring(6); // Loại bỏ "QA_" (3 ký tự)
          } else {
            return value;
          }
        };

        const initialValue = removePrefix(valueAtIndex.qa_e2);

        setInputValueOther(initialValue);
      }
    } else {
      if (valueAtIndex.is_qa_e1 === "0") {
        // Prevent showing qa_e1 if is_qa_e1 is 1
        return;
      }

      const isOther = valueAtIndex.qa_e1.startsWith("QA_");
      if (isOther) {
        setInputValueOther("");
      } else {
        const removePrefix = (value) => {
          if (value.startsWith("QA_")) {
            return "";
          } else if (value.startsWith("OTHER_")) {
            return value.substring(6); // Loại bỏ "QA_" (3 ký tự)
          } else {
            return value;
          }
        };

        const initialValue = removePrefix(valueAtIndex.qa_e1);

        setInputValueOther(initialValue);
      }
    }

    // Cập nhật trạng thái
    setIsQaE1Other(!isQaE1Other); // Đổi giá trị thành qa_e2
  };

  const handleChangeQA = (e) => {
    setInputValue(e.target.value);
  };

  const handleChangeOther = (e) => {
    setInputValueOther(e.target.value);
  };

  const errorInputotherzero =
    inputValue.length !== 0 && inputValueOther.length !== 0;

  const errorInputzero =
    inputValue.length === 0 && inputValueOther.length === 0;

  const errorInputValue =
    (inputValue > 0 && inputValue <= dataSourceLength.length) ||
    inputValue === "";

  const removePrefix = (str, prefix) => {
    if (str.startsWith(prefix)) {
      return str.substring(prefix.length);
    }
    return str;
  };

  const prefixOTHER = "OTHER_";
  const prefixQA = "QA_";

  // Function to get the prefix of a string if it exists
  const getPrefix = (str) => {
    if (str.startsWith(prefixOTHER)) {
      return prefixOTHER;
    } else if (str.startsWith(prefixQA)) {
      return prefixQA;
    }
    return "";
  };

  const bothQAFlagsSet =
    valueAtIndex.is_qa_e1 === "1" && valueAtIndex.is_qa_e2 === "1";

  // Get prefixes and remaining values after removing the prefix
  const prefixE1 = getPrefix(valueAtIndex.qa_e1);
  const prefixE2 = getPrefix(valueAtIndex.qa_e2);

  const qa_e1WithoutPrefix = removePrefix(valueAtIndex.qa_e1, prefixE1);
  const qa_e2WithoutPrefix = removePrefix(valueAtIndex.qa_e2, prefixE2);

  // Determine if the values are different after removing the prefix
  const areValuesDifferent =
    bothQAFlagsSet && qa_e1WithoutPrefix !== qa_e2WithoutPrefix;


  const showOtherInput =
    (valueAtIndex.is_qa_e1 === "1" &&
      valueAtIndex.is_qa_e2 === "0" &&
      valueAtIndex.qa_e1.startsWith("OTHER_")) ||
    (valueAtIndex.is_qa_e2 === "1" &&
      valueAtIndex.is_qa_e1 === "0" &&
      valueAtIndex.qa_e2.startsWith("OTHER_")) ||
    (valueAtIndex.is_qa_e1 === "1" &&
      valueAtIndex.is_qa_e2 === "1" &&
      prefixE1 === "OTHER_" &&
      prefixE2 === "OTHER_" &&
      areValuesDifferent) ||
    (valueAtIndex.is_qa_e1 === "1" &&
      valueAtIndex.is_qa_e2 === "1" &&
      prefixE1 === "OTHER_" &&
      prefixE2 === "QA_" &&
      true) ||
    (valueAtIndex.is_qa_e1 === "1" &&
      valueAtIndex.is_qa_e2 === "1" &&
      prefixE1 === "QA_" &&
      prefixE2 === "OTHER_" &&
      true);

  const showQAInput =
    (valueAtIndex.is_qa_e1 === "1" &&
      valueAtIndex.is_qa_e2 === "0" &&
      valueAtIndex.qa_e1.startsWith("QA_")) ||
    (valueAtIndex.is_qa_e2 === "1" &&
      valueAtIndex.is_qa_e1 === "0" &&
      valueAtIndex.qa_e2.startsWith("QA_")) ||
    (valueAtIndex.is_qa_e1 === "1" &&
      valueAtIndex.is_qa_e2 === "1" &&
      prefixE1 === "QA_" &&
      prefixE2 === "QA_" &&
      areValuesDifferent) ||
    (valueAtIndex.is_qa_e1 === "1" &&
      valueAtIndex.is_qa_e2 === "1" &&
      prefixE1 === "OTHER_" &&
      prefixE2 === "QA_" &&
      true) ||
    (valueAtIndex.is_qa_e1 === "1" &&
      valueAtIndex.is_qa_e2 === "1" &&
      prefixE1 === "QA_" &&
      prefixE2 === "OTHER_" &&
      true);

  const handleSubmitQA = () => {
    if (errorInputotherzero) {
      console.log("hello");
    } else if (!errorInputValue) {
      console.log("hello");
    } else if (inputValue.length !== 0) {
      sessionStorage.setItem(
        "ValueSubmitInput",
        JSON.stringify(`QA_${inputValue}`)
      );
      onFinish();
    } else if (inputValueOther.length !== 0) {
      sessionStorage.setItem(
        "ValueSubmitInput",
        JSON.stringify(`OTHER_${inputValueOther}`)
      );
      onFinish();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={"70%"}
      style={{ top: 20 }}
    >
      <Row style={{ display: "flex", width: "100%" }}>
        <Table
          style={{ marginTop: 15, width: "38%" }}
          size="small"
          columns={columns}
          dataSource={dataSource.firstPart}
          pagination={false}
          bordered
          scroll={{
            y: "57vh",
          }}
        ></Table>
        <div style={{ width: "4%" }}></div>
        <Table
          style={{ marginTop: 15, width: "38%" }}
          size="small"
          columns={columns}
          dataSource={dataSource.secondPart}
          pagination={false}
          bordered
          scroll={{
            y: "57vh",
          }}
        ></Table>
        <div style={{ paddingLeft: "2%", width: "20%" }}>
          <div style={{ height: "40%", display: "flex", alignItems: "center" }}>
            <Row>
              <Col span={24}>Nhập nội dung QA:</Col>
              <Col span={24}>
                <Input
                  status={
                    (
                      !errorInputValue ||
                      errorInputotherzero ||
                      errorInputzero ||
                      showQAInput)
                    &&
                    "error"
                  }
                  style={{ width: "100%" }}
                  value={inputValue}
                  onContextMenu={handleContextMenuQA}
                  onChange={handleChangeQA}
                ></Input>
              </Col>
            </Row>
          </div>
          <div style={{ height: "40%", display: "flex", alignItems: "center" }}>
            <Row>
              <Col span={24}>Nhập nội dung khác:</Col>
              <Col span={24}>
                <Input
                  status={
                    (
                      errorInputotherzero ||
                      errorInputzero ||
                      showOtherInput
                    ) &&
                    "error"
                  }
                  style={{ width: "100%" }}
                  value={inputValueOther}
                  onContextMenu={handleContextMenuOther}
                  onChange={handleChangeOther}
                ></Input>
              </Col>
            </Row>
          </div>
          <div style={{ height: "20%", position: "relative" }}>
            <Button
              onClick={handleSubmitQA}
              id="btn-qa"
              style={{
                color: "#fff",
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#BBBB46",
              }}
            >
              QA (Enter)
            </Button>
          </div>
        </div>
      </Row>
    </Modal>
  );
};

export default ModalQATotal;
