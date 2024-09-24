import { Button, Col, Input, Modal, Row, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { authAxios } from "../../../api/axiosClient";
import { localhost } from "../../../server";
import SuccessIcon from "../../../images/SuccessNotiIcon.svg";
import { openNotificationSweetAlert } from "../../../Function";

const ModalQA = ({
  open,
  setIsOpenModalQA,
  inforUser,
  valueBase64,
  startTime,
  setLoadingBtnSubmit,
  dataPumb,
  dataDetail,
  setStartTime,
  setValueBase64,
  fetchDataInsert,
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceLength, setDataSourceLength] = useState([]);

  const [dataQA, setDataQA] = useState(null);
  const [dataOtherContent, setDataOtherContent] = useState(null);

  const handleCancel = () => {
    setIsOpenModalQA(false);
  };
  const columns = [
    {
      title: "STT",
      align: "center",
      dataIndex: "qa_stt",
      ellipsis: true,
      width: 60,

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

    const updatedDataList = valueBase64.map((item) => ({
      ...item,
      value_id: item.value_id === "☑" ? "S" : item.value_id,
    }));

    const concatenatedValues = updatedDataList
      .map((item) => item.value_id)
      .join("‡");

    const endTime = Date.now();
    const duration = endTime - startTime;

    setLoadingBtnSubmit(true);
    authAxios()
      .post(`${localhost}/submit_entry_clf`, {
        // results: concatenatedValues,
        results: dataQA !== null ? "QA_" + dataQA : "OTHER_" + dataOtherContent,

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
        qa_all: 1,
        qa_result: "",
        jp_time_ymd: dataDetail.jp_time_ymd,
      })
      .then((res) => {
        setLoadingBtnSubmit(false);
        setStartTime(0);
        setValueBase64([]);
        openNotificationSweetAlert(SuccessIcon, res.data.message);
        handleCancel();
        fetchDataInsert(dataPumb.value);
      })
      .catch((err) => {
        setLoadingBtnSubmit(false);
      });
  };

  const chooseContentQA = (value) => {
    setDataQA(value);
    setDataOtherContent(null);
  };
  const changeData = (e) => {
    setDataQA(null);
    setDataOtherContent(e.target.value);
  };
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
        <Col span={17} style={{ display: "flex" }}>
          <Table
            style={{ marginTop: 15, width: "48%" }}
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
            style={{ marginTop: 15, width: "48%" }}
            size="small"
            columns={columns}
            dataSource={dataSource.secondPart}
            pagination={false}
            bordered
            // scroll={{
            //   y: "57vh",
            // }}
          ></Table>
        </Col>
        <Col span={7} style={{ paddingLeft: "2%" }}>
          <Row style={{ height: "40%", display: "flex", alignItems: "center" }}>
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
          </Row>
          <Row style={{ height: "40%", display: "flex", alignItems: "center" }}>
            <Col span={11}>Nhập nội dung khác:</Col>
            <Col span={13}>
              <Input
                placeholder="Nhập nội dung QA"
                value={dataOtherContent}
                onChange={changeData}
                style={{ width: "100%" }}
              ></Input>
            </Col>
          </Row>
          <Row style={{ height: "20%", position: "relative" }}>
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
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalQA;
