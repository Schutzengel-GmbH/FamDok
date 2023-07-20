import EditQuestionDialog from "@/components/editSurvey/editQuestion";
import EditStringDialog from "@/components/editSurvey/editStringDialog";
import ListItemQuestion from "@/components/editSurvey/listItemQuestion";
import UnsavedChangesComponent from "@/components/response/unsavedChangesComponent";
import useNotification from "@/components/utilityComponents/notificationContext";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { JsonHeaders } from "@/utils/utils";
import { Add, Edit } from "@mui/icons-material";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { compareAsc } from "date-fns";
import { useState } from "react";

type EditSurveyComponentProps = {
  survey: FullSurvey;
  onChange: () => void;
};

export default function EditSurveyComponent({
  survey,
  onChange,
}: EditSurveyComponentProps) {
  const { addAlert } = useNotification();

  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>(survey.name);
  const [description, setDescription] = useState<string>(survey.description);
  const [hasFamily, setHasFamily] = useState<boolean>(survey.hasFamily);

  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const [editNameOpen, setEditNameOpen] = useState<boolean>(false);
  const [editDescOpen, setEditDescOpen] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  function handleAdd() {
    setAddOpen(true);
  }

  async function handleSaveChanges() {
    const res = await fetch(`/api/surveys/${survey.id}`, {
      method: "POST",
      body: JSON.stringify({ name, description }),
      headers: JsonHeaders,
    });
    if (res.status !== 200) {
      addAlert({
        message: `Beim Speichern ist ein Fehler aufgetreten: ${
          res.statusText || res.status
        }`,
        severity: "error",
      });
      handleCancelChanges();
      return;
    }
    addAlert({ message: "Änderungen gespeichert.", severity: "success" });
    setUnsavedChanges(false);
  }

  function handleCancelChanges() {
    setName(survey.name);
    setDescription(survey.description);
    setUnsavedChanges(false);
  }

  return (
    <Box>
      <UnsavedChangesComponent
        unsavedChanges={unsavedChanges}
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
      />
      {error && (
        <Alert severity="error">
          <strong>Fehler: </strong>
          {error}
        </Alert>
      )}
      <Typography variant="h5">
        {name}{" "}
        <IconButton onClick={() => setEditNameOpen(true)}>
          <Edit />
        </IconButton>
      </Typography>
      <Typography sx={{ marginBottom: "1rem" }}>
        {description || ""}
        <IconButton onClick={() => setEditDescOpen(true)}>
          <Edit />
        </IconButton>
      </Typography>
      <FormControlLabel
        label="Hat Stammdaten"
        control={
          <Checkbox
            checked={hasFamily}
            onChange={(e) => {
              setHasFamily(e.target.checked);
              setUnsavedChanges(survey.hasFamily !== e.target.checked);
            }}
          />
        }
      />

      <List sx={{ width: "100%" }}>
        {survey.questions &&
          survey.questions
            .sort((q1, q2) =>
              compareAsc(new Date(q1.createdAt), new Date(q2.createdAt))
            )
            .map((q) => (
              <ListItemQuestion
                key={q.id}
                question={q}
                surveyId={survey.id}
                onDataChange={onChange}
              />
            ))}
        <ListItemButton onClick={handleAdd}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary={"Item Hinzufügen"} />
        </ListItemButton>
      </List>

      <EditQuestionDialog
        surveyId={survey.id}
        open={addOpen}
        onClose={() => {
          onChange();
          setAddOpen(false);
        }}
      />

      <EditStringDialog
        title={"Namen der Survey ändern"}
        open={editNameOpen}
        initialValue={name}
        valueChanged={(n) => {
          setName(n);
          setUnsavedChanges(n !== survey.name);
        }}
        onClose={() => setEditNameOpen(false)}
      />

      <EditStringDialog
        title={"Beschreibung der Survey ändern"}
        open={editDescOpen}
        initialValue={description}
        valueChanged={(d) => {
          setDescription(d);
          setUnsavedChanges(d !== survey.description);
        }}
        onClose={() => setEditDescOpen(false)}
      />
    </Box>
  );
}
