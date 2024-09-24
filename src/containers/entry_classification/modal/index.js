import { Button, Col, Modal, Row } from "antd";
import React from "react";
import PropTypes from "prop-types";

const ShowModalDetailEntry = ({
  isShowModalDetail,
  setIsShowModalDetail,
  valueSecondImgBase64,
}) => {
  return (
    <Modal
      //   className="ModalViewImageSelect"
      //   wrapClassName="wrapModalViewImageSelect"
      open={isShowModalDetail}
      closable={false}
      footer={null}
      style={{ top: "30px" }}
      width="40%"
    >
      <Row>
        <Col span={24} style={{ height: "80svh" }}>
          <img
            alt="Red dot"
            src={valueSecondImgBase64}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          ></img>
        </Col>
        <Col span={24} style={{ paddingTop: 10 }}>
          <Button
            style={{
              background: "#053457",
              justifyContent: "center",
              color: "#fff",
              width: "100px",
              marginTop: 10,
              display: "flex",
              margin: "auto",
            }}
            onClick={() => setIsShowModalDetail(false)}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

ShowModalDetailEntry.propTypes = {
  isShowModalDetail: PropTypes.bool,
  setIsShowModalDetail: PropTypes.any,
  valueSecondImgBase64: PropTypes.any,
};

export default ShowModalDetailEntry;
