import { Col, Form, Input, Row, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { localhost } from "../../server";
import SuccessIcon from "../../images/SuccessNotiIcon.svg";
import ErrorIcon from "../../images/ErrorNotifiIcon.svg";

import "./LastCheck.css";
import WarningIcon from "../../images/WarningNotiIcon.svg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { openNotificationSweetAlert } from "../../Function";
import ModalShortcut from "../input/ModalShortcut";
import ShowImage from "./show_image/ShowImage";
import RowButton from "./content/RowButton";
import TableLastCheck from "./content/TableLastCheck";
import ButtonSubmitLC from "./content/ButtonSubmitLC";
import TableGridLastCheck from "./content/TableGridLastCheck";
import { authAxios } from "../../api/axiosClient";

const LastCheck = () => {
  const [form] = Form.useForm();
  const [formGrid] = Form.useForm();
  const [dataDetail, setDataDetail] = useState();
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingTableGrid, setLoadingTableGrid] = useState(false)

  const [listDataDefault, setListDataDefault] = useState([]);
  const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);

  const [listPumb, setListPumb] = useState([]);
  const [dataPumb, setDataPumb] = useState();

  const [listNoCheckLogic, setListNoCheckLogic] = useState([])
  const [listLogicMulti, setListLogicMulti] = useState([])

  const [dataLastCheck, setDataLastCheck] = useState([])
  const [startTime, setStartTime] = useState("")
  const [modalShortcut, setModalShortcut] = useState(false);
  const [isCheckLogic, setIsCheckLogic] = useState(false)
  const [listNotQualified, setListNotQualified] = useState([])
  const [dataQA, setDataQA] = useState("")
  const [isOpenModalSubmit, setIsOpenModalSubmit] = useState(false)
  const [pumpId, setPumpId] = useState()

  const [isSortData, setIsSortData] = useState(false)
  const [newDataTable, setNewDataTable] = useState([])
  const [listNoException, setListNoException] = useState([])
  const [isHaveGrid, setIsHaveGrid] = useState(false)
  const [dataGridLastCheck, setDataGridLastCheck] = useState([])

  const [listIndexLogicGrid, setListIndexLogicGrid] = useState([])
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const [isCheckShowDataMaster, setIsCheckShowDataMaster] = useState(false)
  const [time, setTime] = useState(0);
  const [valueIsMaster, setValueIsMaster] = useState("")

  const listRuleCompare = [
    {
      month: "01",
      value: "A"
    },
    {
      month: "02",
      value: "B"
    },
    {
      month: "03",
      value: "C"
    },
    {
      month: "04",
      value: "D"
    },
    {
      month: "05",
      value: "E"
    },
    {
      month: "06",
      value: "F"
    },
    {
      month: "07",
      value: "G"
    },
    {
      month: "08",
      value: "H"
    },
    {
      month: "09",
      value: "I"
    },
    {
      month: "10",
      value: "J"
    },
    {
      month: "11",
      value: "K"
    },
    {
      month: "12",
      value: "L"
    },
  ]

  const functionResetData = () => {
    form.resetFields();
    formGrid.resetFields();

    setDataLastCheck([])
    setListNoCheckLogic([])
    setIsCheckLogic(false)
    setIsOpenModalSubmit(false)
    setNewDataTable([])
    setIsSortData(false)
    setDataDetail()
    setDataGridLastCheck([])
    setListIndexLogicGrid([])
  }

  const functionCheckLogicGrid = (newData) => {
    let listIndexLogic = []

    newData.forEach((item, index) => {
      let arrProduction = item.production.split("~")
      let newArr = []
      try {
        for (const element of listRuleCompare) {
          if (arrProduction[0][0] === element.value) {
            newArr.push(arrProduction[0].replace(arrProduction[0][0], element.month))
          }
          if (arrProduction[1][0] === element.value) {
            newArr.push(arrProduction[1].replace(arrProduction[1][0], element.month))
          }
        }
        if (item.mfg_no === "") {
          listIndexLogic.push(index)
        } else {
          let dataSlice = item.mfg_no.slice(-5)
          let newNumber = "0" + dataSlice
          let newDataCompare = item.mfg_no.replace(dataSlice, newNumber)
          if (!(parseInt(newArr[0]) <= parseInt(newDataCompare) && parseInt(newDataCompare) <= parseInt(newArr[1]))) {
            listIndexLogic.push(index)
          }
        }
      } catch (err) {
        console.log(err)
      }
    })
    setListIndexLogicGrid(listIndexLogic)
  }

  function setCookieRemember(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();

    // Mã hóa dữ liệu trước khi lưu vào cookie
    const encodedValue = window.btoa(cvalue); // Mã hóa dữ liệu bằng Base64
    document.cookie = cname + "=" + encodedValue + ";" + expires + ";path=/";
  }

  const fetchDataInsert = async (pumbModel) => {
    someAsyncFunction()
    const FormData = require("form-data");
    let data = new FormData();
    data.append("pumb_id", pumbModel.value);
    data.append("is_multi", pumbModel.is_multi);
    data.append("user_role", inforUser.user_role);

    let arrData = []
    authAxios()
      .post(`${localhost}/get_lc_info`, data)
      .then((res) => {
        setStartTime(Date.now())

        if (res.status === 200) {
          form.resetFields()
          formGrid.resetFields()

          setCookieRemember("p_id", res.data.pack_id, 1);
          setCookieRemember("p_info", res.data.pack_info, 1);
          for (const element of res.data.results) {
            arrData.push({
              No: element.No,
              field_name: element.field_name,
              Result: element.Result,
              rule_point: element.rule_point,
              check_result: element.check_result,
              mark: element.mark,
              vl_rule: element.vl_rule,
              mark_checksheet: element.mark_checksheet,
              mark_Production_Instructions: element.mark_Production_Instructions,
              mark_Name_plate: element.mark_Name_plate,
              mark_Tem: element.mark_Tem,
              other_rule: element.other_rule,
              is_qualified: element.is_qualified,
              no_compair: element.no_compair,
              vl_grid: element.vl_grid,
              vl_grid_compair: element.vl_grid_compair,
              raw_value: element.raw_value
            })
          }

          setDataLastCheck(res.data.results)
          if (res.data.grid.length > 0) {
            let newData = []
            res.data.grid[0].vl_grid[0].forEach((item, index) => {
              newData.push({
                mfg_no: item,
                production: res.data.grid[0].vl_grid_compair
              })
            })
            functionCheckLogicGrid(newData)
            setDataGridLastCheck(newData)
            setLoadingTableGrid(true)
          } else {
            setDataGridLastCheck([])
          }
          if (res.data.grid.length > 0) {
            setIsHaveGrid(true)
          } else {
            setIsHaveGrid(false)
          }
          let listNoExcep = []
          res.data.results.forEach(item => {
            if (item.other_rule === "1") {
              listNoExcep.push(item.No)
            }
          })

          setListNoException(listNoExcep)
          setListDataDefault(arrData)
          setDataDetail(res.data);
          setDataQA(res.data.qa_content)

          const dateStart = new Date(res.data.date_start);
          const dateCheck = new Date(res.data.date_check);
          const secondsSinceEpoch = (dateCheck.getTime() - dateStart.getTime()) / 1000;
          setTime(Number(res.data.timeout_seconds) - secondsSinceEpoch)
        } else {
          setCookieRemember("p_id", "", 1);
          setCookieRemember("p_info", "", 1);
          setDataDetail()
          setDataLastCheck([])
          openNotificationSweetAlert(WarningIcon, res.data.message);
        }
        sessionStorage.setItem("current_pack", JSON.stringify(res.data))
        setLoadingTable(false);
      })
      .catch((err) => {
        openNotificationSweetAlert(ErrorIcon, err.response.data.message);
        setLoadingTable(false);
      });
  };

  const returnPackage = (opID, opTable) => {
    const FormData = require("form-data");
    let data = new FormData();
    if (opID !== undefined && opID !== null && opID !== "") {
      data.append("pack_id", opID);
      data.append("user_role", inforUser.user_role);
      authAxios()
        .post(`${localhost}/return_pack_lc`, data)
        .then((res) => {
          // console.log(res)
        })
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
      .get(`${localhost}/get_list_pump`,
        {
          params: {
            user_role: inforUser.user_role
          },
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then((res) => {
        setListPumb(res.data.list_pumb);
      })
      .catch((err) => {
        console.log(err);
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
      }
      catch (err) {
        console.log(err);
      }
    });

    // F5 return pack
    const handleBeforeUnload = async (event) => {
      const dataID = getCookie("p_id");
      if (dataID !== "" && dataID !== undefined && dataID !== null) {
        const FormData = require("form-data");
        let data = new FormData();
        data.append("pack_id", dataID);
        data.append("user_role", inforUser.user_role);

        authAxios()
          .post(`${localhost}/return_pack_lc`, data)
          .then((res) => {

          })
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

  const onFinish = (values) => {
    const endTimeClick = Date.now();
    const duration = endTimeClick - startTime;
    const durationInSeconds = duration / 1000;

    let getDataQA = document.getElementById("textQA").value
    const dataFormGrid = formGrid.getFieldsValue()
    const dataFormInput = form.getFieldsValue()
    setLoadingBtnSubmit(false);

    Object.keys(dataFormGrid).map(item => {
      let arr_key = item.split("__");
      return dataGridLastCheck[arr_key[1]][arr_key[2]] = dataFormGrid[item]
    });

    let arrGridSubmit = []

    dataGridLastCheck.forEach(item => {
      arrGridSubmit.push({
        mfg_no: item.mfg_no
      })
    })

    Object.keys(dataFormInput).map(item => {
      let arr_key = item.split("__");
      return dataLastCheck[arr_key[1]][arr_key[2]] = dataFormInput[item]
    });

    authAxios()
      .post(`${localhost}/submit_lc`, {
        lc_id: parseInt(inforUser.user_id),
        user_role: inforUser.user_role,
        qa_content: getDataQA,
        op_table: dataDetail.op_table,
        pack_id: dataDetail.pack_id,
        lc_time: parseInt(durationInSeconds),
        path_files: dataDetail.path_files,
        path_thumbs: dataDetail.path_thumbs,
        path_files_order: dataDetail.path_files_order,
        path_thumbs_order: dataDetail.path_thumbs_order,
        order_id: dataDetail.order_id,
        is_order: dataDetail.is_order,
        pump_id: dataPumb.value,
        is_qualified: listNotQualified.length > 0 ? 1 : 0,
        lst_not_qualified: listNotQualified,
        results: dataLastCheck,
        grid: arrGridSubmit,
        is_checksheet: dataDetail.is_checksheet,
        from_pack_id: dataDetail.from_pack_id,
        is_npl: dataDetail.is_npl,
        npl_id: dataDetail.npl_id,
        vl_prioriti: dataDetail.vl_prioriti,
        is_multi: dataPumb.is_multi,
        rule_point: dataDetail.rule_point,
        upload_user: dataDetail.upload_user,
        pump_name: dataPumb.children,
        is_timeout: time > 0 ? "0" : "1"
      })
      .then((res) => {
        setLoadingBtnSubmit(false);
        setDataLastCheck([])
        setDataGridLastCheck([])
        setListNotQualified([])
        setListNoCheckLogic([])
        setIsCheckLogic(false)
        setIsOpenModalSubmit(false)
        setNewDataTable([])
        setIsSortData(false)
        fetchDataInsert(dataPumb);
        setTime(0)
        openNotificationSweetAlert(SuccessIcon, res.data.message);
      })
      .catch((err) => {
        openNotificationSweetAlert(ErrorIcon, err.response.data.message);
      });
  };

  const chooseModel = (value, data) => {

    if (dataDetail !== undefined) {
      returnPackage(dataDetail.pack_id, dataDetail.op_table);
    }
    setValueIsMaster(data.is_master)
    setPumpId(value)
    setDataPumb(data);
    setIsCheckShowDataMaster(false)
    functionResetData()
    fetchDataInsert(data);
  };

  const handleChangeDataQA = (e) => {
    let text = document.getElementById("textQA");
    if (e.target.value === "") {
      text.style.background = "#fff"
    } else {
      text.style.background = "#ffff003b"
    }
  }
  const downTheLine = (e) => {
    let txtArea = document.getElementById("textQA");
    if (e.altKey === true && e.key === "Enter") {
      txtArea.value = e.target.value + '\r\n'
    }
  }

  const handleCloseModalShortcut = () => {
    setModalShortcut(false)
  }

  const someAsyncFunction = async () => {
    // Thực hiện một số tác vụ bất đồng bộ
    setLoadingTable(true);
    return new Promise((resolve) => setTimeout(resolve, 200));
  };

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }

  }, [time]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Row>
      <ShowImage
        dataDetail={dataDetail}
        dataLastCheck={dataLastCheck}
        pumpId={pumpId}
      />
      <Col span={17} style={{ height: "90vh", padding: "0.5% 1%" }}>
        <Row>
          <Col span={4}>
            <Select
              size={"middle"}
              id="code_pump"
              className="SelectTTDN"
              style={{ textAlign: "left", width: "100%" }}
              optionFilterProp="children"
              placeholder="Chọn mã máy"
              onChange={chooseModel}
            >
              {listPumb.map((item, index) => (
                <Select.Option key={item.pumb_id} value={item.pumb_id} is_master={item.is_master} is_multi={item.is_multi}>
                  {item.pumb_model}
                </Select.Option>
              ))}
            </Select>
          </Col>

          {dataLastCheck.length > 0 &&
            <>
              <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip
                  title={
                    <span>
                      原票がはっきり見えない: 1
                      <br></br>
                      ※特注要素・備考: ご自身でご確認ください。: 2
                    </span>}
                  color={"#108ee9"}
                  key={"#108ee9"}
                  placement="topRight"
                  className="tooltip-qa-lc"
                >
                  <Input.TextArea
                    id="textQA"
                    style={{ width: "70%", background: dataQA !== "" ? "#ffff003b" : "#fff" }}
                    placeholder="Q/A"
                    onChange={(e) => handleChangeDataQA(e)}
                    onKeyDown={downTheLine}
                    autoSize={{
                      minRows: 1,
                      maxRows: 2,
                    }}
                    defaultValue={dataQA}
                  >
                  </Input.TextArea>
                </Tooltip>
              </Col>

              <RowButton
                dataLastCheck={dataLastCheck}
                pumpId={pumpId}
                setListNoCheckLogic={setListNoCheckLogic}
                setDataLastCheck={setDataLastCheck}
                listDataDefault={listDataDefault}
                dataPumb={dataPumb}
                form={form}
                setListNotQualified={setListNotQualified}
                listNotQualified={listNotQualified}
                setIsCheckLogic={setIsCheckLogic}
                setIsSortData={setIsSortData}
                isSortData={isSortData}
                newDataTable={newDataTable}
                setLoadingMainTable={setLoadingTable}
                listNoException={listNoException}
                setListIndexLogicGrid={setListIndexLogicGrid}
                formGrid={formGrid}
                dataGridLastCheck={dataGridLastCheck}
                listRuleCompare={listRuleCompare}
                setListLogicMulti={setListLogicMulti}
                listLogicMulti={listLogicMulti}
                dataDetail={dataDetail}
                isCheckShowDataMaster={isCheckShowDataMaster}
                setIsCheckShowDataMaster={setIsCheckShowDataMaster}
                valueIsMaster={valueIsMaster}
              />
            </>
          }
        </Row>

        <div style={{ marginTop: 15 }}>
          {time > 0 &&
            <Row style={{ justifyContent: "flex-end" }}><span>{time > 0 ? `Thời gian còn lại: ${formatTime(time)}` : "Hết thời gian"} </span></Row>
          }
          <TableLastCheck
            dataLastCheck={!isSortData ? dataLastCheck : newDataTable}
            loadingTable={loadingTable}
            listNoCheckLogic={listNoCheckLogic}
            form={form}
            isHaveGrid={isHaveGrid}
            setIsCheckLogic={setIsCheckLogic}
            dataGridLastCheck={dataGridLastCheck}
            dataPumb={dataPumb}
          />

        </div>

        {dataGridLastCheck.length > 0 &&
          <TableGridLastCheck
            dataGridLastCheck={dataGridLastCheck}
            formGrid={formGrid}
            listIndexLogicGrid={listIndexLogicGrid}
            setLoadingTableGrid={setLoadingTableGrid}
            loadingTableGrid={loadingTableGrid}
            dataPumb={dataPumb}
            setIsCheckLogic={setIsCheckLogic}
          />
        }

        {dataDetail &&
          <ButtonSubmitLC
            isOpenModalSubmit={isOpenModalSubmit}
            setIsOpenModalSubmit={setIsOpenModalSubmit}
            onFinish={onFinish}
            loadingBtnSubmit={loadingBtnSubmit}
            isCheckLogic={isCheckLogic}
            listNoCheckLogic={listNoCheckLogic}
            listNotQualified={listNotQualified}
            dataQA={isOpenModalSubmit ? document.getElementById("textQA").value : dataQA}
            dataGridLastCheck={dataGridLastCheck}
            dataDetail={dataDetail}
            isCheckShowDataMaster={isCheckShowDataMaster}
            dataPumb={dataPumb}
            dataLastCheck={dataLastCheck}
            setListNotQualified={setListNotQualified}
            form={form}
            setDataLastCheck={setDataLastCheck}
          />
        }
      </Col>
      {modalShortcut &&
        <ModalShortcut
          modalShortcut={modalShortcut}
          handleCloseModalShortcut={handleCloseModalShortcut}
        />
      }
    </Row>
  )
}

export default LastCheck