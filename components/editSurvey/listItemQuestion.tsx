import { Delete, Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
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
import useNotification from "@/components/utilityComponents/notificationContext";
import { FetchError, apiDelete } from "@/utils/fetchApiUtils";
import { IQuestion } from "@/pages/api/surveys/[survey]/questions/[question]";

export interface ListItemQuestionProps {
  question: Prisma.QuestionGetPayload<{ include: { selectOptions: true } }>;
  surveyId: string;
  onDataChange: () => void;
}

export default function ListItemQuestion({
  question,
  surveyId,
  onDataChange,
}: ListItemQuestionProps) {
  const { addAlert } = useNotification();

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

  async function deleteQ() {
    const res = await apiDelete<IQuestion>(
      `/api/surveys/${surveyId}/questions/${question.id}`
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
        addAlert({ message: "Frage gelöscht", severity: "success" });
        onDataChange();
      }
    }
    setDelOpen(false);
  }

  return (
    <>
      <ListItemButton onClick={handleOpen}>
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        <ListItemText
          primary={
            question.questionTitle
              ? question.questionTitle
              : question.questionText
          }
        />
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
              <ListItemText
                primary={`Von ${question.intRangeLow || "0"} bis ${
                  question.intRangeHigh || "0"
                }`}
              />
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
        surveyId={surveyId}
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
    </>
  );
}
