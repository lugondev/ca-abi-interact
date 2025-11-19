"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AlertType = "alert" | "confirm";

type AlertOptions = {
  title?: string;
  message: string;
  type: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type AlertContextType = {
  showAlert: (message: string, title?: string) => void;
  showConfirm: (
    message: string,
    title?: string,
    options?: { confirmText?: string; cancelText?: string }
  ) => Promise<boolean>;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    title: "",
    message: "",
    type: "alert",
  });

  const showAlert = useCallback((message: string, title?: string) => {
    setAlertOptions({
      title: title || "Alert",
      message,
      type: "alert",
      confirmText: "OK",
    });
    setIsOpen(true);
  }, []);

  const showConfirm = useCallback(
    (
      message: string,
      title?: string,
      options?: { confirmText?: string; cancelText?: string }
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setAlertOptions({
          title: title || "Confirm",
          message,
          type: "confirm",
          confirmText: options?.confirmText || "Confirm",
          cancelText: options?.cancelText || "Cancel",
          onConfirm: () => {
            setIsOpen(false);
            resolve(true);
          },
          onCancel: () => {
            setIsOpen(false);
            resolve(false);
          },
        });
        setIsOpen(true);
      });
    },
    []
  );

  const handleConfirm = () => {
    if (alertOptions.onConfirm) {
      alertOptions.onConfirm();
    } else {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    if (alertOptions.onCancel) {
      alertOptions.onCancel();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertOptions.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertOptions.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertOptions.type === "confirm" && (
              <AlertDialogCancel onClick={handleCancel}>
                {alertOptions.cancelText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction onClick={handleConfirm}>
              {alertOptions.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
};
