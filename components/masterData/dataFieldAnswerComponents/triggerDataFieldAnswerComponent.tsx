import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { RecursivePartial } from "@/types/utilTypes";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { CollectionDataDate, DataField } from "@prisma/client";
import { useState } from "react";
import DatePickerComponent from "@/components/utilityComponents/datePickerComponent";
import submitAnswers from "@/pages/api/masterDataType/[masterDataType]/[masterData]/[number]/submitAnswers";
import { submitMasterDataAnswers } from "@/utils/masterDataUtils";
import { useRouter } from "next/router";
import { useMasterDataByNumber } from "@/utils/apiHooks";
import { Delete, DeleteForever } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

export interface DataFieldAnswerComponentProps {
  answer: RecursivePartial<FullDataFieldAnswer>;
  canEdit: boolean;
  dataField: FullDataField;
  onChange: (answer: RecursivePartial<FullDataFieldAnswer>) => void;
}
//TODO: Clean this mess up
export default function TriggerDataFieldAnswerComponent({
  answer: stateAnswer,
  canEdit,
  dataField,
  onChange,
}: DataFieldAnswerComponentProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(undefined);

  const router = useRouter();
  const { masterDataTypeId, masterDataNumber } = router.query;

  const { masterData } = useMasterDataByNumber(
    masterDataTypeId as string,
    parseInt(masterDataNumber as string),
  );

  const mutlipleTriggers = dataField.triggerMultiple;

  const answer = masterData.answers.find((a) => a.dataFieldId === dataField.id);

  const [collectionDataDate, setCollectionDataDate] = useState<
    Partial<CollectionDataDate>[]
  >(
    mutlipleTriggers
      ? answer?.answerCollection?.collectionDataDate || []
      : undefined,
  );

  const dates = mutlipleTriggers
    ? answer?.answerCollection?.collectionDataDate?.map((a) => a.value) || []
    : undefined;

  async function handleSave() {
    let error;
    if (mutlipleTriggers) {
      const res = await submitMasterDataAnswers(
        masterDataTypeId as string,
        parseInt(masterDataNumber as string),
        [
          {
            id: answer.id,
            dataFieldId: dataField.id,
            collectionId: answer?.collectionId || undefined,
            answerCollection: {
              //TODO: fix this, but requires quite a refactor...
              collectionDataDate: [
                //@ts-expect-error bad definitions for RecursivePartial, should be fine
                ...collectionDataDate,
                //@ts-expect-error bad definitions for RecursivePartial, should be fine
                { collectionId: answer.collectionId, value: date },
              ],
            },
          },
        ],
      );
      console.log(res);
      error = res.error;
    } else {
      const res = await submitMasterDataAnswers(
        masterDataTypeId as string,
        parseInt(masterDataNumber as string),
        [
          {
            id: answer?.id,
            dataFieldId: dataField.id,
            answerDate: date,
          },
        ],
      );
      error = res.error;
    }
    if (error) alert(error);
    else
      router.push(
        `/surveys/${dataField.triggeredSurveyId}/newResponse?number=${masterDataNumber}&mdt=${masterDataTypeId}`,
      );
  }

  function handleCancel() {
    setDate(new Date());
    setOpen(false);
  }

  function handleDelete(i: number) {
    const newCollection = collectionDataDate?.filter((_, index) => index != i);
    setCollectionDataDate(newCollection);
    onChange({
      ...answer,
      answerCollection: { collectionDataDate: newCollection },
    });
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: "300px",
        }}
      >
        {mutlipleTriggers &&
          collectionDataDate?.map((d, i) => (
            <Paper
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: ".5rem",
                pl: "1rem",
                pr: "1rem",
                maxWidth: "500px",
              }}
              elevation={3}
            >
              <Typography>{new Date(d.value).toLocaleDateString()}</Typography>
              {canEdit && (
                <Button onClick={() => handleDelete(i)}>
                  <Delete /> Löschen
                </Button>
              )}
            </Paper>
          ))}
        {!mutlipleTriggers && answer && (
          <DatePicker
            disabled={!canEdit}
            onChange={(date) => {
              if (date)
                onChange({
                  ...answer,
                  answerDate: date,
                  dataFieldId: dataField.id,
                });
            }}
            //@ts-ignore
            value={answer?.answerDate ? new Date(answer.answerDate) : undefined}
          />
        )}
      </Box>
      <Button
        disabled={
          !canEdit || (!mutlipleTriggers && answer?.answerDate !== undefined)
        }
        onClick={() => setOpen(true)}
      >
        Hinzufügen: {dataField.text}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{dataField.text}</DialogTitle>
        <DialogContent>
          <DatePickerComponent
            currentAnswer={date}
            onChange={(v) => {
              setDate(v);
            }}
          />
          <Typography sx={{ mt: "1rem" }}>
            Achtung, beim Bestätigen wird zur Umfrage{" "}
            {dataField.triggeredSurvey.name} weitergeleitet und alle sonstigen
            Änderungen werden verworfen.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Bestätigen</Button>
          <Button onClick={handleCancel}>Abbrechen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
