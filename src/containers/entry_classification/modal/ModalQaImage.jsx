import { Button, Col, Input, Modal, Row, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { authAxios } from "../../../api/axiosClient";
import { localhost } from "../../../server";
import SuccessIcon from "../../../images/SuccessNotiIcon.svg";
import { openNotificationSweetAlert } from "../../../Function";

const ModalQaImage = ({
  open,
  setIsOpenModalQaImage,
  inforUser,
  valueBase64,
  startTime,
  setLoadingBtnSubmit,
  dataPumb,
  dataDetail,
  setStartTime,
  setValueBase64,
  fetchDataInsert,
  indexArr,
  updateArray,
  dataResult,
  setDataResult,
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceLength, setDataSourceLength] = useState([]);

  const [dataQA, setDataQA] = useState(null);
  const [dataOtherContent, setDataOtherContent] = useState(null);
  const handleCancel = () => {
    setIsOpenModalQaImage(false);
  };
  const columns = [
    {
      title: "STT",
      align: "center",
      ellipsis: true,
      width: 60,
      dataIndex: "qa_stt",

      // render: (value, item, index) => index + 1,
    },
    {
      title: "Nội dung tiếng Việt",
      dataIndex: "qa_vn",
      key: "qa_vn",
      align: "left",
      // ellipsis: true,
      // width: "40%"
    },
    // {
    //   title: "Nội dung tiếng Nhật",
    //   dataIndex: "qa_jp",
    //   key: "qa_jp",
    //   align: "left",
    //   // ellipsis: true,
    // },
    // {
    //   title: "Nội dung tiếng Anh",
    //   dataIndex: "qa_en",
    //   key: "qa_en",
    //   align: "left",
    //   // ellipsis: true,
    // },
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

  const onSubmitQA = () => {
    const updatedData = [...valueBase64];
    const updatedDataResult = [...dataResult];
    const arrayData = updatedData.map((item) => item.value_id);

    const return_data = updateArray(arrayData, indexArr, "QA");
    let arrResult = [];
    for (let i = 0; i < return_data.length; i++) {
      updatedData[i].value_id = return_data[i];
    }

    for (let i = 0; i < updatedDataResult.length; i++) {
      if (i === indexArr) {
        if (dataQA !== null) {
          arrResult.push({ ...updatedDataResult[i], value_id: "QA_" + dataQA });
        } else {
          arrResult.push({
            ...updatedDataResult[i],
            value_id: "OTHER_" + dataOtherContent,
          });
        }
      } else {
        arrResult.push(updatedDataResult[i]);
      }
    }

    setValueBase64(updatedData);
    setDataResult(arrResult);
    handleCancel();
  };

  const chooseContentQA = (value) => {
    console.log(value);
    setDataQA(value);
    setDataOtherContent(null);
  };
  const changeData = (e) => {
    setDataQA(null);
    setDataOtherContent(e.target.value);
  };

  useEffect(() => {
    let text = String(dataResult[indexArr].value_id);
    if (text.includes("QA")) {
      const newValue = text.replace("QA_", "");
      setDataQA(newValue);
    } else if (text.includes("OTHER")) {
      const newContent = text.replace("OTHER_", "");
      setDataOtherContent(newContent);
    } else {
      setDataQA(null);
      setDataOtherContent(null);
    }
  }, []);

  const handleDisableBtn = () => {
    const listExcep = [null, undefined, ""];
    return listExcep.includes(dataQA) && listExcep.includes(dataOtherContent);
  };
  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={false}
      width={"80%"}
      style={{ top: 20 }}
    >
      <Row style={{ display: "flex" }}>
        <Table
          style={{ marginTop: 15, width: "33%" }}
          size="small"
          columns={columns}
          dataSource={dataSource.firstPart}
          pagination={false}
          bordered
          // scroll={{
          //   y: "57vh",
          // }}
        ></Table>
        <div style={{ width: "4%" }}></div>
        <Table
          style={{ marginTop: 15, width: "33%" }}
          size="small"
          columns={columns}
          dataSource={dataSource.secondPart}
          pagination={false}
          bordered
          // scroll={{
          //   y: "57vh",
          // }}
        ></Table>
        <div style={{ paddingLeft: "2%" }}>
          <div style={{ height: "40%", display: "flex", alignItems: "center" }}>
            <Col span={11}>Nhập nội dung QA:</Col>
            <Col span={13}>
              {/* <Input style={{ width: "100%" }}></Input> */}
              <Select
                size={"middle"}
                id="code_city"
                style={{ width: "100%" }}
                optionFilterProp="children"
                placeholder="Chọn STT QA"
                allowClear
                onChange={chooseContentQA}
                value={dataQA}
                // defaultValue={valueListPumb.pumb_model}
              >
                {dataSourceLength.map((item, index) => (
                  <Select.Option key={item.qa_stt} value={item.qa_stt}>
                    {item.qa_stt}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </div>
          <div style={{ height: "40%", display: "flex", alignItems: "center" }}>
            <Col span={11}>Nhập nội dung khác:</Col>
            <Col span={13}>
              <Input
                placeholder="Nhập nội dung QA"
                value={dataOtherContent}
                onChange={changeData}
                style={{ width: "100%" }}
              ></Input>
            </Col>
          </div>
          <div style={{ height: "20%", position: "relative" }}>
            <Button
              disabled={handleDisableBtn()}
              onClick={onSubmitQA}
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

export default ModalQaImage;
