import DataFieldCard from "@/components/masterData/dataFieldCard";
import { FullDataField } from "@/types/prismaHelperTypes";
import { useMasterDataByNumber } from "@/utils/apiHooks";
import { Box, Typography } from "@mui/material";

interface MasterDataByNumberProps {
  masterDataTypeId: string;
  masterDataNumber: string;
}

export default function MasterDataByNumber({
  masterDataNumber,
  masterDataTypeId,
}: MasterDataByNumberProps) {
  const { masterData, error, isLoading, mutate } = useMasterDataByNumber(
    masterDataTypeId,
    parseInt(masterDataNumber)
  );

  const handleAnswerChanged = (dataField: FullDataField) => {};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <Typography variant="h4">
        {masterData.masterDataTypeName} - {masterData.number}
      </Typography>
      {masterData.masterDataType.dataFields.map((df) => (
        <DataFieldCard
          dataField={df}
          answer={masterData.answers.find((a) => a.dataFieldId === df.id)}
          onChange={() => handleAnswerChanged(df)}
        />
      ))}
    </Box>
  );
}
