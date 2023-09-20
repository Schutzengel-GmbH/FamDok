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
  Switch,
  TextField,
} from "@mui/material";
import { Prisma, QuestionType } from "@prisma/client";
import QuestionTypeSelect from "@/components/editSurvey/questionTypeSelect";
import { useEffect, useState } from "react";
import ScaleNamesComponent from "./scaleNamesComponent";
import SelectOptionsComponent from "./selectOptionsComponent";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import { IQuestions } from "@/pages/api/surveys/[survey]/questions";
import { FullSurvey } from "@/types/prismaHelperTypes";
import useToast from "@/components/notifications/notificationContext";

export interface EditQuestionDialogProps {
  question?: Prisma.QuestionGetPayload<{ include: { selectOptions: true } }>;
  survey: FullSurvey;
  open: boolean;
  onClose: () => void;
}

interface QuestionState {
  id?: string;
  questionTitle?: string | null;
  questionText: string;
  type: QuestionType;
  required?: boolean;
  questionDescription?: string | null;
  selectOptions?: {
    id?: string;
    value: string;
    isOpen?: boolean;
    info?: string;
  }[];
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
  numberInSurvey?: number | null;
}

const initialQuestionState: QuestionState = {
  questionTitle: "",
  questionText: "",
  type: QuestionType.Text,
  required: false,
  questionDescription: "",
  selectOptions: null,
  selectMultiple: null,
  intRange: null,
  intRangeHigh: null,
  intRangeLow: null,
  numRange: null,
  numRangeHigh: null,
  numRangeLow: null,
  defaultAnswerText: null,
  defaultAnswerInt: null,
  defaultAnswerNum: null,
  defaultAnswerDate: null,
  defaultAnswerBool: null,
  numberInSurvey: null,
};

export default function EditQuestionDialog({
  question,
  survey,
  open,
  onClose,
}: EditQuestionDialogProps) {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [questionReady, setQuestionReady] = useState<boolean>(false);

  const [questionState, updateQuestionState] = useState<QuestionState>(
    question || initialQuestionState
  );

  useEffect(() => {
    const hasText =
      questionState.questionText && questionState.questionText !== "";

    const selectHasOption =
      questionState.type === QuestionType.Select
        ? questionState.selectOptions?.length > 0
        : true;

    const scaleHasOption =
      questionState.type === QuestionType.Scale
        ? questionState.selectOptions?.length > 0
        : true;

    setQuestionReady(hasText && selectHasOption && scaleHasOption);
  }, [questionState]);

  useEffect(
    () => updateQuestionState(question || initialQuestionState),
    [question]
  );

  function handleClose() {
    updateQuestionState(question || initialQuestionState);
    onClose();
  }

  async function handleSave() {
    setLoading(true);
    if (!question) {
      const res = await apiPostJson<IQuestions>(
        `/api/surveys/${survey.id}/questions`,
        getCreateInputFromState(
          { ...questionState, numberInSurvey: survey.questions.length + 1 },
          survey.id
        )
      );
      if (res instanceof FetchError)
        addToast({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addToast({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });
        else {
          addToast({ message: "Frage hinzugefügt", severity: "success" });
        }
      }
      setLoading(false);
    } else {
      const res = await apiPostJson<IQuestions>(
        `/api/surveys/${survey.id}/questions/${question.id}`,
        {
          updateInput: getUpdateInputFromState(questionState, survey.id),
          selectOptionsToDelete: question.selectOptions
            .map((o) => o.id)
            .filter(
              (id) => !questionState.selectOptions.map((o) => o.id).includes(id)
            ),
        }
      );
      if (res instanceof FetchError)
        addToast({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addToast({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });
        else {
          addToast({ message: "Frage geändert", severity: "success" });
        }
        setLoading(false);
      }
    }
    handleClose();
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
          label="Titel (optional)"
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

        <FormControlLabel
          control={
            <Switch
              checked={questionState.required}
              onChange={(e) => {
                updateQuestionState({
                  ...questionState,
                  required: e.target.checked,
                });
              }}
            />
          }
          label={"Frage erforderlich?"}
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
              value={questionState.intRangeLow ?? null}
              onChange={(e) => {
                updateQuestionState({
                  ...questionState,
                  intRangeLow: parseInt(e.target.value) ?? null,
                });
              }}
            />
            <TextField
              sx={{ mt: ".5rem" }}
              label={"Max"}
              type={"number"}
              value={questionState.intRangeHigh ?? null}
              onChange={(e) => {
                updateQuestionState({
                  ...questionState,
                  intRangeHigh: parseInt(e.target.value) ?? null,
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
        <Button onClick={handleSave} disabled={!questionReady}>
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
    info: o.info,
  }));

  return {
    questionTitle: state.questionTitle,
    questionText: state.questionText,
    type: state.type,
    required: state.required,
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
    numberInSurvey: state.numberInSurvey,
  };
}

function getUpdateInputFromState(
  state: QuestionState,
  surveyId: string
): Prisma.QuestionUpdateInput {
  const selectOptions = state.selectOptions?.map((o) => ({
    id: o.id,
    value: o.value,
    isOpen: o.isOpen,
    info: o.info,
  }));

  return {
    questionTitle: state.questionTitle,
    questionText: state.questionText,
    type: state.type,
    required: state.required,
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
      ? {
          deleteMany: selectOptions.map((s) => ({ id: s.id })),
          createMany: {
            data: selectOptions.map((s) => ({
              value: s.value,
              isOpen: s.isOpen,
              info: s.info,
            })),
          },
        }
      : undefined,
    defaultAnswerText: state.defaultAnswerText,
    defaultAnswerBool: state.defaultAnswerBool,
    defaultAnswerDate: state.defaultAnswerDate,
    defaultAnswerInt: state.defaultAnswerInt,
    defaultAnswerNum: state.defaultAnswerNum,
    numberInSurvey: state.numberInSurvey,
  };
}

