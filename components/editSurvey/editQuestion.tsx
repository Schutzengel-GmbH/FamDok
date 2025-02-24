import { Save, Cancel, Info } from "@mui/icons-material";
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
  IconButton,
  List,
  ListItem,
  Modal,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CollectionType,
  Prisma,
  QuestionType,
  SelectOption,
} from "@prisma/client";
import QuestionTypeSelect from "@/components/editSurvey/questionTypeSelect";
import { useEffect, useState } from "react";
import ScaleNamesComponent from "./scaleNamesComponent";
import SelectOptionsComponent from "./selectOptionsComponent";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import questions, { IQuestions } from "@/pages/api/surveys/[survey]/questions";
import { FullQuestion, FullSurvey } from "@/types/prismaHelperTypes";
import useToast from "@/components/notifications/notificationContext";
import useInfoDialog from "../infoDialog/infoDialogContext";
import CollectionTypeSelect from "@/components/masterDataTypes/collectionTypeSelect";
import { JsonValue } from "@prisma/client/runtime/library";
import DependencyTest from "@/components/editSurvey/dependencyTest";

export interface EditQuestionDialogProps {
  question?: Prisma.QuestionGetPayload<{ include: { selectOptions: true } }>;
  survey: FullSurvey;
  open: boolean;
  onClose: () => void;
}

export interface QuestionState {
  id?: string;
  questionTitle?: string | undefined;
  questionText: string;
  type: QuestionType;
  required?: boolean;
  questionDescription?: string | undefined;
  selectOptions?: {
    id?: string;
    value: string;
    isOpen?: boolean;
    info?: string;
  }[];
  selectMultiple?: boolean | undefined;
  intRange?: boolean | undefined;
  intRangeHigh?: number | undefined;
  intRangeLow?: number | undefined;
  numRange?: boolean | undefined;
  numRangeHigh?: number | undefined;
  numRangeLow?: number | undefined;
  defaultAnswerText?: string | undefined;
  defaultAnswerInt?: number | undefined;
  defaultAnswerNum?: number | undefined;
  defaultAnswerDate?: Date | undefined;
  defaultAnswerBool?: boolean | undefined;
  numberInSurvey?: number | undefined;
  autocomplete?: boolean | undefined;
  collectionType?: CollectionType | undefined;
  isDependent?: boolean | undefined;
  dependencyTest?: PrismaJson.DependencyTest | JsonValue | undefined;
}

