import { FullMasterData } from "@/types/prismaHelperTypes";
import { useUsers } from "@/utils/apiHooks";
import { Paper, Typography } from "@mui/material";

interface CreatedByComponentProps {
  masterData: FullMasterData;
  canEdit: boolean;
}

export default function CreatedByComponent({
  canEdit,
  masterData,
}: CreatedByComponentProps) {
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        alignItems: "baseline",
        p: ".5rem",
      }}
    >
      <Typography variant="h6">Verantwortlich</Typography>
      {!canEdit && (
        <Typography>
          {masterData?.createdBy?.name || masterData?.createdBy?.email}
        </Typography>
      )}
      {canEdit && <>IMPLEMENT USER SELECTION</>}
    </Paper>
  );
}

