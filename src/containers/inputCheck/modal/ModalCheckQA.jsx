import { Button, Modal, Row } from "antd";
import PropTypes from "prop-types";

const ModalCheckQA = ({
  isOpenModalCheckQA,
  onFinish,
  setIsOpenModalCheckQA,
}) => {
  const handleCancel = () => {
    setIsOpenModalCheckQA(false);
  };

  return (
    <Modal
      className="modal-check-QA"
      open={isOpenModalCheckQA}
      onCancel={handleCancel}
      footer={false}
      maskClosable={false}
      style={{ padding: "2%" }}
      closeIcon={false}
    >
      <div style={{ marginTop: "3%" }}>
        <Row
          style={{
            padding: "0% 0% 5%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 600, color: "#25355B" }}>
            Bạn có chắc muốn submit phiếu này ?
          </span>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "flex-end",
            columnGap: "2ch",
          }}
        >
          <Button onClick={handleCancel}>CANCEL</Button>
          <Button id="btn-submit-qa" onClick={onFinish} type="primary">
            SUBMIT
          </Button>
        </Row>
      </div>
    </Modal>
  );
};

ModalCheckQA.propTypes = {
  isOpenModalCheckQA: PropTypes.any,
  onFinish: PropTypes.func,
  setIsOpenModalCheckQA: PropTypes.any,
};

export default ModalCheckQA;