const initialQuestionState: QuestionState = {
  questionTitle: "",
  questionText: "",
  type: QuestionType.Text,
  required: false,
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
  numberInSurvey: undefined,
  autocomplete: undefined,
  collectionType: undefined,
  isDependent: undefined,
  dependencyTest: undefined,
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

  const editingExisting = question !== undefined;

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

    const dependencyTest =
      questionState?.dependencyTest as PrismaJson.DependencyTest;

    const dependentHasTest = questionState.isDependent
      ? dependencyTest?.questionId !== undefined
      : true;

    setQuestionReady(
      hasText && selectHasOption && scaleHasOption && dependentHasTest
    );
  }, [questionState]);

  useEffect(
    () => updateQuestionState(question || initialQuestionState),
    [question]
  );

  function handleClose() {
    updateQuestionState(question || initialQuestionState);
    onClose();
  }

  console.log(questionState.dependencyTest);

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

  const { showInfoDialog } = useInfoDialog();

  function handleInfoClick() {
    showInfoDialog({
      title: "Achtung",
      body: (
        <Box>
          <Typography>
            Bei der Bearbeitung von Fragen können folgende Probleme auftreten:
          </Typography>
          <List>
            <ListItem>
              Allgemein kann jede Änderung die Natur der Frage verändern und
              ggf. zu inhaltlichen Problemen führen.
            </ListItem>
            <ListItem>
              Wenn der Fragentyp geändert wird, werden alle abgegebenen
              Antworten ungültig (undefined).
            </ListItem>
            <ListItem>
              Wenn bei einer Auswahlfrage oder einer Skalafrage Optionen
              gelöscht werden, werden die Antworten auch gelöscht.
            </ListItem>
          </List>
        </Box>
      ),
    });
  }

  function handleAutocompleteClick() {
    showInfoDialog({
      title: "Achtung",
      body: (
        <Box>
          <Typography>Die Option Autovervollständigung bewirkt:</Typography>
          <List>
            <ListItem>
              Bei der Eingabe wird den Antwortenden aus allen bisher gegebenen
              Antworten beim Tippen etwas vorgeschlagen.
            </ListItem>
            <ListItem>
              Dadurch haben alle Eingebenden Zugriff auf alle bisher abgegebenen
              Antworten zu dieser Frage. Daher sollte diese Option auf keinen
              Fall bei potentiell sensiblen Daten verwendet werden!
            </ListItem>
          </List>
        </Box>
      ),
    });
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {question
          ? `${question.questionTitle || "Frage"} bearbeiten`
          : "Frage erstellen"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        {editingExisting && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: ".5rem",
              alignItems: "center",
            }}
          >
            <Typography color={"error"}>
              Achtung! Beim Bearbeiten einer Frage, zu der bereits Antworten
              vorliegen, können Daten verlorengehen oder verfälscht werden.
            </Typography>
            <IconButton onClick={handleInfoClick}>
              <Info color={"error"} sx={{ ":hover": { cursor: "pointer" } }} />
            </IconButton>
          </Box>
        )}
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
          <Box sx={{ mt: ".5rem", display: "flex", flexDirection: "column" }}>
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
            <Tooltip
              title={
                "Achtung, Autovervollständigung lässt potentiell alle Antwortenden alle bestehenden Antworten zur Frage einsehen."
              }
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  sx={{ mt: ".5rem" }}
                  control={
                    <Checkbox
                      checked={questionState.autocomplete || false}
                      onChange={(e) => {
                        updateQuestionState({
                          ...questionState,
                          autocomplete: e.target.checked,
                        });
                      }}
                    />
                  }
                  label="Autovervollständigung"
                />
                <IconButton onClick={handleAutocompleteClick}>
                  <Info
                    color={"error"}
                    sx={{ ":hover": { cursor: "pointer" } }}
                  />
                </IconButton>
              </Box>
            </Tooltip>
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
        {questionState.type === QuestionType.Collection && (
          <CollectionTypeSelect
            sx={{ mt: "1rem" }}
            collectionType={questionState.collectionType || undefined}
            onChange={(ct) =>
              updateQuestionState({ ...questionState, collectionType: ct })
            }
          />
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
        <FormControlLabel
          sx={{ mt: ".5rem" }}
          control={
            <Checkbox
              checked={questionState.isDependent || false}
              onChange={(e) => {
                updateQuestionState({
                  ...questionState,
                  isDependent: e.target.checked,
                });
              }}
            />
          }
          label="Abhängige Frage"
        />
        {questionState.isDependent && (
          <DependencyTest
            questionId={questionState?.id}
            questions={survey.questions}
            dependencyTest={
              questionState.dependencyTest as PrismaJson.DependencyTest
            }
            onChange={(dependencyTest) =>
              updateQuestionState({ ...questionState, dependencyTest })
            }
          />
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
    autocomplete: state.autocomplete,
    collectionType: state.collectionType,
    isDependent: state.isDependent,
    dependencyTest: state.dependencyTest,
  };
}

export type QuestionUpdateInput = Omit<
  Prisma.QuestionUpdateInput,
  "selectOptions"
> & { selectOptions: Partial<SelectOption>[] };

function getUpdateInputFromState(
  state: QuestionState,
  surveyId: string
): QuestionUpdateInput {
  //  const selectOptions = state.selectOptions?.map((o) => ({
  //    id: o.id,
  //    value: o.value,
  //    isOpen: o.isOpen,
  //    info: o.info,
  //  }));

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
    selectOptions: state.selectOptions,
    defaultAnswerText: state.defaultAnswerText,
    defaultAnswerBool: state.defaultAnswerBool,
    defaultAnswerDate: state.defaultAnswerDate,
    defaultAnswerInt: state.defaultAnswerInt,
    defaultAnswerNum: state.defaultAnswerNum,
    numberInSurvey: state.numberInSurvey,
    autocomplete: state.autocomplete,
    collectionType: state.collectionType,
    isDependent: state.isDependent,
    dependencyTest: state.dependencyTest,
  };
}
