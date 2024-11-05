import EditDataField from "@/components/masterDataTypes/editDataField";
import { FullMasterDataType } from "@/types/prismaHelperTypes";
import { Box } from "@mui/material";

interface DataFieldsProps {
  masterDataType: FullMasterDataType;
  onChange: () => void;
}

export default function DataFields({
  masterDataType,
  onChange,
}: DataFieldsProps) {
  console.log(masterDataType);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {masterDataType.dataFields.map((df) => (
        <EditDataField
          masterDataType={masterDataType}
          dataField={df}
          onSave={() => onChange()}
        />
      ))}
    </Box>
  );
}
