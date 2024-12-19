import EditQuestionDialog from "@/components/editSurvey/editQuestion";
import EditStringDialog from "@/components/editSurvey/editStringDialog";
import ListItemQuestion from "@/components/editSurvey/listItemQuestion";
import useToast from "@/components/notifications/notificationContext";
import UnsavedChangesComponent from "@/components/response/unsavedChangesComponent";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import {
  IMoveQuestion,
  IMoveQuestionInput,
} from "@/pages/api/surveys/[survey]/moveQuestion";
import masterDataTypes from "@/pages/masterDataTypes";
import { FullQuestion, FullSurvey } from "@/types/prismaHelperTypes";
import { useMasterDataTypes } from "@/utils/apiHooks";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
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
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { MasterDataType, Prisma } from "@prisma/client";
import { compareAsc } from "date-fns";
import { useEffect, useState } from "react";

type EditSurveyComponentProps = {
  survey: FullSurvey;
  onChange: () => void;
};

export default function EditSurveyComponent({
  survey,
  onChange,
}: EditSurveyComponentProps) {
  const { addToast } = useToast();

  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>(survey.name);
  const [description, setDescription] = useState<string>(survey.description);
  const [hasFamily, setHasFamily] = useState<boolean>(survey.hasFamily);
  const [hasMasterData, setHasMasterData] = useState<boolean>(
    survey.hasMasterData
  );

  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const [editNameOpen, setEditNameOpen] = useState<boolean>(false);
  const [editDescOpen, setEditDescOpen] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  function handleAdd() {
    setAddOpen(true);
  }

  const { masterDataTypes } = useMasterDataTypes();

  const [selectedMdt, setSelectedMdt] =
    useState<(typeof masterDataTypes)[number]>();

  useEffect(
    () =>
      setSelectedMdt(
        masterDataTypes?.find((mdt) => mdt.id === survey?.masterDataType?.id)
      ),
    [masterDataTypes]
  );

  async function handleSaveChanges() {
    const res = await apiPostJson<ISurvey, Prisma.SurveyUpdateInput>(
      `/api/surveys/${survey.id}`,
      {
        name,
        description,
        hasFamily,
        hasMasterData,
        masterDataType: selectedMdt
          ? { connect: { id: selectedMdt.id } }
          : undefined,
      }
    );
    if (res instanceof FetchError)
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error) {
        addToast({
          message: `Beim Speichern ist ein Fehler aufgetreten: ${res.error}`,
          severity: "error",
        });
        handleCancelChanges();
        return;
      }
      addToast({ message: "Änderungen gespeichert.", severity: "success" });
      setUnsavedChanges(false);
    }
    onChange();
  }

  const handleMdtChange = (e: SelectChangeEvent) => {
    setSelectedMdt(masterDataTypes.find((mdt) => mdt.name === e.target.value));
    setUnsavedChanges(true);
  };

  const errors = hasMasterData && !selectedMdt;

  async function moveUp(question: FullQuestion) {
    const res = await apiPostJson<IMoveQuestion>(
      `/api/surveys/${survey.id}/moveQuestion`,
      {
        newPosition: question.numberInSurvey - 1,
        questionId: question.id,
      } as IMoveQuestionInput
    );
    onChange();

    if (res.error) {
      if (res.error === "NEW_POSITION_OUT_OF_RANGE")
        addToast({
          message: "Frage schon am Ende/Anfang",
          severity: "warning",
        });
      else addToast({ message: `Fehler: ${res.error}`, severity: "error" });
    } else addToast({ message: "Frage verschoben", severity: "success" });
  }

  async function moveDown(question: FullQuestion) {
    const res = await apiPostJson<IMoveQuestion>(
      `/api/surveys/${survey.id}/moveQuestion`,
      {
        newPosition: question.numberInSurvey + 1,
        questionId: question.id,
      } as IMoveQuestionInput
    );

    onChange();
    if (res.error) {
      if (res.error === "NEW_POSITION_OUT_OF_RANGE")
        addToast({
          message: "Frage schon am Ende/Anfang",
          severity: "warning",
        });
      else addToast({ message: `Fehler: ${res.error}`, severity: "error" });
    } else addToast({ message: "Frage verschoben", severity: "success" });
  }

  function handleCancelChanges() {
    setName(survey.name);
    setDescription(survey.description);
    setHasFamily(survey.hasFamily);
    setHasMasterData(survey.hasMasterData);
    setUnsavedChanges(false);
  }

  return (
    <Box>
      <UnsavedChangesComponent
        unsavedChanges={unsavedChanges}
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
        errors={errors}
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <FormControlLabel
          label="Hat Stammdaten"
          control={
            <Checkbox
              checked={hasMasterData}
              onChange={(e) => {
                setHasMasterData(e.target.checked);
                setUnsavedChanges(survey.hasMasterData !== e.target.checked);
              }}
            />
          }
        />
        {hasMasterData && (
          <Select
            sx={{ mb: "2rem" }}
            onChange={handleMdtChange}
            value={selectedMdt ? selectedMdt.name : ""}
          >
            {masterDataTypes?.map((mdt) => (
              <MenuItem key={mdt.id} value={mdt.name}>
                {mdt.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>
      <List sx={{ width: "100%" }}>
        {survey.questions &&
          survey.questions
            .sort((a, b) => {
              if (a.numberInSurvey && b.numberInSurvey)
                return a.numberInSurvey - b.numberInSurvey;
              else
                return compareAsc(new Date(a.createdAt), new Date(b.createdAt));
            })
            .map((q, i) => (
              <ListItemQuestion
                key={i}
                moveUp={() => moveUp(q)}
                moveDown={() => moveDown(q)}
                question={q}
                survey={survey}
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
        survey={survey}
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

