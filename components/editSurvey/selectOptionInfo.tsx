import { Info } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export type SelectOptionInfoProps = {
  info: string;
};

export default function SelectOptionInfo({ info }: SelectOptionInfoProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={<ReactMarkdown>{info}</ReactMarkdown>}>
        <Info
          fontSize="small"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        />
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <ReactMarkdown>{info}</ReactMarkdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

