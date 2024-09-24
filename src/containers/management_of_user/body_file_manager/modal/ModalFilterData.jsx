/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { localhost } from "../../../../server";
import IconSearch from "../../../custom_icon_input/IconSearch";
import language from "../../../../language.json";
import { authAxios } from "../../../../api/axiosClient";
import PropTypes from "prop-types";

const { Option } = Select;

const ModalFilterData = (
  {
    pager,
    open,
    setOpenModalFilter,
    fetchListData,
    setFieldFilter,
    form,
    chooseLanguage
  }
) => {
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const [listPumb, setListPumb] = useState([])
  const listStatus = [
    {
      id: 0,
      name: language[chooseLanguage].processing
    },
    {
      id: 1,
      name: language[chooseLanguage].completed
    },
    {
      id: 2,
      name: language[chooseLanguage].verified
    },
  ]

  const fetchListPumb = async () => {
    await authAxios().get(`${localhost}/get_list_pump`,
      {
        params: {
          user_role: inforUser.user_role
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(res => {
      setListPumb(res.data.list_pumb)
    }).catch(err => {
      console.log(err)
    })
  }

  const handleCancel = () => {
    // form.resetFields()
    setOpenModalFilter(false);
  };
  const onFinish = (values) => {
    const dataSearch = {
      id_user: inforUser.user_id,
      page_index: 1,
      page_size: pager.pageSize,

      upload_date:
        values.date !== null ? dayjs(values.date).format("YYYY-MM-DD") : "",
      input_search: values.search !== undefined ? values.search : "",
      pump_id:
        values.pumb_type !== undefined && values.pumb_type.length > 0
          ? "(" + values.pumb_type + ")"
          : "",
      pack_status:
        values.status !== undefined && values.status.length > 0
          ? "(" + values.status + ")"
          : "",

      is_search: "1",
      pack_id: "",
      tb_package: "",
    };
    setOpenModalFilter(false);
    fetchListData(dataSearch);
    setFieldFilter(dataSearch);
  };

  useEffect(() => {
    fetchListPumb();
  }, []);

  const [contentNotiDate, setContentNotiDate] = useState()

  const functionCheckValueDate = (value) => {
    if (value === null) {
      setContentNotiDate(language[chooseLanguage].notification_date)
    } else {
      setContentNotiDate(null)
    }
  }
  const changeDateFrom = (value) => {
    functionCheckValueDate(value)
  }

  useEffect(() => {
    functionCheckValueDate(form.getFieldValue("date"))
  }, []);

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      style={{ top: 20 }}
      footer={false}
      className="modal-of-file-manager"
    >
      <Form
        form={form}
        name="control-hooks"
        layout="vertical"
        className="form-file-manager"
        onFinish={onFinish}
      >
        <div style={{ border: "1px solid #94A3B8", marginTop: "10%" }}>
          <div
            style={{ padding: "6% 10% 10%", display: "grid", rowGap: "2ch" }}
          >
            <Col span={24}>
              <Form.Item
                name="date"
                label={<span>{language[chooseLanguage].date}</span>}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format={"DD-MM-YYYY"}
                  placeholder={language[chooseLanguage].date}
                  onChange={(e) => changeDateFrom(e)}
                  allowClear={true}
                  size="large"
                />

              </Form.Item>
              <span style={{fontSize: 10, color: "#1d63b4"}}>{contentNotiDate}</span>
              {/* <span id="content"></span> */}
            </Col>

            <Col span={24}>
              <Form.Item
                name="pumb_type"
                label={<span>{language[chooseLanguage].pump_type}</span>}
              >
                <Select
                  optionFilterProp="children"
                  placeholder={language[chooseLanguage].pump_type}
                  allowClear={true}
                  mode="multiple"
                  maxTagCount={"responsive"}
                  size="large"
                >
                  {listPumb.map((item, index) => (
                    <Option key={item} value={item.pumb_id}>
                      {item.pumb_model}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="status"
                label={<span>{language[chooseLanguage].status}</span>}
              >
                <Select
                  optionFilterProp="children"
                  placeholder={language[chooseLanguage].status}
                  allowClear={true}
                  mode="multiple"
                  maxTagCount={"responsive"}
                  size="large"
                >
                  {listStatus.map((item, index) => (
                    <Option key={item} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="search"
                label={<span>{language[chooseLanguage].search}</span>}
              >
                <Input
                  suffix={<IconSearch />}
                  size="large"
                  placeholder={language[chooseLanguage].search}
                ></Input>
              </Form.Item>
            </Col>
          </div>
        </div>
        <Row className="btn-filter-data">
          <Col span={24}>
            <Button onClick={handleCancel} style={{ color: "#394B76" }}>
              {language[chooseLanguage].cancel}
            </Button>
          </Col>
          <Col span={24}>
            <Button
              style={{ color: "#fff", background: "#0C4DA2" }}
              htmlType="submit"
            >
              {" "}
              {language[chooseLanguage].ok}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

ModalFilterData.propTypes = {
  pager: PropTypes.shape({
    pageSize: PropTypes.number.isRequired,

  }),

  open: PropTypes.bool,
  setOpenModalFilter: PropTypes.func,
  fetchListData: PropTypes.func,
  setFieldFilter: PropTypes.func,
  form: PropTypes.shape({
    getFieldsValue: PropTypes.func,
    setFieldValue: PropTypes.func,
    getFieldValue: PropTypes.func,
    setFieldsValue: PropTypes.func,
  }),
  chooseLanguage: PropTypes.string,
}


export default ModalFilterData;
