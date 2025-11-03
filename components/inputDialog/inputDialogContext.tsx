import InputDialog, {
  InputDialogProps,
} from "@/components/inputDialog/inputDialog";
import React, { useState, useEffect, useContext, ReactNode } from "react";

interface IInputDialogContext {
  showInputDialog: (dialog: InputDialogInput) => void;
}

export const InputDialogContext = React.createContext<
  IInputDialogContext | undefined
>(undefined);

export type InputDialogInput = {
  title: string;
  body?: string | JSX.Element;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel?: (value?: string) => void;
};

export function InputDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dialogProps, setDialogProps] = useState<InputDialogInput>();
  const [open, setOpen] = useState(false);

  const showInputDialog = (dialogProps: InputDialogInput) => {
    setDialogProps(dialogProps);
    setOpen(true);
  };

  const value = { showInputDialog };

  function confirm(value: string) {
    dialogProps.onConfirm(value);
    setOpen(false);
  }

  function cancel() {
    if (dialogProps?.onCancel) dialogProps?.onCancel();
    setOpen(false);
  }

  return (
    <InputDialogContext.Provider value={value}>
      {children}
      <InputDialog
        title={dialogProps?.title}
        initialValue={dialogProps?.initialValue}
        body={dialogProps?.body || ""}
        open={open}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </InputDialogContext.Provider>
  );
}

function useInputDialog() {
  const context = useContext(InputDialogContext);
  if (context === undefined)
    throw new Error("useInputDialog must be within InputDialogProvider");
  else return context;
}

export default useInputDialog;
