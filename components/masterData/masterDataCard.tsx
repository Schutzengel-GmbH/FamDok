import { FullMasterData } from "@/types/prismaHelperTypes";
import { Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";

interface MasterDataCardProps {
  masterData: FullMasterData;
}

export default function MasterDataCard({ masterData }: MasterDataCardProps) {
  const router = useRouter();
  return (
    <Paper
      sx={{
        p: ".5rem",
        ":hover": { backgroundColor: "lightblue", cursor: "pointer" },
      }}
      onClick={() =>
        router.push(
          `/masterData/${masterData.masterDataTypeId}/${masterData.number}`
        )
      }
    >
      <Typography variant="h5">
        {masterData.masterDataTypeName} - {masterData.number}
      </Typography>
      <Typography>
        Erstellt {new Date(masterData.createdAt).toLocaleDateString()}
      </Typography>
    </Paper>
  );
}
