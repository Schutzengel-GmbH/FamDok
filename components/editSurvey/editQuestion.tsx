import { Save, Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Modal,
  TextField,
} from "@mui/material";
import { Prisma, QuestionType } from "@prisma/client";
import QuestionTypeSelect from "@/components/editSurvey/questionTypeSelect";
import { useState } from "react";
import ScaleNamesComponent from "./scaleNamesComponent";
import SelectOptionsComponent from "./selectOptionsComponent";
import useNotification from "@/components/utilityComponents/notificationContext";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import { IQuestions } from "@/pages/api/surveys/[survey]/questions";

export interface EditQuestionDialogProps {
  question?: Prisma.QuestionGetPayload<{ include: { selectOptions: true } }>;
  surveyId: string;
  open: boolean;
  onClose: () => void;
}

interface QuestionState {
  id?: string;
  questionTitle?: string | null;
  questionText: string;
  type: QuestionType;
  questionDescription?: string | null;
  selectOptions?: { value: string; isOpen?: boolean }[];
  selectMultiple?: boolean | null;
  intRange?: boolean | null;
  intRangeHigh?: number | null;
  intRangeLow?: number | null;
  numRange?: boolean | null;
  numRangeHigh?: number | null;
  numRangeLow?: number | null;
  defaultAnswerText?: string | null;
  defaultAnswerInt?: number | null;
  defaultAnswerNum?: number | null;
  defaultAnswerDate?: Date | null;
  defaultAnswerBool?: boolean | null;
}

const initialQuestionState: QuestionState = {
  questionTitle: "",
  questionText: "",
  type: QuestionType.Text,
  questionDescription: "",
  selectOptions: undefined,
  selectMultiple: undefined,
  intRange: undefined,
  intRangeHigh: undefined,
  intRangeLow: undefined,
  numRange: undefined,
  numRangeHigh: undefined,
  numRangeLow: undefined,
  defaultAnswerText: undefined,
  defaultAnswerInt: undefined,
  defaultAnswerNum: undefined,
  defaultAnswerDate: undefined,
  defaultAnswerBool: undefined,
};

