import { Caregiver, Child } from "@prisma/client";
import {
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import FindFamilyDialog from "../family/findFamilyDialog";
import { getAge } from "../../utils/utils";
import { FullFamily } from "../../types/prismaHelperTypes";

export type ResponseRelation = {
  family: FullFamily;
  caregiver: Caregiver;
  child: Child;
};

type ResponseRelationComponentProps = {
  relation: ResponseRelation;
  onChange: (responseRelation: ResponseRelation) => void;
};

export default function ResponseRelationComponent({
  relation,
  onChange,
}: ResponseRelationComponentProps) {
  const [findFamilyOpen, setFindFamilyOpen] = useState<boolean>(false);
  const [currentRelationId, setCurrentRelationId] = useState<string>(
    relation.caregiver?.id || relation.child?.id || "none"
  );

  function handleFindClick() {
    setFindFamilyOpen(true);
  }
  function handleCreateClick() {}
  function handleRemoveClick() {
    onChange({ family: undefined, caregiver: undefined, child: undefined });
  }

  function handleSelectFamily(family: FullFamily) {
    if (family && relation?.family?.id !== family.id) {
      onChange({ family, caregiver: undefined, child: undefined });
    }
    setFindFamilyOpen(false);
  }

  function handleRelationChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    setCurrentRelationId(value);

    const caregiver = relation.family.caregivers.find((c) => c.id === value);
    const child = relation.family.children.find((c) => c.id === value);

    if (value === "none") {
      onChange({ ...relation, caregiver: undefined, child: undefined });
    }
    if (caregiver) {
      onChange({ ...relation, caregiver, child: undefined });
    }
    if (child) {
      onChange({ ...relation, caregiver: undefined, child });
    }
  }

  return (
    <>
      <FindFamilyDialog
        open={findFamilyOpen}
        onConfirm={handleSelectFamily}
        onCancel={() => setFindFamilyOpen(false)}
      />

      <Paper sx={{ p: ".5rem" }} elevation={3}>
        {relation.family && (
          <RadioGroup
            sx={{ m: "1rem" }}
            value={currentRelationId}
            onChange={handleRelationChange}
          >
            <FormControlLabel
              value={"none"}
              control={<Radio />}
              label={"Ganze Familie"}
            />
            {relation.family.caregivers.map((c, i) => (
              <FormControlLabel
                value={c.id}
                control={<Radio />}
                label={`Bezugsperson ${c.number}, Alter: ${getAge(
                  c.dateOfBirth
                )}`}
              />
            ))}
            {relation.family.children.map((c, i) => (
              <FormControlLabel
                value={c.id}
                control={<Radio />}
                label={`Kind ${c.number}, Alter: ${getAge(c.dateOfBirth)}`}
              />
            ))}
          </RadioGroup>
        )}

        <Typography variant="h6">
          {relation.family ? "Andere Familie auswählen" : "Familie auswählen"}
        </Typography>
        <Button onClick={handleFindClick}>Familie finden</Button>
        <Button onClick={handleCreateClick}>Familie erstellen</Button>
        {relation.family && (
          <Button onClick={handleRemoveClick}>Verbindung aufheben</Button>
        )}
      </Paper>
    </>
  );
}
