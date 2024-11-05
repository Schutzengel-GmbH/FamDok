import TextDataFieldInput from "@/components/masterData/masterDataTypes/textDataFieldInput";
import useToast from "@/components/notifications/notificationContext";
import { FullMasterData } from "@/types/prismaHelperTypes";
import { useMasterDataByNumber } from "@/utils/apiHooks";
import { addDataFieldAnswers, updateMasterData } from "@/utils/masterDataUtils";
import { Box, Button, Typography } from "@mui/material";
import { DataField, DataFieldAnswer, MasterData, Prisma } from "@prisma/client";
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
  const { masterData, error } = useMasterDataByNumber(
    masterDataTypeId,
    Number(masterDataNumber)
  );
  const { addToast } = useToast();
  const router = useRouter();
  const dataFields = masterData?.masterDataType?.dataFields;

  useEffect(() => setCurrentAnswers(masterData?.answers), [masterData]);

  const [currentAnswers, setCurrentAnswers] = useState<
    Partial<DataFieldAnswer>[]
  >(masterData?.answers || []);

  const handleSave = async () => {
    try {
      const res = await addDataFieldAnswers(
        masterDataTypeId,
        masterDataNumber,
        //@ts-ignore its fine...
        currentAnswers.filter((a) => a.id),
        //@ts-ignore its fine...
        currentAnswers
      );
      console.log(res);
      addToast({ message: `Update erfolgreich`, severity: "success" });
      router.push("/masterData");
    } catch (e) {
      addToast({ message: `Fehler: ${e}`, severity: "error" });
    }
  };

  const handleCancel = () => {
    router.push("/masterData");
  };

  const handleAnswerChanged = (
    answer: Partial<DataFieldAnswer>,
    dataField: DataField
  ) => {
    const index = currentAnswers.findIndex(
      (a) => a.dataFieldId === dataField.id
    );
    if (index >= 0)
      setCurrentAnswers(
        currentAnswers.map((a, i) => {
          if (i === index) return answer;
          return a;
        })
      );
    else currentAnswers.push({ ...answer, dataFieldId: dataField.id });
  };

  return (
    <Box>
      <Typography variant="h4">{`${masterData?.masterDataType.name} - ${masterData?.number}`}</Typography>

      {dataFields?.map((df) => {
        switch (df.type) {
          case "Text":
            return (
              <TextDataFieldInput
                dataField={df}
                answer={currentAnswers?.find((a) => a.dataFieldId === df.id)}
                onChange={handleAnswerChanged}
              />
            );
          case "Bool":
          case "Int":
          case "Num":
          case "Select":
          case "Date":
          default:
            return <></>;
        }
      })}
      <Box>
        <Button onClick={handleSave}>Speichern</Button>
        <Button onClick={handleCancel}>Abbrechen</Button>
      </Box>
    </Box>
  );
}
