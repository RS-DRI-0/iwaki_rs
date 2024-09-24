import { Modal, Table } from "antd";
import React from "react";
import { dataShortcut } from "./data";
import PropTypes from "prop-types";

const ModalShortcut = ({ modalShortcut, handleCloseModalShortcut }) => {
  const columnsShortcut = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      align: "center",
      ellipsis: true,
      width: 80,
    },
    {
      title: "Phím tắt",
      dataIndex: "shortcut",
      key: "shortcut",
      ellipsis: true,
      // width: 40,
    },
    {
      title: "Nội dung",
      dataIndex: "shortcutName",
      key: "shortcutName",
      ellipsis: true,
      // width: 40,
    },
  ];
  return (
    <Modal
      open={modalShortcut}
      onCancel={handleCloseModalShortcut}
      centered
      title={"Thông tin phím tắt"}
      width="50%"
      className="modal-shortcut"
      footer={false}
    >
      <Table
        columns={columnsShortcut}
        dataSource={dataShortcut}
      />
    </Modal>
  );
};

ModalShortcut.propTypes = {
  modalShortcut: PropTypes.bool,
  handleCloseModalShortcut: PropTypes.func,
};

export default ModalShortcut;
