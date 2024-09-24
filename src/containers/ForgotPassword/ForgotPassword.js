import React, { useState } from "react";
import FormRequestPassword from "./FormRequestPassword";
import FormVerifyPassword from "./FormVerifyPassword";
import Swal from "sweetalert2";
import { Layout } from "antd";
import language from "../../language.json";


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

export default function ForgotPassword() {
  const [chooseLanguage, setChooseLanguage] = useState(
    sessionStorage.getItem("choosedLanguage") !== null &&
      sessionStorage.getItem("choosedLanguage") !== undefined
      ? sessionStorage.getItem("choosedLanguage")
      : "japanese"
  );
  const submitRequestLink = () => {
    ToastCameraNotFound.fire({
      icon: "warning",
      title: language[chooseLanguage].resend_email,
    });
  };

  return (
    <Layout
      className="layoutForgotPassword"
      style={{ height: "100svh", maxHeight: "100svh" }}
    >
      <FormRequestPassword submitRequestLink={submitRequestLink} /> :{" "}
      {/* <FormVerifyPassword /> */}
    </Layout>
  );
}
