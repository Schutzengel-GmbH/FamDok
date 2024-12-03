import DataFieldCard from "@/components/masterData/dataFieldCard";
import { FullDataFieldAnswer, FullMasterData } from "@/types/prismaHelperTypes";
import { getAnswerString } from "@/utils/masterDataUtils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ReactMarkdown from "react-markdown";

interface MasterDataInfoDialogProps {
  masterData: Partial<FullMasterData>;
  open: boolean;
  onClose: () => void;
}

export default function MasterDataInfoDialog({
  masterData,
  open,
  onClose,
}: MasterDataInfoDialogProps) {
  return (
    <Dialog open={open}>
      <DialogTitle>
        {`${masterData.masterDataTypeName} - ${masterData.number} `}
      </DialogTitle>
      <DialogContent>
        <ReactMarkdown>
          {masterData.masterDataType.dataFields.reduce(
            (prev, df) =>
              prev +
              "\n\n" +
              `**${df.text}:** ` +
              getAnswerString(
                masterData.answers.find((a) => a.dataFieldId === df.id),
                df.type
              ),
            ""
          )}
        </ReactMarkdown>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
}

