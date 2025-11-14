"use client"

import { ReactNode, createContext, useCallback, useState } from "react";
import { Toast, ToastClose } from "@/components/ui/toast";
import { TWithChildren } from "../props";
import { CheckCircle, Info, XCircle } from "lucide-react";

export type Status = "success" | "error" | "info";

type TNotificationContext = {
  notify: (_text: ReactNode, _status?: Status, _seconds?: number) => void;
};

export const NotificationsContext = createContext<TNotificationContext>({
  notify: () => null,
});

type ToastItem = {
  id: string;
  text: ReactNode;
  status: Status;
};

export const NotificationsProvider = ({ children }: TWithChildren) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback(
    (text: ReactNode, status: Status = "info", seconds: number = 5) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, text, status }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, seconds * 1000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (status: Status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <NotificationsContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.status === "success" ? "success" : toast.status === "error" ? "destructive" : "default"}
            className="group"
          >
            <div className="flex items-center gap-2">
              {getIcon(toast.status)}
              <div className="flex-1">{toast.text}</div>
            </div>
            <ToastClose onClick={() => removeToast(toast.id)} />
          </Toast>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
};

