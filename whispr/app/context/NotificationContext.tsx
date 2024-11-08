"use client";

import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

interface NotificationContextType {
  notify: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      <div className="h-screen">
        {notification && <Toast message={notification} />}
        {children}
      </div>
    </NotificationContext.Provider>
  );
};
