import { Button, Col, Form, Input, Modal, Row, Tag } from "antd";
import React from "react";
import PropTypes from "prop-types";

const ModalQA = ({
  openModalQA,
  handleCloseModalQA,
  loadingTable,
  loadingBtnSubmit,
  handleSubmitModalQA,
  valueQA,
  handleChangeModalQA,
}) => {
  const checkValueQA = valueQA === undefined || valueQA.length === 0;
  return (
    <Modal
      title="Modal Q&A"
      open={openModalQA}
      onCancel={handleCloseModalQA}
      footer={null}
      width="30%"
      centered
    >
      <Row>
        <Col span={24}>
          <Form.Item
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Q&A&nbsp;</span>
                <span style={{ color: "red" }}>*</span>
              </div>
            }
            name="qa_content"
          >
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 5 }}
              status={checkValueQA ? "error" : ""}
              placeholder="Q&A"
              onChange={(e) => handleChangeModalQA(e)}
            />
            <div style={{ display: "table-caption" }}>
              <Tag
                color="rgb(255 131 69)"
                style={{ marginTop: 5, fontSize: 14 }}
              >
                原票がはっきり見えない: 1
              </Tag>
              <Tag
                color="rgb(255 131 69)"
                style={{ marginTop: 5, fontSize: 14 }}
              >
                ※特注要素・備考: ご自身でご確認ください。: 2
              </Tag>
            </div>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button
            id="btn"
            disabled={loadingTable}
            loading={loadingBtnSubmit}
            style={
              loadingBtnSubmit === true
                ? {
                    width: 85,
                    float: "right",
                    marginTop: "1%",
                  }
                : {
                    float: "right",
                    marginTop: "1%",
                    fontWeight: "bold",
                  }
            }
            type="primary"
            onClick={handleSubmitModalQA}
          >
            {loadingBtnSubmit === true ? "" : "SUBMIT"}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

ModalQA.propTypes = {
  openModalQA: PropTypes.bool,
  handleCloseModalQA: PropTypes.func,
  loadingTable: PropTypes.bool,
  loadingBtnSubmit: PropTypes.bool,
  handleSubmitModalQA: PropTypes.func,
  valueQA: PropTypes.bool,
  handleChangeModalQA: PropTypes.func,
};

export default ModalQA;
