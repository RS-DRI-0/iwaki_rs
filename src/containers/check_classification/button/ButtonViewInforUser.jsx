import { Button } from "antd";
import React, { useState } from "react";
import ModalViewUser from "../modal/ModalViewUser";
import PropTypes from "prop-types";

const ButtonViewInforUser = ({ dataDetail }) => {
  const [isOpenModalViewUser, setIsOpenModalViewUser] = useState(false);
  const showModalInfor = () => {
    setIsOpenModalViewUser(true);
  };
  return (
    <>
      <Button
        // style={{ width: "10%", marginLeft: 10, height: "3vh" }}
        style={{ marginLeft: 10}}
        onClick={showModalInfor}
        size="middle"
      >
        View Infor User
      </Button>
      {isOpenModalViewUser === true ? (
        <ModalViewUser
          open={isOpenModalViewUser}
          setIsOpenModalViewUser={setIsOpenModalViewUser}
          dataDetail={dataDetail}
        />
      ) : null}
    </>
  );
};

ButtonViewInforUser.propTypes = {
  dataDetail: PropTypes.any,
};

export default ButtonViewInforUser;