export default function EditQuestionDialog({
  question,
  surveyId,
  open,
  onClose,
}: EditQuestionDialogProps) {
  const { addAlert } = useNotification();

  const [loading, setLoading] = useState(false);

  const [questionState, updateQuestionState] = useState<QuestionState>(
    question || initialQuestionState
  );

  function handleClose() {
    updateQuestionState(question || initialQuestionState);
    onClose();
  }

  async function handleSave() {
    setLoading(true);
    if (!question) {
      const res = await apiPostJson<IQuestions>(
        `/api/surveys/${surveyId}/questions`,
        getCreateInputFromState(questionState, surveyId)
      );
      if (res instanceof FetchError)
        addAlert({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addAlert({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });
        else {
          handleClose();
          addAlert({ message: "Frage hinzugefügt", severity: "success" });
        }
      }
      setLoading(false);
    } else {
      const res = await apiPostJson<IQuestions>(
        `/api/surveys/${surveyId}/questions/${question.id}`,
        getCreateInputFromState(questionState, surveyId)
      );
      if (res instanceof FetchError)
        addAlert({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addAlert({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });
        else {
          handleClose();
          addAlert({ message: "Frage geändert", severity: "success" });
        }
        setLoading(false);
      }
    }
  }

  if (loading)
    return (
      <Modal open>
        <CircularProgress />
      </Modal>
    );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {question
          ? `${question.questionTitle || "Frage"} bearbeiten`
          : "Frage erstellen"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          sx={{ mt: ".5rem" }}
          value={questionState.questionTitle || ""}
          onChange={(e) =>
            updateQuestionState({
              ...questionState,
              questionTitle: e.currentTarget.value,
            })
          }
          label="Titel"
        />

        <TextField
          sx={{ mt: ".5rem" }}
          value={questionState.questionText || ""}
          onChange={(e) =>
            updateQuestionState({
              ...questionState,
              questionText: e.currentTarget.value,
            })
          }
          label="Frage-Text"
        />

        <TextField
          sx={{ mt: ".5rem" }}
          value={questionState.questionDescription || ""}
          onChange={(e) =>
            updateQuestionState({
              ...questionState,
              questionDescription: e.currentTarget.value,
            })
          }
          label="Beschreibung / Hinweise"
        />

        <QuestionTypeSelect
          value={questionState.type}
          onChange={(t) => updateQuestionState({ ...questionState, type: t })}
        />

        {questionState.type === QuestionType.Text && (
          <Box sx={{ mt: ".5rem" }}>
            <TextField
              label={"Standardantwort"}
              value={questionState.defaultAnswerText || undefined}
              onChange={(e) => {
                updateQuestionState({
                  ...questionState,
                  defaultAnswerText: e.target.value || undefined,
                });
              }}
            />
          </Box>
        )}

        {questionState.type === QuestionType.Int && (
          <>
            <TextField
              sx={{ mt: ".5rem" }}
              label={"Standardantwort"}
              type={"number"}
              value={questionState.defaultAnswerInt || 0}
              onChange={(e) => {
                updateQuestionState({
                  ...questionState,
                  defaultAnswerInt: parseInt(e.target.value) || 0,
                });
              }}
            />
            <FormControlLabel
              sx={{ mt: ".5rem" }}
              control={
                <Checkbox
                  checked={questionState.intRange || false}
                  onChange={(e) => {
                    updateQuestionState({
                      ...questionState,
                      intRange: e.target.checked,
                      intRangeHigh: e.target.checked ? 0 : undefined,
                      intRangeLow: e.target.checked ? 0 : undefined,
                    });
                  }}
                />
              }
              label="Eingabe eingrenzen"
            />
          </>
        )}

        {questionState.type === QuestionType.Num && (
          <TextField
            sx={{ mt: ".5rem" }}
            label={"Standardantwort"}
            type={"number"}
            value={questionState.defaultAnswerNum || 0}
            onChange={(e) => {
              updateQuestionState({
                ...questionState,
                defaultAnswerNum: parseFloat(e.target.value) || 0,
              });
            }}
          />
        )}

        {questionState.type === QuestionType.Int && questionState.intRange && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <TextField
              sx={{ mt: ".5rem" }}
              label={"Min"}
              type={"number"}
              value={questionState.intRangeLow || 0}
              onChange={(e) => {
                updateQuestionState({
                  ...questionState,
                  intRangeLow: parseInt(e.target.value) || 0,
                });
              }}
            />
            <TextField
              sx={{ mt: ".5rem" }}
              label={"Max"}
              type={"number"}
              value={questionState.intRangeHigh || 0}
              onChange={(e) => {
                updateQuestionState({
                  ...questionState,
                  intRangeHigh: parseInt(e.target.value) || 0,
                });
              }}
            />
          </Box>
        )}

        {questionState.type === QuestionType.Select && (
          <>
            <FormControlLabel
              sx={{ mt: ".5rem" }}
              control={
                <Checkbox
                  checked={questionState.selectMultiple || false}
                  onChange={(e) =>
                    updateQuestionState({
                      ...questionState,
                      selectMultiple: e.target.checked,
                    })
                  }
                />
              }
              label="Mehrere Antworten zulassen"
            />
            <SelectOptionsComponent
              value={questionState.selectOptions || []}
              onChange={(value) => {
                updateQuestionState({ ...questionState, selectOptions: value });
              }}
            />
          </>
        )}
        {questionState.type === QuestionType.Scale && (
          <Box>
            <ScaleNamesComponent
              value={questionState.selectOptions || []}
              onChange={(s) => {
                updateQuestionState({
                  ...questionState,
                  selectOptions: s,
                });
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>
          <Save /> Speichern
        </Button>
        <Button onClick={handleClose}>
          <Cancel /> Abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getCreateInputFromState(
  state: QuestionState,
  surveyId: string
): Prisma.QuestionCreateInput {
  const selectOptions = state.selectOptions?.map((o) => ({
    value: o.value,
    isOpen: o.isOpen,
  }));

  return {
    questionTitle: state.questionTitle,
    questionText: state.questionText,
    type: state.type,
    questionDescription: state.questionDescription,
    selectMultiple: state.selectMultiple,
    intRange: state.intRange,
    intRangeHigh: state.intRangeHigh,
    intRangeLow: state.intRangeLow,
    numRange: state.numRange,
    numRangeHigh: state.numRangeHigh,
    numRangeLow: state.numRangeLow,
    survey: { connect: { id: surveyId } },
    selectOptions: selectOptions
      ? { createMany: { data: selectOptions } }
      : undefined,
    defaultAnswerText: state.defaultAnswerText,
    defaultAnswerBool: state.defaultAnswerBool,
    defaultAnswerDate: state.defaultAnswerDate,
    defaultAnswerInt: state.defaultAnswerInt,
    defaultAnswerNum: state.defaultAnswerNum,
  };
}
