import CloseIcon from "./icons/closeIcon";
import ErrorIcon from "./icons/errorIcon";
import InfoIcon from "./icons/infoIcon";
import SuccessIcon from "./icons/successIcon";
import WarningIcon from "./icons/warningIcon";
import styles from "./notification.module.css";
import { ToastProps } from "./notificationContext";

export default function Toast({
  message,
  severity,
  remove,
}: ToastProps & { remove: () => void }) {
  let style = styles.toast + " ";
  let icon;

  switch (severity) {
    case "success":
      icon = <SuccessIcon width={36} fill={"green"} />;
      style = style.concat(styles.toastSuccess);
      break;
    case "info":
      icon = <InfoIcon width={36} fill={"blue"} />;
      style = style.concat(styles.toastInfo);
      break;
    case "warning":
      icon = <WarningIcon width={36} fill={"orange"} />;
      style = style.concat(styles.toastWarn);
      break;
    case "error":
      icon = <ErrorIcon width={36} fill={"red"} />;
      style = style.concat(styles.toastError);
      break;
  }

  return (
    <div className={style}>
      <div className={styles.messageWrapper}>
        {icon}
        <p className={styles.message}>{message}</p>
      </div>
      <button id='removeButton' className={styles.removeButton} onClick={remove}>
        <CloseIcon fill='white' width={24} />
      </button>
    </div>
  );
}
