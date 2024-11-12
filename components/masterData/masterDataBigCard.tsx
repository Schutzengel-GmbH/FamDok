import DataFieldCard from "@/components/masterData/dataFieldCard";
import { FullMasterData } from "@/types/prismaHelperTypes";
import { Edit } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";

interface MasterDataBigCardProps {
  masterData: FullMasterData;
}

export default function MasterDataBigCard({
  masterData,
}: MasterDataBigCardProps) {
  const router = useRouter();
  const handleEdit = () => {
    router.push(
      `masterData/${masterData.masterDataTypeId}/${masterData.number}`
    );
  };
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        p: ".5rem",
      }}
    >
      <Typography variant="h4">
        {masterData.masterDataType.name} {masterData.number}
      </Typography>
      {masterData.masterDataType.dataFields.map((df) => (
        <DataFieldCard
          dataField={df}
          answer={masterData.answers.find((a) => a.dataFieldId === df.id)}
        />
      ))}
      <Button onClick={handleEdit}>
        <Edit />
      </Button>
    </Paper>
  );
}

