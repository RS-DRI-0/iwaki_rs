import React, { useState, useRef, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import jsQR from "jsqr";
import "./CameraMobile.css";
import { Col, Row, message, theme, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { IconButton } from "@mui/material";
import { FlashOff, FlashOn } from "@mui/icons-material";
import { localhost } from "../../../server";
import withReactContent from "sweetalert2-react-content";
import ErrorIcon from "../../../images/ErrorNotifiIcon.svg";

import fileLanguage from "../../../language.json";
import ModalReviewDetailImage from "./ModalMobile_LK_1/ModalReviewDetailImage";
import ModalConfirmReviewDetailImage from "./ModalMobile_LK_1/ModalConfirmReviewDetailImage";
import ModalShowImageCheckSheet from "./ModalMobile_LK_1/ModalShowImageCheckSheet";
import ModalShowImageSelect from "./ModalMobile_LK_1/ModalShowImageSelect";
import ModalShowImageCapture from "./ModalMobile_LK_1/ModalShowImageCapture";
import ModalConfirmMaximum2Image from "./ModalMobile_LK_1/ModalConfirmMaximum2Image";
import ModalDelete from "../../formSelect/modalUpload/ModalDelete";
import ModalConfirmMaxium50mb from "./ModalMobile_LK_1/ModalConfirmMaxium50mb";

import iconSuccess from "../../../images/iconComplete.svg";
import arrowBack from "../../../images/arrowBack.svg";
import iconLoading from "../../../images/iconLoading.svg";
import iconSwitchCamera from "../../../images/iconSwitchCamera.svg";
import iconCaptureImage from "../../../images/iconCaptureImage.svg";
import { authAxios } from "../../../api/axiosClient";

const MySwal = withReactContent(Swal);

const ToastCameraNotFound = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  willClose: () => {
    window.location.href = "/";
  },
  customClass: {
    popup: "my-custom-popup",
    title: "custom-title-alert-camera",
    timerProgressBar: "my-custom-progress-bar-success", // Thêm class tùy chỉnh
  },
});

