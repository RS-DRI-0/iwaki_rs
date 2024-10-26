import "../Layout.css";
import PropTypes from "prop-types";
import { authAxios } from "../../api/axiosClient";
import { localhost } from "../../server";
import { CloseOutlined } from "@ant-design/icons";
import { Col, message, Row } from "antd";
import { useState, useEffect, useRef } from "react";
import PriorityIcon from "../../images/file_manager/PriorityIcon.svg";
import IconStatusQualified from "../../images/file_manager/IconStatusQualifiedFooter.svg";
import IconStatusING from "../../images/file_manager/IconStatusImgNotGoodFooter.svg";
import IconStatusNotQualified from "../../images/file_manager/IconStatusNotQualifiedFooter.svg";
import IconPumbType from "../../images/file_manager/IconPumbType.svg";
import IconLocation from "../../images/file_manager/IconLocation.svg";

const CustomLayoutFC = ({ children }) => {
  const listPath = ["/CaptureCamera", "/", "/notification"]
  return (
    <div className="container-fluid" style={{ maxWidth: "100%" }}>
      {listPath.includes(window.location.pathname) &&
        <NotificationSuccess />
      }
      {children}
    </div>
  );
};

const NotificationSuccess = () => {
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const [messageApi, contextHolder] = message.useMessage();
  const [listNotifi, setListNotifi] = useState([])

  const closeMessage = () => {

    messageApi.destroy()
    let newArr = listNotifi
    if (newArr.length > 0) {

      setTimeout(() => {
        functionNotifi(newArr[0].vl_mfg, newArr[0].vl_pumpname, newArr[0].vl_scanno, newArr[0].vl_prioriti, newArr[0].vl_status)
        newArr.shift()
        setListNotifi(newArr)
      }, 200)
    } else {
      const checkUpload = sessionStorage.getItem("check_upload")
      if (checkUpload === "false") {
        fecthApiNotification()
      }
    }
  }

  const functionSound = () => {
    // myaudio.src = "./audio/notification_ding.mp3"
    // myaudio.typeof = "audio/mp3"
    // myaudio.play()

    const audio = document.getElementById('audio');
    audio.src = "./audio/notification_ding.mp3"
    audio.typeof = "audio/mp3"
    // audio.play()
  }

  const functionNotifi = (mfgNo, pumbName, scanNo, prioriti, vlStatus) => {

    const myButton = document.getElementById('playButton')
    myButton.onclick = functionSound()

    messageApi.info({
      content: (
        <Row style={{ columnGap: "1ch", fontSize: 12 }}>
          <Col span={3} style={{
            borderRight: "1px solid #94A3B8",
            justifyContent: "center",
            alignItems: "center",
            display: "flex"
          }}>
            <img
              src={Number(vlStatus) === 1 ? IconStatusQualified : Number(vlStatus) === 2 ? IconStatusNotQualified : IconStatusING}
              alt=""
            ></img>
          </Col>
          <Col span={16}>
            <Row >
              <Col span={3} style={{ display: "grid" }}>
                {Number(prioriti) === 1 &&
                  <span className="element-center">
                    <img src={PriorityIcon} alt=""></img>
                  </span>
                }
                <span>
                  &nbsp;
                </span>
              </Col>
              <Col span={21} style={{ display: "grid", justifyContent: "flex-start", fontSize: 13 }}>
                <span style={{ textAlign: "start" }}>{mfgNo}</span>
                <Row style={{ display: "flex", columnGap: "3ch" }}>
                  <span className="element-center">
                    <img src={IconPumbType} alt=""></img>&nbsp;{pumbName}
                  </span>
                  <span className="element-center" >
                    <img src={IconLocation} alt=""></img>&nbsp;{scanNo}
                  </span>
                </Row>
              </Col>
            </Row>


          </Col>
          <Col span={3} className="element-center" style={{ justifyContent: "flex-end" }}>
            <CloseOutlined style={{ fontSize: 20, color: "#837b7b" }} onClick={closeMessage} />
          </Col>
        </Row>

      ),
      key: "updatable",
      duration: 4.5,

      // duration: 5000,
      // style: {
      //   width: "380px"
      // }
    });

  }

  const fecthApiNotification = () => {
    authAxios()
      .get(`${localhost}/live_notifi`,
        {
          params: {
            user_role: inforUser.user_role,
            id_user: inforUser.user_id,
          },
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then((res) => {
        const data = [
          {
            vl_mfg: "MFG12312412",
            vl_pumpname: "LK",
            vl_scanno: "160",
            vl_prioriti: "0",
            vl_status: "0"
          },
          {
            vl_mfg: "MFG12312412",
            vl_pumpname: "LK",
            vl_scanno: "170",
            vl_prioriti: "1",
            vl_status: "1"

          },
          {
            vl_mfg: "MFG12312412",
            vl_pumpname: "LK",
            vl_scanno: "180",
            vl_prioriti: "0",
            vl_status: "2"

          },
          {
            vl_mfg: "MFG12312412",
            vl_pumpname: "LK",
            vl_scanno: "190",
            vl_prioriti: "1",
            vl_status: "0"

          },
          {
            vl_mfg: "MFG12312412",
            vl_pumpname: "LK",
            vl_scanno: "200",
            vl_prioriti: "0",
            vl_status: "0"

          },
        ]
        setListNotifi(res.data.infos)
        // setListNotifi(data)
      })
      .catch((err) => {
      });
  }

  useEffect(() => {
    sessionStorage.setItem("check_upload", false)
    if (listNotifi.length > 0) {
      let newArr = listNotifi

      setTimeout(() => {
        functionNotifi(newArr[0].vl_mfg, newArr[0].vl_pumpname, newArr[0].vl_scanno, newArr[0].vl_prioriti, newArr[0].vl_status)
        newArr.shift()
      }, 200)

      const id = setInterval(() => {

        closeMessage()
      }, 5000);
      return () => clearInterval(id);
    }
    else {
      const checkUpload = sessionStorage.getItem("check_upload")
      if (checkUpload === "false") {
        const id = setInterval(() => {
          fecthApiNotification()
        }, 5000);
        return () => clearInterval(id);
      }
    }
  }, [listNotifi]);

  return (
    <>
      {contextHolder}
      <button style={{ display: "none" }} id="playButton">Play Audio</button>
      <audio id="audio" autoPlay></audio>
      {/* <audio loop={checkLoop} id="audioID" autoPlay={true} src="./audio/notification_success.mp3" typeof="audio/mp3"></audio> */}
    </>
  )
}


export const CustomNoLayout = ({ children }) => {
  // Test
  return <CustomLayoutFC>{children}</CustomLayoutFC>;
};

CustomLayoutFC.propTypes = {
  children: PropTypes.any,
};

CustomNoLayout.propTypes = {
  children: PropTypes.any,
};

