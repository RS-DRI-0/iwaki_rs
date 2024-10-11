import { useEffect, useState } from "react";
import FileManager from "./body_file_manager/FileManager";
import HeaderManager from "./HeaderManager";
import FooterFileManager from "./FooterFileManager";
import PageNotification from "./page_notification/PageNotification";
import { authAxios } from "../../api/axiosClient";
import { localhost } from "../../server";
import PriorityIcon from "../../images/file_manager/PriorityIcon.svg";
import IconStatusQualified from "../../images/file_manager/IconStatusQualifiedFooter.svg";
import IconPumbType from "../../images/file_manager/IconPumbType.svg";
import IconNameOrder from "../../images/file_manager/IconNameOrder.svg";
import dayjs from "dayjs";
import { Col, Form, message, notification, Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const ContainerFileManager = () => {
  const [chooseLanguage, setChooseLanguage] = useState(
    sessionStorage.getItem("choosedLanguage") !== null
      ? sessionStorage.getItem("choosedLanguage")
      : "japanese"
  );
  const [checkNoti, setCheckNoti] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [listStatus, setListStatus] = useState([]);
  const [dataNotification, setDataNotification] = useState([]);
  const [countNotification, setCountNotification] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [valueIsSort, setValueIsSort] = useState(false)
  const [pager, setPager] = useState({
    pageSize: 5,
    count: 0,
    current: 1,
  });
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const [form] = Form.useForm();

  const fetchListData = (params, valueSort) => {
    const FormData = require("form-data");
    let data = new FormData();
    data.append("id_user", params.id_user);
    data.append("page_index", params.page_index);
    data.append("page_size", params.page_size);
    data.append("upload_date", params.upload_date);

    data.append("input_search", params.input_search);
    data.append("pump_id", params.pump_id);
    data.append("is_search", params.is_search);
    data.append("pack_status", params.pack_status);
    data.append("user_role", inforUser.user_role);
    data.append("is_sort", valueSort !== undefined ? valueSort : !valueIsSort ? 0 : 1);

    data.append("pack_id", "");
    data.append("tb_package", "");
    
    authAxios()
      .post(`${localhost}/list_file`, data)
      .then((res) => {
        setPager({
          current: params.page_index,
          pageSize: params.page_size,
          count: Number(res.data.list_count),
        });
        setDataSource(res.data.list_file);
        setListStatus(res.data.list_status[0]);
        setLoadingPage(false);
      })
      .catch((err) => {
        setLoadingPage(false);
      });
  };

  useEffect(() => {
    // if (window.orientation === 90 || window.orientation === -90) {
    //   setRotatePhone(true);
    // } else {
    //   setRotatePhone(false);
    // }
    // fetchCountNotification()
    if (form.getFieldValue("date") === undefined) {
      form.setFieldsValue({
        date: dayjs(),
      });
    }
    if (dataNotification.length === 0) {
      // fetchCountNotification()
      // setLoadingPage(true)
      const id = setInterval(() => {
        fetchListData(functionSetData(dayjs().format("YYYY-MM-DD")));

        clearInterval(id);
      }, 300);
      return () => clearInterval(id);
    } else {
      setPager((prev) => ({ ...prev, count: 1 }));
    }
  }, []);

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

  return (
    <div style={{ height: "100svh", position: "relative" }}>
      <HeaderManager
        checkNoti={checkNoti}
        setChooseLanguage={setChooseLanguage}
        chooseLanguage={chooseLanguage}
        setCheckNoti={setCheckNoti}
        countNotification={countNotification}
        setCountNotification={setCountNotification}
      />
      {checkNoti ? (
        <PageNotification
          chooseLanguage={chooseLanguage}
          setListStatus={setListStatus}
          setCheckNoti={setCheckNoti}
          setDataSource={setDataSource}
          setPager={setPager}
        />
      ) : (
        <>
          <FileManager
            chooseLanguage={chooseLanguage}
            setListStatus={setListStatus}
            dataNotification={dataNotification}
            setDataNotification={setDataNotification}
            setCheckNoti={setCheckNoti}
            loadingPage={loadingPage}
            setValueIsSort = {setValueIsSort}
            valueIsSort = {valueIsSort}
            inforUser={inforUser}
            pager={pager}
            setPager={setPager}
            fetchListData={fetchListData}
            dataSource={dataSource}
            form={form}
          />
          <FooterFileManager listStatus={listStatus} />
        </>
      )}
    </div>
  );
};

export default ContainerFileManager;
