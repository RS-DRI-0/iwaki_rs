import { notification } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
    // timer: 1000000000,
    title: (
      <span className={className} style={{ color: color }}>
        {status}
      </span>
    ),
    html: <i style={{ fontSize: 16 }}>{message}</i>,
    // icon: "success",
    imageUrl: icon,
    showConfirmButton: !!button,
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
