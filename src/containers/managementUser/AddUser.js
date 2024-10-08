import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import { Button, Col, Form, Input, Modal, Row, Select, TreeSelect } from "antd";
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from "prop-types";

const AddUser = ({ onFinishAdd, showDrawerAddUser, openDrawerAddUser }) => {
  const [form] = Form.useForm();

  const treeData = [
    {
      value: "STAFF+1+0+0",
      title: <span style={{ fontWeight: 800 }}>STAFF</span>,
    },
  ];

  const handleCancelAddUser = () => {
    form.resetFields();
    showDrawerAddUser(false);
  };

  const onChange = (newValue) => {};

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
    if (openDrawerAddUser === true) {
      form.resetFields();
    }
  }, [openDrawerAddUser, form]);

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
      open={openDrawerAddUser}
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
        onFinish={onFinishAdd}
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        <Row>
          <Col span={12}>
            <h2>Add User</h2>
          </Col>
          <Col span={12} style={{ margin: "auto", textAlign: "end" }}>
            <IconButton onClick={handleCancelAddUser}>
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
                onChange={onChange}
                treeData={treeData}
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
            >
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

AddUser.propTypes = {
  onFinishAdd: PropTypes.func,
  showDrawerAddUser: PropTypes.func,
  openDrawerAddUser: PropTypes.bool,
};

export default AddUser;
