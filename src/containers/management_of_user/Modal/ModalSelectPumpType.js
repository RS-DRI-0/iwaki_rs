import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Select, notification } from "antd";
import language from "../../../language.json";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { authAxios } from "../../../api/axiosClient";
import { localhost } from "../../../server";

const ModalSelectPumpType = ({
  showModalSelectPumpType,
  handleCancelModalSelectPumpType,
  handleChangeSelectOptions,
  fileLanguage,
  items2,
  iconArrowDropDown,
}) => {
  const chooseLanguage = sessionStorage.getItem("choosedLanguage");
  const [items, setItems] = useState([]);
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const checkMachineBeforeChangeCamera = async () => {
    const callMachine = sessionStorage.getItem("OptionMachine");
    if (callMachine === null || callMachine === undefined) {
      notification.destroy();
      notification.error({
        message: fileLanguage[chooseLanguage].please_select_the_machine_code,
        // description: "Vui lòng chọn mã máy",
        placement: "topRight",
      });
    } else {
      window.location.href = "/CaptureCamera";
    }
  };
  const fetchListPumb = async () => {
    await authAxios()
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
        setItems(res.data.list_pumb);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchListPumb();
  }, []);

  return (
    <Modal
      // width="328px"
      open={showModalSelectPumpType}
      footer={null}
      centered
      // title="Select the pump type code"
      className="container-modal-view-detail ModalConfirm"
    // onCancel={handleCancelModalSelectPumpType}
    >
      <Row>
        <Row className="container-header-view-detail" style={{ width: "100%" }}>
          <Col span={4} offset={20} style={{ textAlign: "-webkit-right" }}>
            <Button
              className="btn-view-detail"
              onClick={handleCancelModalSelectPumpType}
            >
              <CloseOutlined />
            </Button>
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <span style={{ color: "#337AEE", fontWeight: 700, fontSize: 16 }}>
              {language[chooseLanguage].choose_pump_type}:
            </span>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <Col span={24} style={{ padding: "5% 12% 3%" }}>
            <Select
              placeholder={fileLanguage[chooseLanguage].machine_code}
              value={
                items2 !== null && items2 !== undefined
                  ? items2.pumb_model
                  : null
              }
              style={{ width: "100%", height: "40px" }}
              onChange={handleChangeSelectOptions}
              suffixIcon={
                <span className="spanSuffixIconDropdown">
                  <img
                    style={{ overflow: "unset" }}
                    className="iconDropDownSelect"
                    src={iconArrowDropDown}
                    alt=""
                  />
                </span>
              }
            >
              {items.map((item) => (
                <Select.Option
                  className="optionKeyItem"
                  key={item.pumb_id}
                  value={item.pumb_model}
                  is_multi={item.is_multi}
                  lv1_fields={item.lv1_fields}
                  lv3_fields={item.lv3_fields}
                  lv1_others={item.lv1_others}
                  lv3_others={item.lv3_others}
                >
                  <span className="spanOptionKeyItem">{item.pumb_model}</span>
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row style={{ width: "100%", padding: "3% 5%" }}>
          <Button
            onClick={checkMachineBeforeChangeCamera}
            size="large"
            style={{
              width: "100%",
              background: "#0C4DA2",
              color: "#DFE0E2",
              fontWeight: 700,
            }}
          >
            {language[chooseLanguage].ok_for_capture}
          </Button>
        </Row>
      </Row>
    </Modal>
  );
};

ModalSelectPumpType.propTypes = {
  showModalSelectPumpType: PropTypes.bool,
  // items: PropTypes.array,
  handleCancelModalSelectPumpType: PropTypes.func,
  handleChangeSelectOptions: PropTypes.func,
  iconArrowDropDown: PropTypes.string,

  fileLanguage: PropTypes.arrayOf(
    PropTypes.shape({
      machine_code: PropTypes.string,
      please_select_the_machine_code: PropTypes.string,
    })
  ),
  items2: PropTypes.shape({
    pumb_model: PropTypes.string,
  })
}


export default ModalSelectPumpType;
