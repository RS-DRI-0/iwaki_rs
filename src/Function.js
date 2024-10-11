import { notification } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./../src/containers/management_of_user/body_file_manager/ModalFileManager.css"
notification.config({
  placement: "top",
  duration: 2.5,
});
const MySwal = withReactContent(Swal);

export function openNotificationWithIcon(
  type,
  message,
  description,
  className
) {
  notification[type]({
    message: message,
    description: description,
    className: className,
    style: {
      whiteSpace: "pre-wrap",
    },
  });
}

export function openNotificationSweetAlert(
  icon,
  message,
  color,
  status,
  className,
  button
) {
  MySwal.fire({
    timer: 1000,
    title: (
      <span className={className} style={{ color: color }}>
        {status}
      </span>
    ),
    html: <i style={{ fontSize: 16 }}>{message}</i>,
    // icon: "success",
    imageUrl: icon,
    showConfirmButton: button !== undefined,
    confirmButtonText: button,
    // confirmButtonColor: "#fff",
    focusConfirm: true,
    // allowOutsideClick: false,
    customClass: {
      icon: "my-custom-icon-class", // Thêm class tùy chỉnh cho biểu tượng
      popup: "custom-notification",
      // confirmButton: "custom-confirm-btn"
      // image: "custom-image"
    },
    position: "top",
    // width: screenWindown768px === true ? "80%" : "20%",
  });
}

export function openNotificationSweetAlertAdmin(
  icon,
  message,
  color,
  status,
  className,
  button
) {
  let showButton = !!button;

  MySwal.fire({
    timer: 1000,
    title: (
      <span className={className} style={{ color: color }}>
        {status}
      </span>
    ),
    html: <i style={{ fontSize: 16 }}>{message}</i>,
    // icon: "success",
    imageUrl: icon,
    // showConfirmButton: button !== undefined ? true : false,
    showConfirmButton: showButton,
    confirmButtonText: button,
    // confirmButtonColor: "#fff",
    focusConfirm: true,
    // allowOutsideClick: false,
    customClass: {
      icon: "my-custom-icon-class", // Thêm class tùy chỉnh cho biểu tượng
      popup: "custom-notification",
      // confirmButton: "custom-confirm-btn"
      // image: "custom-image"
    },
    position: "top",
    // width: screenWindown768px === true ? "80%" : "20%",
  });
}

export function templateNodata(img, language, chooseLanguage) {
  return (
    <div className="container-noData-file-manager">
      <div style={{ display: "grid" }}>
        <img src={img} alt=""></img>
        <p> {language[chooseLanguage].content_no_data}</p>
      </div>
    </div>
  );
}
