import MasterDataInfoDialog from "@/components/masterData/masterDataInfoDialog/masterDataInfoDialog";
import { FullMasterData } from "@/types/prismaHelperTypes";
import { getAnswerString } from "@/utils/masterDataUtils";
import { Info } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MasterDataInfoIconProps {
  masterData: Partial<FullMasterData>;
}

export default function MasterDataInfoIcon({
  masterData,
}: MasterDataInfoIconProps) {
  const [open, setOpen] = useState<boolean>(false);

  const infoString = `## ${masterData.masterDataTypeName} - ${masterData.number}
  ${masterData.masterDataType.dataFields.reduce(
    (prev, val) =>
      prev +
      "\n\n" +
      `${val.text}: ${
        getAnswerString(
          masterData.answers.find((a) => val.id === a.dataFieldId),
          val.type
        ) || "-"
      }`,
    ""
  )}`;

  return (
    <Box>
      <Tooltip title={<ReactMarkdown>{infoString}</ReactMarkdown>}>
        <Info
          sx={{ ":hover": { cursor: "pointer" } }}
          fontSize="small"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        />
      </Tooltip>
      <MasterDataInfoDialog
        masterData={masterData}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}

