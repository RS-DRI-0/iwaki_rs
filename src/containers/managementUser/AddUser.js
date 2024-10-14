import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import { Button, Col, Form, Input, Modal, Row, TreeSelect } from "antd";
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from "prop-types";
import fileLanguage from "../../language.json";

const AddUser = ({
  onFinishAdd,
  showDrawerAddUser,
  openDrawerAddUser,
  chooseLanguage,
}) => {
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
    const forbiddenChars = [
      "<",
      ">",
      ":",
      "?",
      '"',
      "'",
      ".",
      "&",
      "/",
      ";",
      " ",
    ];
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
        new Error(fileLanguage[chooseLanguage].please_enter_a_valid_input)
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
            <h2>{fileLanguage[chooseLanguage].add_user}</h2>
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
                  message: fileLanguage[chooseLanguage].please_enter_id_code,
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
                maxLength={50}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="user_name"
              label={fileLanguage[chooseLanguage].user_name}
              className="modal-user-form-item"
              rules={[
                {
                  required: true,
                  message: fileLanguage[chooseLanguage].please_enter_user_name,
                },
                { validator: handleValidateSpaces },
              ]}
            >
              <Input
                placeholder={fileLanguage[chooseLanguage].user_name}
                size="large"
                autoComplete="off"
                onKeyDown={handleKeyPress}
                onPaste={handlePaste}
                maxLength={50}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="user_role_title"
              label={fileLanguage[chooseLanguage].role}
              className="modal-user-form-item"
              rules={[
                {
                  required: true,
                  message: fileLanguage[chooseLanguage].please_choose_a_role,
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
                placeholder={fileLanguage[chooseLanguage].role}
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
                background: "#053457",
              }}
              type="primary"
              htmlType="submit"
            >
              {fileLanguage[chooseLanguage].save}
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
  chooseLanguage: PropTypes.any,
};

export default AddUser;
