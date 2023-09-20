import {
  ArrowCircleDown,
  ArrowCircleUp,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  MoveDown,
  MoveUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Prisma, QuestionType } from "@prisma/client";
import { useState } from "react";
import EditQuestionDialog from "./editQuestion";
import { getQuestionTypeString } from "@/utils/utils";
import ConfirmDialog from "@/components/utilityComponents/confirmDialog";
import { FetchError, apiDelete } from "@/utils/fetchApiUtils";
import { IQuestion } from "@/pages/api/surveys/[survey]/questions/[question]";
import { FullSurvey } from "@/types/prismaHelperTypes";
import useToast from "@/components/notifications/notificationContext";

export interface ListItemQuestionProps {
  question: Prisma.QuestionGetPayload<{ include: { selectOptions: true } }>;
  survey: FullSurvey;
  moveUp: () => void;
  moveDown: () => void;
  onDataChange: () => void;
}

export default function ListItemQuestion({
  question,
  survey,
  moveDown,
  moveUp,
  onDataChange,
}: ListItemQuestionProps) {
  const { addToast } = useToast();

  const [open, setOpen] = useState<boolean>(false);
  const [delOpen, setDelOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  function handleOpen() {
    setOpen(!open);
  }

  function openEdit() {
    setEditOpen(true);
  }

  function openDelete() {
    setDelOpen(true);
  }

  function getIntRangeHint() {
    if (question.intRangeLow != null && question.intRangeHigh != null)
      return `Von ${question.intRangeLow} bis ${question.intRangeHigh}`;
    else if (question.intRangeLow != null && question.intRangeHigh == null)
      return `Mindestens ${question.intRangeLow}`;
    else if (question.intRangeLow == null && question.intRangeHigh != null)
      return `Höchstens ${question.intRangeHigh}`;
    return "";
  }

  async function deleteQ() {
    const res = await apiDelete<IQuestion>(
      `/api/surveys/${survey.id}/questions/${question.id}`
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
        addToast({ message: "Frage gelöscht", severity: "success" });
        onDataChange();
      }
    }
    setDelOpen(false);
  }

  return (
    <Box>
      <ListItemButton onClick={handleOpen}>
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        <ListItemText
          primary={
            question.questionTitle
              ? question.questionTitle
              : question.questionText
          }
        />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            moveUp();
          }}
          disabled={question.numberInSurvey === 1}
        >
          <ArrowCircleUp />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            moveDown();
          }}
          disabled={question.numberInSurvey === survey.questions.length}
        >
          <ArrowCircleDown />
        </Button>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List sx={{ pl: "1rem", bgcolor: "lightgray" }}>
          <ListItem>
            <ListItemText primary={`Frage: ${question.questionText}`} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Beschreibung: ${
                question.questionDescription || "-keine-"
              }`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Fragetyp: ${getQuestionTypeString(question.type)}`}
            />
          </ListItem>
          {question.type === QuestionType.Select && (
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <strong>{`Antwortoptionen${
                      question.selectMultiple
                        ? " (mehrere Antworten möglich)"
                        : ""
                    }:`}</strong>
                  }
                />
              </ListItem>
              {question.selectOptions.map((o, i) => (
                <ListItem key={i}>
                  <ListItemText primary={o.value} />
                </ListItem>
              ))}
            </List>
          )}
          {question.type === QuestionType.Int && question.intRange && (
            <ListItem>
              <ListItemText primary={getIntRangeHint()} />
            </ListItem>
          )}
          {question.type === QuestionType.Scale && (
            <ListItem>
              <ListItemText
                primary={
                  question.selectOptions && question.selectOptions.length > 1
                    ? `Von \"${
                        question.selectOptions[0].value || "0"
                      }\" bis \"${
                        question.selectOptions[
                          question.selectOptions.length - 1
                        ].value || question.selectOptions.length
                      }\".`
                    : ""
                }
              />
            </ListItem>
          )}
          <ListItem>
            <Button onClick={openEdit}>
              <Edit /> Bearbeiten
            </Button>
            <Button onClick={openDelete}>
              <Delete /> Löschen
            </Button>
          </ListItem>
        </List>
      </Collapse>

      <EditQuestionDialog
        survey={survey}
        question={question}
        open={editOpen}
        onClose={() => {
          onDataChange();
          setEditOpen(false);
        }}
      />

      <ConfirmDialog
        title={"Frage löschen?"}
        body={
          "Wollen Sie diese Frage wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        }
        open={delOpen}
        onConfirm={deleteQ}
        onCancel={() => setDelOpen(false)}
      />
    </Box>
  );
}

