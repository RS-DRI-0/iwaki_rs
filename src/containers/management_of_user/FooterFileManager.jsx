import { useState, useEffect } from "react";
import { Row, Col, notification } from "antd";
import IconCamera from "../../images/file_manager/iconCamera.svg";
import IconStatusQualifiedFooter from "../../images/file_manager/IconStatusQualifiedFooter.svg";
import IconStatusNotQualifiedFooter from "../../images/file_manager/IconStatusNotQualifiedFooter.svg";
import IconStatusImgNotGoodFooter from "../../images/file_manager/IconStatusImgNotGoodFooter.svg";
import IconStatusProcessingFooter from "../../images/file_manager/IconStatusProcessingFooter.svg";
import iconArrowDropDown from "../../images/arrowDropDown.svg";

import fileLanguage from "../../language.json";
import ModalSelectPumpType from "./Modal/ModalSelectPumpType.js";
import PropTypes from "prop-types";

const FooterFileManager = ({ listStatus }) => {
  const [showModalSelectPumpType, setShowModalSelectPumpType] = useState(false);
  const [rotatePhone, setRotatePhone] = useState(false);
  const [items2, setItems2] = useState(
    JSON.parse(sessionStorage.getItem("OptionMachine"))
  );
  const [chooseLanguage, setChooseLanguage] = useState(
    sessionStorage.getItem("choosedLanguage") !== null &&
      sessionStorage.getItem("choosedLanguage") !== undefined
      ? sessionStorage.getItem("choosedLanguage")
      : "japanese"
  );
  const showQuantity = (index) => {
    if (listStatus !== undefined) {
      return listStatus[index];
    } else {
      return 0;
    }
  };

  const showModalChoosePumb = () => {
    setShowModalSelectPumpType(true);
  };

  const handleChangeSelectOptions = (value, key) => {
    const myObject = {
      pumb_id: key.key,
      pumb_model: key.value,
      is_multi: key.is_multi,
      lv1_fields: key.lv1_fields,
      lv3_fields: key.lv3_fields,
      lv1_others: key.lv1_others,
      lv3_others: key.lv3_others,
    };
    setItems2(myObject);
    sessionStorage.setItem("OptionMachine", JSON.stringify(myObject));
  };


  useEffect(() => {
    const getLanguage = sessionStorage.getItem("choosedLanguage");
    if (getLanguage !== null && getLanguage !== undefined) {
      setChooseLanguage(getLanguage);
    } else {
      setChooseLanguage("japanese");
      sessionStorage.setItem("choosedLanguage", "japanese");
    }
    checkRotatePhone();
  }, []);

  const checkMachineBeforeChangeCamera = async () => {
    const callMachine = sessionStorage.getItem("OptionMachine");
    if (callMachine === null || callMachine === undefined) {
      notification.destroy();
      notification.error({
        message: fileLanguage[chooseLanguage].please_select_the_machine_code,
        placement: "topRight",
      });
    } else {
      window.location.href = "/CaptureCamera";
    }
  };
  const handleCancelModalSelectPumpType = () => {
    setShowModalSelectPumpType(false);
  };

  const checkRotatePhone = () => {
    if (window.orientation === 90 || window.orientation === -90) {
      setRotatePhone(true);
    } else {
      setRotatePhone(false);
    }
  };
  useEffect(() => {
    window.addEventListener("orientationchange", function () {
      checkRotatePhone();
    });
  }, []);

  return (
    <div
      className="container-footer-file-manager"
      style={{ bottom: rotatePhone === true ? "unset" : 0 }}
    >
      <Row>
        <Col span={7} offset={1}>
          <Col className="bg-text-status">
            ({showQuantity(1)}) &nbsp;{" "}
            <img src={IconStatusQualifiedFooter} alt=""></img>
          </Col>
          <Col className="bg-text-status">
            ({showQuantity(2)}) &nbsp;
            <img src={IconStatusNotQualifiedFooter} alt=""></img>
          </Col>
        </Col>
        <Col span={8} className="col-icon-camera">
          <button onClick={showModalChoosePumb} className="bg-around-camera-icon" aria-label="btn-camera">
            <img src={IconCamera} alt=""></img>
          </button>
        </Col>
        <Col
          span={7}
          style={{
            justifyContent: "flex-end",
          }}
        >
          <Col className="bg-text-status">
            ({showQuantity(3)}) &nbsp;
            <img src={IconStatusImgNotGoodFooter} alt=""></img>
          </Col>
          <Col className="bg-text-status">
            ({showQuantity(0)}) &nbsp;
            <img src={IconStatusProcessingFooter} alt=""></img>
          </Col>
        </Col>
      </Row>
      {showModalSelectPumpType === true ? (
        <ModalSelectPumpType
          showModalSelectPumpType={showModalSelectPumpType}
          handleCancelModalSelectPumpType={handleCancelModalSelectPumpType}
          handleChangeSelectOptions={handleChangeSelectOptions}
          fileLanguage={fileLanguage}
          chooseLanguage={chooseLanguage}
          // items={items}
          items2={items2}
          iconArrowDropDown={iconArrowDropDown}
          checkMachineBeforeChangeCamera={checkMachineBeforeChangeCamera}
        />
      ) : null}
    </div>
  );
};

FooterFileManager.propTypes = {
  listStatus: PropTypes.any,
}

export default FooterFileManager;
