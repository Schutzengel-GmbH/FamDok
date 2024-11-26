import { IMasterDataByNumber } from "@/pages/api/masterDataType/[masterDataType]/[masterData]/[number]";
import { useMasterData } from "@/utils/apiHooks";
import { apiGet, FetchError } from "@/utils/fetchApiUtils";
import { Alert, Box, TextField, Typography } from "@mui/material";
import { MasterData, MasterDataType } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

interface SelectMasterDataProps {
  masterDataType: MasterDataType;
  masterData?: Partial<MasterData>;
  onChange: (masterData: Partial<MasterData>) => void;
}

export default function SelectMasterData({
  masterDataType,
  masterData,
  onChange,
}: SelectMasterDataProps) {
  const [numberString, setNumberString] = useState<string>(
    masterData?.number.toString()
  );

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setNumberString(e.target.value);
    const res = await apiGet<IMasterDataByNumber>(
      `/api/masterDataType/${masterDataType.id}/masterData/${parseInt(
        e.target.value
      )}`
    );
    if (res instanceof FetchError) return;
    onChange(res.masterData);
  };

  return (
    <Box>
      {!masterData && (
        <Alert severity="error" key={"relationMissing"}>
          {`Keine ${masterDataType.name} ausgewählt.`}
        </Alert>
      )}
      {masterData && (
        <Alert severity="success">{`Ausgewählter Stammdatensatz: ${masterDataType?.name} ${masterData?.number}`}</Alert>
      )}
      <Typography>
        {masterData
          ? `Andere ${masterDataType.name} auswählen`
          : `${masterDataType?.name} auswählen`}
      </Typography>
      <TextField value={numberString} onChange={handleChange} />
    </Box>
  );
}

