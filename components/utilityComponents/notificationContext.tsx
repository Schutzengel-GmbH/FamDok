import { Alert, Snackbar } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";

interface INotificationContext {
  addAlert: (notification: INotification) => void;
}

interface INotification {
  message: string;
  severity: "error" | "info" | "success" | "warning";
}

export const NotificationContext =
  React.createContext<INotificationContext | null>(null);

const AUTO_DISMISS = 2500;

export function NotificationProvider({ children }) {
  const [alerts, setAlerts] = useState<INotification[]>([]);

  const activeAlertIds = alerts.join(",");
  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(
        () => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)),
        AUTO_DISMISS
      );
      return () => clearTimeout(timer);
    }
  }, [activeAlertIds]);

  const addAlert = ({ message, severity }: INotification) =>
    setAlerts((alerts) => [{ message, severity }, ...alerts]);

  const value = { addAlert };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {alerts.map((alert, i) => (
        <Snackbar key={i} open={true} sx={{ paddingBottom: i * 7 }}>
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}

const useNotification = () => useContext(NotificationContext);

export default useNotification;
