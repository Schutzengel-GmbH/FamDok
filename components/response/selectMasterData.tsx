import MasterDataInfoIcon from "@/components/masterData/masterDataInfoDialog/masterDataInfoIcon";
import { IMasterDataByNumber } from "@/pages/api/masterDataType/[masterDataType]/[masterData]/[number]";
import { useMasterData } from "@/utils/apiHooks";
import { apiGet, FetchError } from "@/utils/fetchApiUtils";
import { Alert, Box, Paper, TextField, Typography } from "@mui/material";
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
    <Paper
      sx={{
        p: ".5rem",
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        border: !masterData ? "2px solid red" : "none",
      }}
      elevation={3}
    >
      {!masterData && !numberString && (
        <Alert severity="error" key={"relationMissing"}>
          {`Kein Stammdatensatz ${masterDataType.name} ausgewählt.`}
        </Alert>
      )}
      {!masterData && numberString && (
        <Alert severity="error" key={"relationMissing"}>
          {`Kein Stammdatensatz ${masterDataType.name} mit Nummer ${numberString} gefunden.`}
        </Alert>
      )}
      {masterData && (
        <Alert severity="success">
          <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            {`Ausgewählter Stammdatensatz: ${masterDataType?.name} ${masterData?.number}`}{" "}
            <MasterDataInfoIcon masterData={masterData} />
          </Box>
        </Alert>
      )}
      <Typography>
        {masterData
          ? `Andere ${masterDataType.name} auswählen`
          : `${masterDataType?.name} auswählen`}
      </Typography>
      <TextField value={numberString} onChange={handleChange} />
    </Paper>
  );
}

