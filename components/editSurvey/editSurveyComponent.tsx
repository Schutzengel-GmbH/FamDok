import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { FullSurvey } from "../../types/prismaHelperTypes";
import { Add, Edit } from "@mui/icons-material";
import { compareAsc } from "date-fns";
import error from "next/error";
import EditStringDialog from "./editStringDialog";
import { useState } from "react";
import UnsavedChangesComponent from "../response/unsavedChangesComponent";
import useNotification from "../utilityComponents/notificationContext";

type EditSurveyComponentProps = {
  survey: FullSurvey;
};

export default function EditSurveyComponent({
  survey,
}: EditSurveyComponentProps) {
  const { addAlert } = useNotification();

  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>(survey.name);
  const [description, setDescription] = useState<string>(survey.description);
  const [hasFamily, setHasFamily] = useState<boolean>(survey.hasFamily);

  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const [editNameOpen, setEditNameOpen] = useState<boolean>(false);
  const [editDescOpen, setEditDescOpen] = useState<boolean>(false);

  function handleAdd() {}

  async function handleSaveChanges() {}

  function handleCancelChanges() {}

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
            .map((q) => <>{q.questionTitle}</>)}
        <ListItemButton onClick={handleAdd}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary={"Item Hinzufügen"} />
        </ListItemButton>
      </List>

      {/* <EditQuestionDialog
        surveyId={survey.id}
        open={addOpen}
        onClose={() => {
          onDataChange();
          setAddOpen(false);
        }}
      /> */}

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
