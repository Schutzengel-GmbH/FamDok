import {
  InfoDialog,
  InfoDialogProps,
} from "@/components/infoDialog/infoDialog";
import React, { useState, useEffect, useContext, ReactNode } from "react";

interface IInfoDialogContext {
  showInfoDialog: (dialog: InfoDialogInput) => void;
}

export const InfoDialogContext = React.createContext<
  IInfoDialogContext | undefined
>(undefined);

export type InfoDialogInput = {
  title: string;
  body: React.ReactNode;
};

export function InfoDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dialogProps, setDialogProps] = useState<InfoDialogInput>();
  const [open, setOpen] = useState(false);

  const showInfoDialog = (dialogProps: InfoDialogInput) => {
    setDialogProps(dialogProps);
    setOpen(true);
  };

  const value = { showInfoDialog };

  return (
    <InfoDialogContext.Provider value={value}>
      {children}
      <InfoDialog
        title={dialogProps?.title || ""}
        body={dialogProps?.body || ""}
        open={open}
        onClose={() => setOpen(false)}
      />
    </InfoDialogContext.Provider>
  );
}

function useInfoDialog() {
  const context = useContext(InfoDialogContext);
  if (context === undefined)
    throw new Error("useInfoDialog must be within InfoDialogProvider");
  else return context;
}

export default useInfoDialog;
