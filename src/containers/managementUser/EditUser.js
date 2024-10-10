import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Button, Col, Form, Input, Modal, Row, Select, TreeSelect } from "antd";
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from "prop-types";

const EditUser = ({
  onFinishEdit,
  showDrawerEditUser,
  openDrawerEditUser,
  valueEdit,
}) => {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(false);
  const treeData = [
    {
      value: "STAFF+1+0+0",
      title: <span style={{ fontWeight: 800 }}>STAFF</span>,
    },
  ];

  const handleKeyPress = (event) => {
    const forbiddenChars = ["<", ">", ":", "?", '"', "'", ".", "&", "/", ";"];
    if (forbiddenChars.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (openDrawerEditUser) {
      form.resetFields();
      const checkIsActive = valueEdit.is_active === 1;
      setIsActive(checkIsActive);
      const test =
        valueEdit.user_role_title +
        "+" +
        valueEdit.user_role +
        "+" +
        valueEdit.user_lvl +
        "+" +
        valueEdit.user_pair;
      form.setFieldsValue({
        user_center: valueEdit.user_center,
        user_fullname: valueEdit.user_fullname,
        user_msnv: valueEdit.user_msnv,
        user_role_title: test,
        Id: valueEdit.Id,
        user_name: valueEdit.user_name,
      });
    }
  }, [form, openDrawerEditUser, valueEdit]);

  const handleValidateSpaces = (rule, value) => {
    if (!value || value.trim() === "") {
      return Promise.reject(
        new Error("Please enter a valid input (no spaces only).")
      );
    }
    return Promise.resolve(); // Success
  };

  return (
    <Modal
      width="40%"
      className="ModalViewImage"
      open={openDrawerEditUser}
      closable={false}
      footer={null}
      style={{
        top: "60px",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Form
        form={form}
        onFinish={onFinishEdit}
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        <Row>
          <Col span={12}>
            <h2>Edit User</h2>
          </Col>
          <Col span={12} style={{ margin: "auto", textAlign: "end" }}>
            <IconButton onClick={() => showDrawerEditUser(false)}>
              <CancelIcon />
            </IconButton>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="user_msnv"
              label="ID"
              className="modal-user-form-item"
              rules={[
                {
                  required: true,
                  message: "Please enter ID code!",
                },
                { validator: handleValidateSpaces },
              ]}
            >
              <Input
                placeholder="ID"
                size="large"
                autoComplete="off"
                onKeyDown={handleKeyPress}
                onPaste={handlePaste}
                readOnly={isActive}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="user_name"
              label="User Name"
              className="modal-user-form-item"
              rules={[
                {
                  required: true,
                  message: "Please enter User Name!",
                },
                { validator: handleValidateSpaces },
              ]}
            >
              <Input
                placeholder="User Name"
                size="large"
                autoComplete="off"
                onKeyDown={handleKeyPress}
                onPaste={handlePaste}
                readOnly
              ></Input>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="user_role_title"
              label="Role"
              className="modal-user-form-item"
              rules={[
                {
                  required: true,
                  message: "Please choose a Role!",
                },
              ]}
            >
              <TreeSelect
                size="large"
                style={{
                  width: "100%",
                }}
                value={treeData}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: "auto",
                }}
                placeholder="Role"
                allowClear
                treeDefaultExpandAll
                treeData={treeData}
                disabled={isActive}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button
              id="btn-submit"
              style={{
                float: "right",
                marginTop: "1%",
                fontWeight: "bold",
              }}
              type="primary"
              htmlType="submit"
              disabled={isActive}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

EditUser.propTypes = {
  onFinishEdit: PropTypes.func,
  showDrawerEditUser: PropTypes.func,
  openDrawerEditUser: PropTypes.bool,
  valueEdit: PropTypes.any,
};

export default EditUser;
