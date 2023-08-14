import React, { useState, useEffect, useContext, ReactNode } from "react";
import Toast from "./toast";
import styles from "./notification.module.css";

interface IToastContext {
  addToast: (notification: ToastProps) => void;
}

export type ToastProps = {
  message: string;
  severity: "error" | "info" | "success" | "warning";
};

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastContext = React.createContext<IToastContext | undefined>(undefined);

const AUTO_DISMISS = 2500;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const activeAlertIds = toasts.join(",");
  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(
        () => setToasts((toasts) => toasts.slice(0, toasts.length - 1)),
        AUTO_DISMISS
      );
      return () => clearTimeout(timer);
    }
  }, [activeAlertIds]);

  const removeToast = (i: number) =>
    setToasts((toasts) => toasts.filter((_, index) => index !== i));

  const addToast = ({ message, severity }: ToastProps) =>
    setToasts((toasts) => [{ message, severity }, ...toasts]);

  const value = { addToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.toastWrapper}>
        {toasts.map((toast, i) => (
          <Toast
            key={i}
            message={toast.message}
            severity={toast.severity}
            remove={() => removeToast(i)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) throw new Error("useTodoContext must be within TodoProvider");
  else return context;
}

export default useToast;