const MobileWebCam2 = () => {
  const items2 = JSON.parse(sessionStorage.getItem("OptionMachine"));
  const role = JSON.parse(sessionStorage.getItem("info_user")).user_role;
  const chooseLanguage = sessionStorage.getItem("choosedLanguage");

  const { token } = theme.useToken();
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  let videoRef = useRef(null);
  let canvasRef = useRef(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [checkedTime, setCheckedTime] = useState(null);
  const [isChoose, setIsChoose] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [imageListCheckSheet, setImageListCheckSheet] = useState([]);
  const [imageListReviewDetailImage, setImageListReviewDetailImage] = useState(
    []
  );
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);
  const [isModalDeleteImage, setIsModalDeleteImage] = useState(false);
  const [isPrioritize, setIsPrioritize] = useState(false);
  const userInfoId = sessionStorage.getItem("userId");
  const [idListReviewDetailImage, setIdListReviewDetailImage] = useState(null);
  const [isModalOpenCheckSheet, setIsModalOpenCheckSheet] = useState(false);
  const [isModalOpenReviewDetailImage, setIsModalOpenReviewDetailImage] =
    useState(false);
  const [isModalDeleteReviewDetailImage, setIsModalDeleteReviewDetailImage] =
    useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [valueCheckBoxRadio, setValueCheckBoxRadio] = useState(2);
  const [currentCheckSheet, setCurrentCheckSheet] = React.useState(0);
  const [isModalOpenImageCapture, setIsModalOpenImageCapture] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [checkFlash, setCheckFlash] = useState(false);
  const [showModalUploadImageCapture, setShowModalUploadImageCapture] =
    useState(false);
  const [showModalConfirmLessThan5Images, setShowModalConfirmLessThan5Images] =
    useState(false);
  const [showModalConfirmLessThan2Images, setShowModalConfirmLessThan2Images] =
    useState(false);
  const [showModalConfirmMaximum2Image, setShowModalConfirmMaximum2Image] =
    useState(false);
  const [showModalConfirmMaxium50mb, setShowModalConfirmMaxium50mb] =
    useState(false);
  const [isDataQRCode, setIsDataQRCode] = useState("");
  const [valueStartCamera, setValueStartCamera] = useState(0);
  const [valueFacingMode, setValueFacingMode] = useState(0);

  const constraints = {
    video: {
      facingMode: facingMode,
      width: { ideal: 3020 },
      height: { ideal: 3020 },
    },
    audio: false,
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      // setPosition({ x: window.screen.width  0.3, y: window.screen.height  0.7 })
      // alert(mediaStream)
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current) {
            const actualWidth = videoRef.current.videoWidth;

            const actualHeight = videoRef.current.videoHeight;
            const track = mediaStream.getVideoTracks()[0];

            let newSettings = "";
            if (track !== undefined) {
              newSettings = track.getSettings();
            }

            const { width, height } = newSettings;

            const aspectRatio = width / height;

            if (aspectRatio > 1) {
              canvasRef.current.width = actualWidth;
              canvasRef.current.height = actualWidth / aspectRatio;
            } else {
              canvasRef.current.width = actualHeight * aspectRatio;
              canvasRef.current.height = actualHeight;
            }
          }

          videoRef.current.play();
        };
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const hasFrontCamera = devices.some(
            (device) =>
              (device.kind === "videoinput" &&
                device.label.toLowerCase().includes("front")) ||
              device.label.toLowerCase().includes("trước") ||
              device.label.toLowerCase().includes("前面")
          );
          const hasBackCamera = devices.some(
            (device) =>
              (device.kind === "videoinput" &&
                device.label.toLowerCase().includes("back")) ||
              device.label.toLowerCase().includes("sau") ||
              device.label.toLowerCase().includes("背面")
          );
          if (
            (isFrontCamera && !hasBackCamera) ||
            (!isFrontCamera && !hasFrontCamera)
          ) {
            const newFacingMode = "user";
            setFacingMode(newFacingMode);
          }
        });
        if (checkFlash === true) {
          handleFlashToggle();
        }
      }
    } catch (err) {
      ToastCameraNotFound.fire({
        icon: "warning",
        title: fileLanguage[chooseLanguage].camera_not_found,
      });
    }
  };

  useEffect(() => {
    if (!cameraStarted) {
      window
        .matchMedia("(orientation: portrait)")
        .addEventListener("change", (e) => {
          setCameraStarted(true);
        });
    }
  }, [cameraStarted, startCamera]);

  const videoRefCurrent = videoRef.current === null;

  const stopCamera = () => {
    if (stream) {
      let tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    if (isModalImageVisible === true || isModalOpenImageCapture === true) {
      if (checkFlash === true) {
        handleFlashToggle();
      }
      stopCamera();
      setValueStartCamera(0);
    } else {
      if (valueStartCamera === 0) {
        startCamera();
        setValueStartCamera(1);
      }
    }
    if (valueStartCamera === 1) {
      const handleOrientationChange = () => {
        // Thay vì reload, ta có thể thực hiện các hành động khác
        if (isModalImageVisible === true || isModalOpenImageCapture === true) {
          stopCamera();
        } else {
          stopCamera();
          startCamera();
        }
      };
      if (facingMode === "user") {
        setValueFacingMode(1);
        stopCamera();
        startCamera();
      } else {
        if (valueFacingMode === 1) {
          setValueFacingMode(0);
          stopCamera();
          startCamera();
        }
      }
      window.addEventListener("orientationchange", handleOrientationChange);
      // Start camera khi component được mount

      // Clean up: dừng camera và remove event listener khi component unmount
      return () => {
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
      };
    }
  }, [facingMode, isModalImageVisible, isModalOpenImageCapture]);

  const handleCancel = () => {
    setIsModalImageVisible(false);
    setIsPrioritize(false);
    setIsChoose(false);
    onClickCancelCheckImage();
    if (imageList.length === 0) {
      setIsModalOpenImageCapture(false);
    }
  };

  const showModalDelete = () => {
    setIsModalDeleteImage(true);
  };

  const buttonPrioritize = () => {
    isPrioritize ? setIsPrioritize(false) : setIsPrioritize(true);
  };

  const handleDeleteCancel = () => {
    setIsModalDeleteImage(false);
  };

  const onClickCheckImage = (index) => {
    if (isChoose) {
      const updatedImages = imageList.map((image, idx) =>
        idx === index
          ? { ...image, imageCheck: !image.imageCheck }
          : { ...image }
      );
      setImageList(updatedImages);
    } else {
      const filteredData = imageList.filter((e, i) => i === index);
      handleOkReviewDetailImage();
      const valueAtIndexZero = filteredData.length > 0 ? filteredData[0] : null;
      setImageListReviewDetailImage(valueAtIndexZero);
      setIdListReviewDetailImage(index);
    }
  };

  const countCheckedImages = () => {
    return imageList.filter((image) => image.imageCheck).length;
  };

  const handleDeleteImagesOk = () => {
    const updatedImages = imageList.filter((image) => !image.imageCheck);

    setImageList(updatedImages);
    setIsModalDeleteImage(false);
    if (imageList.length === 0) {
      setIsModalImageVisible(false);
    }
  };

  const showModal = () => {
    setIsModalImageVisible(true);
    setIsModalOpenImageCapture(false);
    if (checkFlash === true) {
      handleFlashToggle();
    }
  };

  const soundNotification = (sound) => {
    if ("vibrate" in window.navigator) {
      // Rung thiết bị trong 200ms
      window.navigator.vibrate(500);
    } else {
      console.log("Trình duyệt không hỗ trợ API rung");
    }

    const myaudio = document.createElement("audio");
    // myaudio.loop = checkLoop
    myaudio.autoplay = true;
    myaudio.src = sound;
    myaudio.typeof = "audio/mp3";
    myaudio.play();
  };

  const captureImage = () => {
    try {
      if (isSwitchingCamera) {
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas) {
        const context = canvas.getContext("2d");

        soundNotification("./audio/new_sound_capture.mp3");

        context.save();
        if (facingMode === "user") {
          context.scale(-1, 1);
          context.translate(-canvas.width, 0);
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        context.restore();
        const imageData = canvas.toDataURL("image/jpeg", 1);

        const now = new Date();

        const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
        const month =
          now.getMonth() + 1 < 10
            ? `0${now.getMonth() + 1}`
            : now.getMonth() + 1;
        const year = String(now.getFullYear()).slice(-2);
        const hours =
          now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
        const minutes =
          now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
        const seconds =
          now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
        const milliseconds = now.getMilliseconds();

        const formattedDateTime = `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
        const userId = sessionStorage.getItem("userId");
        const pumpType = JSON.parse(
          sessionStorage.getItem("OptionMachine")
        ).pumb_model;
        const nameFile = `${formattedDateTime}_${pumpType}_${userId}.JPG`;
        const typeFile = "image/jpeg";
        const getFileBase64 = imageData;
        const checkFileSize =
          parseInt(getFileBase64.replace(/=/g, "").length * 0.75) / 1024 / 1024;

        let scaleFactor = 1;
        let quality = 1;
        if (1 <= checkFileSize && checkFileSize < 5) {
          scaleFactor = 0.7;
          quality = 0.9;
        } else if (5 <= checkFileSize && checkFileSize < 10) {
          scaleFactor = 0.55;
          quality = 0.8;
        } else if (10 <= checkFileSize && checkFileSize < 20) {
          scaleFactor = 0.45;
          quality = 0.8;
        } else if (checkFileSize >= 20) {
          scaleFactor = 0.35;
          quality = 0.8;
        }
        return loadImage(getFileBase64).then((img) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const newWidth = img.width * scaleFactor;
          const newHeight = img.height * scaleFactor;

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          ctx.restore();

          const resizedImageBase64 = canvas.toDataURL("image/jpeg", quality);

          const imageInfo = {
            imageName: nameFile,
            imageType: typeFile,
            imageBase64: resizedImageBase64,
            imageCheck: false,
            imageOriginDataFile: checkFileSize,
          };

          setImageList((prevImageList) => [...prevImageList, imageInfo]);
          setIsModalOpenImageCapture(true);
        });
      }
    } catch (err) {
      const FormData = require("form-data");
      let data = new FormData();

      data.append("str_err", err.message);
      data.append("user_role", role);

      authAxios()
        .post(`${localhost}/log_cap_err`, data)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
      console.log(err.message);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const switchCamera = useCallback(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasFrontCamera = devices.some(
          (device) =>
            (device.kind === "videoinput" &&
              device.label.toLowerCase().includes("front")) ||
            device.label.toLowerCase().includes("trước") ||
            device.label.toLowerCase().includes("前面")
        );
        const hasBackCamera = devices.some(
          (device) =>
            (device.kind === "videoinput" &&
              device.label.toLowerCase().includes("back")) ||
            device.label.toLowerCase().includes("sau") ||
            device.label.toLowerCase().includes("背面")
        );

        if (
          (isFrontCamera && !hasBackCamera) ||
          (!isFrontCamera && !hasFrontCamera)
        ) {
          return;
        }
        setIsFrontCamera((prev) => !prev);
        if (videoRef.current) {
          setIsSwitchingCamera(true);
          setFacingMode(facingMode === "environment" ? "user" : "environment");
          setTimeout(() => {
            setIsSwitchingCamera(false);
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("Error enumerating devices:", error);
      });
    setTimeout(() => {
      document.activeElement.blur();
    }, 600);
  });

  const handleDeleteImages = () => {
    showModalDelete();
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const [totalSizeImageOriginal, setTotalSizeImageOriginal] = useState(0);
  const [timeCallAPI, setTimeCallAPI] = useState(0);
  const [openModalTryAgain, setOpenModalTryAgain] = useState(false);

  const multiUploadImage = () => {
    setShowModalUploadImageCapture(false);
    setCheckFlash(false);
    const startTimeClick = Date.now();

    try {
      let totalSizeOrigin = imageList.reduce((previousValue, image) => {
        return previousValue + image.imageOriginDataFile;
      }, 0);
      setTotalSizeImageOriginal(totalSizeOrigin);
      let totalSize = imageList.reduce((previousValue, image) => {
        return (
          previousValue +
          parseInt(image.imageBase64.replace(/=/g, "").length * 0.75) /
            1024 /
            1024
        );
      }, 0);
      if (totalSize <= 50) {
        const items2 = JSON.parse(sessionStorage.getItem("OptionMachine"));
        const prioriti = isPrioritize ? "1" : "0";

        if (items2 !== null) {
          authAxios()
            .post(`${localhost}/sv_time`, {
              sv_time: Date.now(),
              user_role: role,
            })
            .then((res) => {
              setCheckedTime(false);
              const user_name = JSON.parse(
                sessionStorage.getItem("user_success")
              );
              const startTime = Date.now();
              let checkOpenNotifi = false;
              let timeoutID = setTimeout(function () {
                setCheckedTime(null);
                setOpenModalTryAgain(true);
                checkOpenNotifi = true;
              }, 60000);

              let arrNameImage = [];
              let listImageBase64 = [];

              imageList.forEach((item) => {
                listImageBase64.push(item.imageBase64);
                arrNameImage.push(item.imageName);
              });
              sessionStorage.setItem("check_upload", true);

              authAxios()
                .post(`${localhost}/upload_file`, {
                  prioriti: prioriti,
                  user_role: role,
                  id_user: userInfoId,
                  type_upload: "0",
                  pumb_model: items2.pumb_model,
                  pumb_id: items2.pumb_id,
                  lv1_fields: items2.lv1_fields,
                  lv3_fields: items2.lv3_fields,
                  lv1_others: items2.lv1_others,
                  lv3_others: items2.lv3_others,
                  is_multi: items2.is_multi,
                  sv_time: res.data.sv_time,
                  cap_type:
                    items2.is_multi === "0"
                      ? "0"
                      : valueCheckBoxRadio === 1
                      ? "1"
                      : "0",
                  vl_model_name:
                    isDataQRCode !== ""
                      ? isDataQRCode.split('","')[1].replace('"', "").trim()
                      : "",
                  vl_mfg_no:
                    isDataQRCode !== ""
                      ? isDataQRCode.split('","')[3].replace('"', "").trim()
                      : "",
                  vl_item_no:
                    isDataQRCode !== ""
                      ? isDataQRCode.split('","')[0].replace('"', "").trim()
                      : "",
                  file_upload: listImageBase64,
                  list_name_image: arrNameImage,
                  user_name: user_name,
                })
                .then((res) => {
                  const endTime = Date.now(); // Request completed, stop the timer
                  const timeDiff = endTime - startTime; // Calculate the response time
                  setTimeCallAPI(timeDiff / 1000);

                  if (res.status === 200) {
                    MySwal.fire({
                      iconHtml: <img src={iconLoading} alt="" />,
                      title: fileLanguage[chooseLanguage].uploading_all,
                      showConfirmButton: false,
                      timer: 1000,
                      allowOutsideClick: false,
                      customClass: {
                        popup: "custome-form-loading",
                        icon: "custome-class-loading",
                        title: "custome-title-loading",
                      },
                    });

                    checkOpenNotifi = false;
                    soundNotification("./audio/complete.mp3");
                    const endTimeClick = Date.now();
                    const duration = endTimeClick - startTimeClick;
                    const durationInSeconds = duration / 1000;
                    const packIDUpload = res.data.pack_id;
                    setCheckedTime(true);
                    setIsDataQRCode("");
                    clearTimeout(timeoutID);
                    const durationInSecondsTimeDiff = timeDiff / 1000;
                    sessionStorage.setItem("check_upload", false);

                    PostTimeUploadFile(
                      totalSizeOrigin,
                      durationInSecondsTimeDiff,
                      durationInSeconds,
                      packIDUpload
                    );
                    setImageList([]);
                  }
                })
                .catch((err) => {
                  sessionStorage.setItem("check_upload", false);
                  if (err.response.status === 504) {
                    if (checkOpenNotifi === false) {
                      clearTimeout(timeoutID);
                      MySwal.fire({
                        iconHtml: <img src={ErrorIcon} alt="" />,
                        title: fileLanguage[chooseLanguage].message_err,
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                          popup: "custome-form-success",
                          icon: "custome-class-success",
                          title: "custome-title-success",
                        },
                      });
                    }
                  }
                  setCheckedTime(null);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        setShowModalConfirmMaxium50mb(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const PostTimeUploadFile = (
    totalSizeOrigin,
    durationInSecondsTimeDiff,
    durationInSeconds,
    packIDUpload
  ) => {
    const FormData = require("form-data");
    let data = new FormData();
    data.append("pack_id", packIDUpload);
    data.append("user_role", role);
    data.append(
      "upload_details",
      `${totalSizeOrigin.toFixed(2)}MB - ${durationInSecondsTimeDiff.toFixed(
        2
      )}s - ${durationInSeconds.toFixed(2)}s`
    );
    authAxios()
      .post(`${localhost}/upload_details`, data)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (checkedTime === true) {
      setCheckedTime(null);
      MySwal.fire({
        iconHtml: <img src={iconSuccess} alt="" />,
        title: fileLanguage[chooseLanguage].completed,
        html: (
          <Row className="text-total-size-image" style={{ marginTop: 10 }}>
            <Col span={4}></Col>
            <Col span={16}>
              <span>
                (&nbsp;{totalSizeImageOriginal.toFixed(2)}MB /{" "}
                {timeCallAPI.toFixed(2)}s&nbsp;)
              </span>
            </Col>
            <Col span={4}></Col>
          </Row>
        ),
        // customClass: "custome-success",
        showConfirmButton: false,
        timer: 2500,
        customClass: {
          popup: "custome-form-success",
          icon: "custome-class-success",
          title: "custome-title-success",
        },
      });
      setImageList([]);
      setIsModalImageVisible(false);
      handleCancelImageCapture();

      setIsPrioritize(false);
    } else if (checkedTime === false) {
      setCheckedTime(null);
      MySwal.fire({
        iconHtml: <img src={iconLoading} alt="" />,
        // title: "Image processing ...",
        title: fileLanguage[chooseLanguage].image_processing,
        showConfirmButton: false,
        timer: 59000,
        allowOutsideClick: false,
        customClass: {
          popup: "custome-form-loading",
          icon: "custome-class-loading",
          title: "custome-title-loading",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedTime]);

  useEffect(() => {
    if (openModalTryAgain === true) {
      MySwal.fire({
        iconHtml: <img src={ErrorIcon} alt="" />,
        // title: "Image processing ...",
        title: (
          <span style={{ fontSize: 16 }}>
            {fileLanguage[chooseLanguage].message_err}
          </span>
        ),
        showConfirmButton: true,

        timer: 10000,
        customClass: {
          popup: "custome-form-success",
          icon: "custome-class-success",
          title: "custome-title-success",
        },
        confirmButtonText: (
          <span>{fileLanguage[chooseLanguage].try_again}</span>
        ),
      });
      // something went wrong. Please check your information and try again
    }
  }, [openModalTryAgain]);

  useEffect(() => {
    if (imageList.length === 0) {
      setIsPrioritize(false);
      setIsChoose(false);
      setIsDataQRCode("");
    }
  }, [imageList]);

  useEffect(() => {
    if (imageListCheckSheet.length === 0) {
      setIsPrioritize(false);
      setIsChoose(false);
      setIsDataQRCode("");
    }
  }, [imageListCheckSheet]);

  const onClickCancelCheckImage = () => {
    const updatedImages = imageList.map((image) =>
      image.imageCheck === true ? { ...image, imageCheck: false } : { ...image }
    );
    setImageList(updatedImages);
  };

  const clickChooseImageDelete = () => {
    setIsChoose(!isChoose);
    if (isChoose) {
      setIsChoose(false);
      onClickCancelCheckImage();
    } else {
      setIsChoose(true);
    }
  };

  const buttonIconBack = () => {
    window.location.href = "/";
  };

  const uploadProps = {
    name: "file",
    showUploadList: false,
    capture: false,
    multiple: true,
    // maxCount: valueCheckBoxRadio === 1 && 2,
    beforeUpload(file) {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpg";
      const isJPEG = file.type === "image/jpeg";
      const isTIF = file.type === "image/tif";
      const isTIFF = file.type === "image/tiff";
      if (!isPNG && !isJPG && !isJPEG && !isTIF && !isTIFF) {
        message.error(`${file.name} is not a Image file`);
      } else {
        return isPNG || isJPEG || isJPG || isTIF || isTIFF;
      }
    },
    onChange(info) {
      const newFile = info.file.originFileObj;
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageBase64 = e.target.result;
        // if (newFile.type === 'image/tiff') {
        //   const tiff = new TIFF({ buffer: imageBase64 });
        //   const canvas = tiff.toCanvas(); // Convert TIFF to a canvas

        //   // Create a new image from the canvas
        //   const img = new Image();
        //   img.src = canvas.toDataURL('image/png'); // Or 'image/jpeg' for JPEG

        //   img.onload = function () {
        //     // Show the converted image on the page
        //     document.getElementById('output-img').src = img.src;

        //     // If you need Base64 for further use, you can extract it here
        //     const base64String = img.src;
        //     console.log('Base64 Image (PNG):', base64String);
        //   };
        // }

        const checkFileSize =
          parseInt(imageBase64.replace(/=/g, "").length * 0.75) / 1024 / 1024;
        let scaleFactor = 1;
        let quality = 1;
        if (1 <= checkFileSize && checkFileSize < 5) {
          scaleFactor = 0.7;
          quality = 0.9;
        } else if (5 <= checkFileSize && checkFileSize < 10) {
          scaleFactor = 0.55;
          quality = 0.8;
        } else if (10 <= checkFileSize && checkFileSize < 20) {
          scaleFactor = 0.5;
          quality = 0.8;
        } else if (checkFileSize >= 20) {
          scaleFactor = 0.45;
          quality = 0.8;
        }

        loadImage(imageBase64)
          .then((img) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const newWidth = img.width * scaleFactor;
            const newHeight = img.height * scaleFactor;

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
            const qrCode = jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );

            if (isDataQRCode === "") {
              if (qrCode !== null) {
                if (qrCode.data.split('","').length === 6) {
                  setIsDataQRCode(qrCode.data);
                }
              }
            }
            const resizedImageBase64 = canvas.toDataURL("image/jpeg", quality);

            const now = new Date();

            const day =
              now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
            const month =
              now.getMonth() + 1 < 10
                ? `0${now.getMonth() + 1}`
                : now.getMonth() + 1;
            const year = String(now.getFullYear()).slice(-2);
            const hours =
              now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
            const minutes =
              now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
            const seconds =
              now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
            const milliseconds = now.getMilliseconds();

            const formattedDateTime = `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
            const userId = sessionStorage.getItem("userId");
            const pumpType = JSON.parse(
              sessionStorage.getItem("OptionMachine")
            ).pumb_model;
            const nameFile = `${formattedDateTime}_${pumpType}_${userId}.JPG`;
            const imageInfo = {
              imageName: nameFile,
              imageType: newFile.type,
              imageBase64: resizedImageBase64,
              imageCheck: false,
              imageOriginDataFile: checkFileSize,
            };

            setImageList((prevImageList) => [...prevImageList, imageInfo]);
          })
          .catch((err) => {
            message.error(
              `${info.file.name} ${fileLanguage[chooseLanguage].error_image}`
            );
          });
      };
      reader.readAsDataURL(newFile);
    },
  };

  const handleDeleteIdReviewDetailImage = () => {
    setIsModalDeleteReviewDetailImage(true);
  };

  const handleConfirmOkDeleteId = () => {
    const updatedImageList = imageList.filter(
      (image, i) => i !== idListReviewDetailImage
    );

    setImageList(updatedImageList);
    handleCancelReviewDetailImage();
    setIsModalDeleteReviewDetailImage(false);
  };

  const handleConfirmCancelDeleteId = () => {
    setIsModalDeleteReviewDetailImage(false);
  };

  const handleOkCheckSheet = () => {
    setIsModalOpenCheckSheet(true);
  };
  const handleCancelCheckSheet = () => {
    setIsModalOpenCheckSheet(false);
    setCurrentCheckSheet(0);
  };

  const handleOkReviewDetailImage = () => {
    setIsModalOpenReviewDetailImage(true);
  };
  const handleCancelReviewDetailImage = () => {
    setIsModalOpenReviewDetailImage(false);
  };

  const nextCheckSheet = () => {
    setCurrentCheckSheet(currentCheckSheet + 1);
  };

  const prevCheckSheet = () => {
    setCurrentCheckSheet(currentCheckSheet - 1);
  };

  const contentStyle = {
    lineHeight: "200px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    width: "100%",
  };

  const stepsCheckSheet = imageListCheckSheet.map((image, index) => ({
    id: { index },
    content: (
      <img
        src={image.imageBase64}
        alt={image.imageName}
        className="imageSourceChecksheet"
        key={index}
      />
    ),
  }));

  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  const dynamicHeight = screenHeight < 500 ? 500 : screenHeight - 150;

  useEffect(() => {
    const checkItem = JSON.parse(sessionStorage.getItem("OptionMachine"));
    if (checkItem.is_multi === "1") {
      const storedImageList1 =
        JSON.parse(localStorage.getItem("imageListCheckSheet")) || [];
      if (storedImageList1.length !== 0) {
        setImageListCheckSheet(storedImageList1);
        setValueCheckBoxRadio(1);
      }
    }
  }, []);

  const handleAddImageCheckSheet = () => {
    const storedImageList1 = JSON.parse(
      localStorage.getItem("imageListCheckSheet")
    );
    if (storedImageList1.length >= 2) {
      setShowModalConfirmMaximum2Image(true);
    } else {
      handleCancelCheckSheet();
    }
  };

  const handleDeleteImageCheckSheet = () => {
    const storedImageList1 = JSON.parse(
      localStorage.getItem("imageListCheckSheet")
    );
    const updatedImageList = storedImageList1.filter(
      (_, index) => index !== currentCheckSheet
    );
    localStorage.setItem(
      "imageListCheckSheet",
      JSON.stringify(updatedImageList)
    );

    handleCancelCheckSheet();
    if (updatedImageList.length === 0) {
      localStorage.removeItem("imageListCheckSheet");
      setImageListCheckSheet([]);
    }
  };

  const handleUploadImageCheckSheet = () => {
    setShowModalUploadImageCapture(true);
  };

  const customUpload = () => {};

  const handleOkImageCapture = () => {
    setIsModalOpenImageCapture(false);
  };

  const handleCancelImageCapture = () => {
    setIsModalOpenImageCapture(false);
  };

  const handleDeleteImageCapture = () => {
    const updatedImageList = imageList.slice(0, -1);
    setImageList(updatedImageList);
    setIsModalOpenImageCapture(false);
  };

  const handleSubmitImageCapture = () => {
    setShowModalUploadImageCapture(true);
  };

  const showModalCheckImageCapture = () => {
    multiUploadImage();
  };

  const closeModalUploadImageCapture = () => {
    setShowModalUploadImageCapture(false);
    setIsPrioritize(false);
  };

  const handleFlashToggle = async () => {
    try {
      const stream = videoRef.current.srcObject;
      if (!stream) {
        throw new Error("Stream not available");
      }
      const track = stream.getVideoTracks()[0];

      if (!track) {
        throw new Error("Video track not available");
      }

      const capabilities = track.getCapabilities();
      setFlashOn((prevState) => !prevState);
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashOn }],
          });
        } catch (error) {
          console.error("Error applying constraints:", error);
          // Handle the error gracefully, inform user flash control might not be available
        }
      } else {
        throw new Error("Flash not available");
      }
    } catch (error) {
      console.error("Error toggling flash:", error);
      // Handle errors as needed
    }
  };

  const closeModalConfirmLessThan5Images = () => {
    setShowModalConfirmLessThan5Images(false);
  };

  const closeModalConfirmLessThan2Images = () => {
    setShowModalConfirmLessThan2Images(false);
  };

  const closeModalConfirmMaximum2Image = () => {
    setShowModalConfirmMaximum2Image(false);
  };
  const closeModalConfirmMaxium50mb = () => {
    setShowModalConfirmMaxium50mb(false);
  };

  const handleDeleteIndexImageCheckSheet = () => {
    const storedImageList1 = JSON.parse(
      localStorage.getItem("imageListCheckSheet")
    );
    const updatedImageList = storedImageList1.filter(
      (_, index) => index !== currentCheckSheet
    );
    localStorage.setItem(
      "imageListCheckSheet",
      JSON.stringify(updatedImageList)
    );
    setCurrentCheckSheet(0);
    setImageListCheckSheet(updatedImageList);
  };

  const handleClickRotateLeft = () => {
    const getFileBase64 = imageList[imageList.length - 1].imageBase64;

    return loadImage(getFileBase64).then((img) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Xoay ảnh sang bên trái (90 độ)
      canvas.width = img.height;
      canvas.height = img.width;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 2); // Xoay ngược chiều kim đồng hồ 90 độ
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Optional: Get the base64 data from the canvas
      const rotatedImageBase64 = canvas.toDataURL("image/jpeg");
      const now = new Date();

      const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
      const month =
        now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
      const year = String(now.getFullYear()).slice(-2);
      const hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
      const minutes =
        now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
      const seconds =
        now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const formattedDateTime = `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
      const userId = sessionStorage.getItem("userId");
      const pumpType = JSON.parse(
        sessionStorage.getItem("OptionMachine")
      ).pumb_model;
      const nameFile = `${formattedDateTime}_${pumpType}_${userId}.JPG`;
      const typeFile = "image/png";
      const checkFileSize =
        parseInt(getFileBase64.replace(/=/g, "").length * 0.75) / 1024 / 1024;

      let scaleFactor = 1;
      let quality = 1;
      if (1 <= checkFileSize && checkFileSize < 5) {
        scaleFactor = 0.7;
        quality = 0.9;
      } else if (5 <= checkFileSize && checkFileSize < 10) {
        scaleFactor = 0.55;
        quality = 0.8;
      } else if (10 <= checkFileSize && checkFileSize < 20) {
        scaleFactor = 0.45;
        quality = 0.8;
      } else if (checkFileSize >= 20) {
        scaleFactor = 0.35;
        quality = 0.8;
      }

      const imageInfo = {
        imageName: nameFile,
        imageType: typeFile,
        imageBase64: rotatedImageBase64,
        imageCheck: false,
        imageOriginDataFile: checkFileSize,
      };

      const updatedImageList = imageList.slice(0, -1);
      setImageList([...updatedImageList, imageInfo]);
    });
  };

  const handleClickRotateRight = () => {
    const getFileBase64 = imageList[imageList.length - 1].imageBase64;

    return loadImage(getFileBase64).then((img) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Xoay ảnh sang bên trái (90 độ)
      canvas.width = img.height;
      canvas.height = img.width;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 2); // Xoay ngược chiều kim đồng hồ 90 độ
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Optional: Get the base64 data from the canvas
      const rotatedImageBase64 = canvas.toDataURL("image/jpeg");
      const now = new Date();

      const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
      const month =
        now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
      const year = String(now.getFullYear()).slice(-2);
      const hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
      const minutes =
        now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
      const seconds =
        now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const formattedDateTime = `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
      const userId = sessionStorage.getItem("userId");
      const pumpType = JSON.parse(
        sessionStorage.getItem("OptionMachine")
      ).pumb_model;
      const nameFile = `${formattedDateTime}_${pumpType}_${userId}.JPG`;
      const typeFile = "image/png";
      const checkFileSize =
        parseInt(getFileBase64.replace(/=/g, "").length * 0.75) / 1024 / 1024;

      let scaleFactor = 1;
      let quality = 1;
      if (1 <= checkFileSize && checkFileSize < 5) {
        scaleFactor = 0.7;
        quality = 0.9;
      } else if (5 <= checkFileSize && checkFileSize < 10) {
        scaleFactor = 0.55;
        quality = 0.8;
      } else if (10 <= checkFileSize && checkFileSize < 20) {
        scaleFactor = 0.45;
        quality = 0.8;
      } else if (checkFileSize >= 20) {
        scaleFactor = 0.35;
        quality = 0.8;
      }

      const imageInfo = {
        imageName: nameFile,
        imageType: typeFile,
        imageBase64: rotatedImageBase64,
        imageCheck: false,
        imageOriginDataFile: checkFileSize,
      };

      const updatedImageList = imageList.slice(0, -1);
      setImageList([...updatedImageList, imageInfo]);
    });
  };

  const handleClickRotateLeftDetail = () => {
    const getFileBase64 = imageListReviewDetailImage.imageBase64;

    return loadImage(getFileBase64).then((img) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Xoay ảnh sang bên trái (90 độ)
      canvas.width = img.height;
      canvas.height = img.width;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 2); // Xoay ngược chiều kim đồng hồ 90 độ
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Optional: Get the base64 data from the canvas
      const rotatedImageBase64 = canvas.toDataURL("image/jpeg");
      const now = new Date();

      const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
      const month =
        now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
      const year = String(now.getFullYear()).slice(-2);
      const hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
      const minutes =
        now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
      const seconds =
        now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const formattedDateTime = `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
      const userId = sessionStorage.getItem("userId");
      const pumpType = JSON.parse(
        sessionStorage.getItem("OptionMachine")
      ).pumb_model;
      const nameFile = `${formattedDateTime}_${pumpType}_${userId}.JPG`;
      const typeFile = "image/png";
      const checkFileSize =
        parseInt(getFileBase64.replace(/=/g, "").length * 0.75) / 1024 / 1024;

      let scaleFactor = 1;
      let quality = 1;
      if (1 <= checkFileSize && checkFileSize < 5) {
        scaleFactor = 0.7;
        quality = 0.9;
      } else if (5 <= checkFileSize && checkFileSize < 10) {
        scaleFactor = 0.55;
        quality = 0.8;
      } else if (10 <= checkFileSize && checkFileSize < 20) {
        scaleFactor = 0.45;
        quality = 0.8;
      } else if (checkFileSize >= 20) {
        scaleFactor = 0.35;
        quality = 0.8;
      }

      const imageInfo = {
        imageName: nameFile,
        imageType: typeFile,
        imageBase64: rotatedImageBase64,
        imageCheck: false,
        imageOriginDataFile: checkFileSize,
      };

      // Thay thế thông tin của ảnh mới vào vị trí đã thay đổi
      const updatedImageList = [...imageList];
      updatedImageList[idListReviewDetailImage] = imageInfo;
      // Cập nhật danh sách ảnh mới
      setImageList(updatedImageList);

      setImageListReviewDetailImage(imageInfo);
    });
  };

  const handleClickRotateRightDetail = () => {
    const getFileBase64 = imageListReviewDetailImage.imageBase64;

    return loadImage(getFileBase64).then((img) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Xoay ảnh sang bên trái (90 độ)
      canvas.width = img.height;
      canvas.height = img.width;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 2); // Xoay ngược chiều kim đồng hồ 90 độ
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Optional: Get the base64 data from the canvas
      const rotatedImageBase64 = canvas.toDataURL("image/jpeg");
      const now = new Date();

      const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
      const month =
        now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
      const year = String(now.getFullYear()).slice(-2);
      const hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
      const minutes =
        now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
      const seconds =
        now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const formattedDateTime = `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
      const userId = sessionStorage.getItem("userId");
      const pumpType = JSON.parse(
        sessionStorage.getItem("OptionMachine")
      ).pumb_model;
      const nameFile = `${formattedDateTime}_${pumpType}_${userId}.JPG`;
      const typeFile = "image/png";
      const checkFileSize =
        parseInt(getFileBase64.replace(/=/g, "").length * 0.75) / 1024 / 1024;

      let scaleFactor = 1;
      let quality = 1;
      if (1 <= checkFileSize && checkFileSize < 5) {
        scaleFactor = 0.7;
        quality = 0.9;
      } else if (5 <= checkFileSize && checkFileSize < 10) {
        scaleFactor = 0.55;
        quality = 0.8;
      } else if (10 <= checkFileSize && checkFileSize < 20) {
        scaleFactor = 0.45;
        quality = 0.8;
      } else if (checkFileSize >= 20) {
        scaleFactor = 0.35;
        quality = 0.8;
      }

      const imageInfo = {
        imageName: nameFile,
        imageType: typeFile,
        imageBase64: rotatedImageBase64,
        imageCheck: false,
        imageOriginDataFile: checkFileSize,
      };

      // Thay thế thông tin của ảnh mới vào vị trí đã thay đổi
      const updatedImageList = [...imageList];
      updatedImageList[idListReviewDetailImage] = imageInfo;
      // Cập nhật danh sách ảnh mới
      setImageList(updatedImageList);

      setImageListReviewDetailImage(imageInfo);
    });
  };

  const handleCheckToggle = () => {
    setCheckFlash((prevState) => !prevState);
  };

  const handleFlashToggleCheck = () => {
    handleFlashToggle();
    handleCheckToggle();
  };

  return (
    <>
      {isModalImageVisible ? (
        <></>
      ) : (
        <div className="CameraDesign">
          <div className="CameraVideoDesign">
            <div className="titleCameraDesign">
              <Row style={{ width: "100%", justifyContent: "space-between" }}>
                <Col
                  span={4}
                  style={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <button className="buttonBack" onClick={buttonIconBack}>
                    <img className="imageIconBack" src={arrowBack} alt="" />
                  </button>
                </Col>

                <Col
                  span={16}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span className="pumpNameTitleCamera">
                    {items2.pumb_model}
                  </span>
                </Col>

                <Col
                  span={4}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {navigator.platform !== "iPhone" && (
                    <IconButton onClick={handleFlashToggleCheck}>
                      {flashOn ? (
                        <FlashOn style={{ color: "#fff" }} />
                      ) : (
                        <FlashOff style={{ color: "#fff" }} />
                      )}
                    </IconButton>
                  )}
                </Col>
              </Row>
            </div>

            <div className="FormVideo">
              <video
                className="VideoDesign"
                ref={videoRef}
                // autoPlay
                playsInline
                style={{
                  transform: facingMode === "user" ? "scaleX(-1)" : "none",
                  zIndex: "1",
                }}
              >
                <track kind="captions" srcLang="en" label="English" />
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              </video>
            </div>

            <div className="FooterCameraDesign">
              <Row style={{ width: "100%", height: "100%" }}>
                <Col
                  span={8}
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <>
                    {imageList.length > 0 ? (
                      <Badge
                        count={imageList.length}
                        className="modal-show-image-capture-badge"
                      >
                        <button
                          onClick={showModal}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                          }}
                          aria-label="Open image modal"
                        >
                          <img
                            src={imageList[imageList.length - 1].imageBase64}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            alt="Captured"
                          />
                        </button>
                      </Badge>
                    ) : (
                      <FontAwesomeIcon
                        icon={faImage}
                        style={{ fontSize: 40, color: "#fff" }}
                        onClick={showModal}
                      />
                    )}
                  </>
                </Col>
                <Col
                  span={8}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <button
                    style={{
                      background: "transparent",
                      border: "none",
                      height: "100%",
                    }}
                    disabled={
                      isModalOpenImageCapture ||
                      isModalOpenCheckSheet ||
                      videoRefCurrent
                    }
                    className="btn-capture"
                    onClick={() => captureImage()}
                  >
                    <img
                      style={{ height: "100%" }}
                      src={iconCaptureImage}
                      alt=""
                    />
                  </button>
                </Col>
                <Col
                  span={8}
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <button className="btn-switch-camera" onClick={switchCamera}>
                    <img src={iconSwitchCamera} alt="" />
                  </button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      )}

      {isModalImageVisible ? (
        <ModalShowImageSelect
          isModalImageVisible={isModalImageVisible}
          handleCancel={handleCancel}
          countCheckedImages={countCheckedImages}
          fileLanguage={fileLanguage}
          chooseLanguage={chooseLanguage}
          isChoose={isChoose}
          setIsChoose={setIsChoose}
          clickChooseImageDelete={clickChooseImageDelete}
          imageList={imageList}
          onClickCheckImage={onClickCheckImage}
          uploadProps={uploadProps}
          customUpload={customUpload}
          isPrioritize={isPrioritize}
          handleDeleteImages={handleDeleteImages}
          setImageList={setImageList}
          buttonPrioritize={buttonPrioritize}
          showModalUploadImageCapture={showModalUploadImageCapture}
          showModalCheckImageCapture={showModalCheckImageCapture}
          closeModalUploadImageCapture={closeModalUploadImageCapture}
          handleSubmitImageCapture={handleSubmitImageCapture}
          showModalConfirmLessThan5Images={showModalConfirmLessThan5Images}
          closeModalConfirmLessThan5Images={closeModalConfirmLessThan5Images}
          showModalConfirmLessThan2Images={showModalConfirmLessThan2Images}
          closeModalConfirmLessThan2Images={closeModalConfirmLessThan2Images}
        />
      ) : null}

      {isModalOpenCheckSheet ? (
        <ModalShowImageCheckSheet
          isModalOpenCheckSheet={isModalOpenCheckSheet}
          handleOkCheckSheet={handleOkCheckSheet}
          handleCancelCheckSheet={handleCancelCheckSheet}
          handleAddImageCheckSheet={handleAddImageCheckSheet}
          handleDeleteImageCheckSheet={handleDeleteImageCheckSheet}
          handleUploadImageCheckSheet={handleUploadImageCheckSheet}
          dynamicHeight={dynamicHeight}
          currentCheckSheet={currentCheckSheet}
          prevCheckSheet={prevCheckSheet}
          stepsCheckSheet={stepsCheckSheet}
          contentStyle={contentStyle}
          nextCheckSheet={nextCheckSheet}
          showModalUploadImageCapture={showModalUploadImageCapture}
          showModalCheckImageCapture={showModalCheckImageCapture}
          closeModalUploadImageCapture={closeModalUploadImageCapture}
          buttonPrioritize={buttonPrioritize}
          isPrioritize={isPrioritize}
          handleDeleteIndexImageCheckSheet={handleDeleteIndexImageCheckSheet}
        />
      ) : null}

      {isModalOpenReviewDetailImage ? (
        <ModalReviewDetailImage
          isDataQRCode={isDataQRCode}
          handleOkReviewDetailImage={handleOkReviewDetailImage}
          handleCancelReviewDetailImage={handleCancelReviewDetailImage}
          isModalOpenReviewDetailImage={isModalOpenReviewDetailImage}
          contentStyle={contentStyle}
          imageListReviewDetailImage={imageListReviewDetailImage}
          handleDeleteIdReviewDetailImage={handleDeleteIdReviewDetailImage}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          handleClickRotateLeft={handleClickRotateLeftDetail}
          handleClickRotateRight={handleClickRotateRightDetail}
        />
      ) : null}

      {isModalDeleteReviewDetailImage ? (
        <ModalConfirmReviewDetailImage
          fileLanguage={fileLanguage}
          chooseLanguage={chooseLanguage}
          isModalDeleteReviewDetailImage={isModalDeleteReviewDetailImage}
          handleConfirmOkDeleteId={handleConfirmOkDeleteId}
          handleConfirmCancelDeleteId={handleConfirmCancelDeleteId}
        />
      ) : null}

      {isModalDeleteImage ? (
        <ModalDelete
          fileLanguage={fileLanguage}
          chooseLanguage={chooseLanguage}
          imageList={imageList}
          setImageList={setImageList}
          isModalDeleteImage={isModalDeleteImage}
          handleDeleteImagesOk={handleDeleteImagesOk}
          handleDeleteCancel={handleDeleteCancel}
        />
      ) : null}

      {isModalOpenImageCapture ? (
        <ModalShowImageCapture
          isDataQRCode={isDataQRCode}
          isModalOpenImageCapture={isModalOpenImageCapture}
          contentStyle={contentStyle}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          handleOkImageCapture={handleOkImageCapture}
          handleCancelImageCapture={handleCancelImageCapture}
          imageList={imageList}
          showModal={showModal}
          handleDeleteImageCapture={handleDeleteImageCapture}
          handleSubmitImageCapture={handleSubmitImageCapture}
          showModalUploadImageCapture={showModalUploadImageCapture}
          showModalCheckImageCapture={showModalCheckImageCapture}
          closeModalUploadImageCapture={closeModalUploadImageCapture}
          buttonPrioritize={buttonPrioritize}
          isPrioritize={isPrioritize}
          showModalConfirmLessThan5Images={showModalConfirmLessThan5Images}
          closeModalConfirmLessThan5Images={closeModalConfirmLessThan5Images}
          showModalConfirmLessThan2Images={showModalConfirmLessThan2Images}
          closeModalConfirmLessThan2Images={closeModalConfirmLessThan2Images}
          imageListCheckSheet={imageListCheckSheet}
          valueCheckBoxRadio={valueCheckBoxRadio}
          handleClickRotateLeft={handleClickRotateLeft}
          handleClickRotateRight={handleClickRotateRight}
        />
      ) : null}

      <ModalConfirmMaximum2Image
        showModalConfirmMaximum2Image={showModalConfirmMaximum2Image}
        closeModalConfirmMaximum2Image={closeModalConfirmMaximum2Image}
      />

      {showModalConfirmMaxium50mb ? (
        <ModalConfirmMaxium50mb
          showModalConfirmMaxium50mb={showModalConfirmMaxium50mb}
          closeModalConfirmMaxium50mb={closeModalConfirmMaxium50mb}
        />
      ) : null}
    </>
  );
};

export default MobileWebCam2;
