import { Col, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import "../InsertInformationCheck.css";
import { localhost } from "../../../server";
import { authAxios } from "../../../api/axiosClient";
import PropTypes from "prop-types";

const ModalViewUser = ({ open, setIsOpenModalViewUser, dataDetail }) => {
  const [dataInforUser, setDataInforUser] = useState();
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const handleCancel = () => {
    setIsOpenModalViewUser(false);
  };

  const fetchInforUser = () => {
    const FormData = require("form-data");
    let data = new FormData();
    data.append("e1_user", dataDetail.e1_user);
    data.append("e2_user", dataDetail.e2_user);
    data.append("user_role", inforUser.user_role);

    authAxios()
      .post(`${localhost}/check_user_details`, data)
      .then((res) => {
        setDataInforUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchInforUser();
  }, []);

  return (
    <Modal footer={false} open={open} onCancel={handleCancel} width={500}>
      {dataInforUser && (
        <Row className="container-infor-user">
          <Col span={12}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "#0C4DA2",
                textAlign: "center",
              }}
            >
              ENTRY 1
            </span>
            <Input
              readOnly
              defaultValue={dataInforUser.user1_info[0].user_fullname}
            ></Input>
            <Input
              readOnly
              defaultValue={dataInforUser.user1_info[0].user_msnv}
            ></Input>
            <Input
              readOnly
              defaultValue={dataInforUser.user1_info[0].user_name}
            ></Input>
            <Input
              readOnly
              defaultValue={dataInforUser.user1_info[0].user_center}
            ></Input>
            <Input readOnly defaultValue={dataDetail.e1_date}></Input>
          </Col>
          <Col span={12}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "#0C4DA2",
                textAlign: "center",
              }}
            >
              ENTRY 2
            </span>
            <Input
              readOnly
              value={dataInforUser.user2_info[0].user_fullname}
            ></Input>
            <Input
              readOnly
              value={dataInforUser.user2_info[0].user_msnv}
            ></Input>
            <Input
              readOnly
              value={dataInforUser.user2_info[0].user_name}
            ></Input>
            <Input
              readOnly
              value={dataInforUser.user2_info[0].user_center}
            ></Input>
            <Input readOnly value={dataDetail.e2_date}></Input>
          </Col>
        </Row>
      )}
    </Modal>
  );
};

ModalViewUser.propTypes = {
  setIsOpenModalViewUser: PropTypes.func,
  open: PropTypes.bool,
  dataDetail: PropTypes.shape({
    e1_user: PropTypes.string,
    e2_user: PropTypes.string,
    e1_date: PropTypes.string,
    e2_date: PropTypes.string,
  }),
};

export default ModalViewUser;
