import { Button } from "antd";
import { useState } from "react";
import ModalViewUser from "../modal/ModalViewUser";
import PropTypes from "prop-types";

const ButtonViewInforUser = ({ dataDetail }) => {
  const [isOpenModalViewUser, setIsOpenModalViewUser] = useState(false);
  const showModalInfor = () => {
    setIsOpenModalViewUser(true);
  };
  return (
    <>
      <Button style={{ width: "70%" }} onClick={showModalInfor}>
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
