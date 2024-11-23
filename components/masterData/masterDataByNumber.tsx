import DataFieldCard from "@/components/masterData/dataFieldCard";
import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { useMasterDataByNumber } from "@/utils/apiHooks";
import {
  submitMasterDataAnswers,
  updateMasterData,
} from "@/utils/masterDataUtils";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [masterDataAnswersState, setMasterDataAnswersState] = useState<
    Partial<FullDataFieldAnswer>[]
  >(masterData?.answers || []);

  useEffect(() => {
    setMasterDataAnswersState(masterData?.answers || []);
  }, [masterData]);

  const handleAnswerChanged = (
    dataField: FullDataField,
    answer: Partial<FullDataFieldAnswer>
  ) => {
    if (masterDataAnswersState?.find((a) => a.dataFieldId === dataField.id))
      setMasterDataAnswersState(
        masterDataAnswersState?.map((a) =>
          a.dataFieldId === dataField.id ? answer : a
        )
      );
    else
      setMasterDataAnswersState([
        ...masterDataAnswersState,
        { ...answer, dataFieldId: dataField.id },
      ]);
  };
  console.log(masterDataAnswersState);

  const router = useRouter();

  const saveChanges = async () => {
    try {
      const res = await submitMasterDataAnswers(
        masterDataTypeId,
        Number(masterDataNumber),
        masterDataAnswersState
      );
      router.push("/masterData");
      mutate();
    } catch (e) {}
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <Typography variant="h4">
        {masterData?.masterDataTypeName} - {masterData?.number}
      </Typography>
      <Button onClick={saveChanges}>Save</Button>
      {masterData?.masterDataType.dataFields.map((df) => (
        <DataFieldCard
          key={df.id}
          dataField={df}
          answer={masterDataAnswersState?.find((a) => a.dataFieldId === df.id)}
          onChange={(a) => handleAnswerChanged(df, a)}
        />
      ))}
    </Box>
  );
}
