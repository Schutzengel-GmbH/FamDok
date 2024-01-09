import {
  Caregiver,
  Child,
  Disability,
  Education,
  Gender,
} from "@prisma/client";
import {
  Alert,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import FindFamilyDialog from "@/components/family/findFamilyDialog";
import { getAge } from "@/utils/utils";
import { FullFamily } from "@/types/prismaHelperTypes";
import FamilyDialog from "@/components/family/familyDialog";
import { GetResult } from "@prisma/client/runtime";
import { useFamily } from "@/utils/apiHooks";

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
  const [number, setNumber] = useState<number>(relation?.family?.number);
  const [currentRelationId, setCurrentRelationId] = useState<string>(
    relation.caregiver?.id || relation.child?.id || "none"
  );

  const { family } = useFamily(number);

  useEffect(() => {
    onChange({ family, child: null, caregiver: null });
  }, [family]);

  function handleRelationChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    setCurrentRelationId(value);

    const caregiver = relation.family.caregivers.find((c) => c.id === value);
    const child = relation.family.children.find((c) => c.id === value);

    if (value === "none") {
      onChange({ ...relation, caregiver: null, child: null });
    }
    if (caregiver) {
      onChange({ ...relation, caregiver, child: null });
    }
    if (child) {
      onChange({ ...relation, caregiver: null, child });
    }
  }

  return (
    <>
      <Paper sx={{ p: ".5rem" }} elevation={3}>
        {relation.family && (
          <>
            <Typography variant={"h6"}>
              Familie {relation.family.number}
            </Typography>
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
              {relation.family.caregivers?.map((c, i) => (
                <FormControlLabel
                  key={c.id}
                  value={c.id}
                  control={<Radio />}
                  label={`Bezugsperson ${c.number}${
                    c.dateOfBirth ? `, Alter: ${getAge(c.dateOfBirth)}` : ""
                  }`}
                />
              ))}
              {relation.family.children?.map((c, i) => (
                <FormControlLabel
                  key={c.id}
                  value={c.id}
                  control={<Radio />}
                  label={`Kind ${c.number}${
                    c.dateOfBirth ? `, Alter: ${getAge(c.dateOfBirth)}` : ""
                  }`}
                />
              ))}
            </RadioGroup>
          </>
        )}

        <Typography variant="h6">
          {relation.family ? "Andere Familie auswählen" : "Familie auswählen"}
        </Typography>
        {!relation.family && (
          <Alert severity="error" key={"relationMissing"}>
            Keine Familie ausgewählt.
          </Alert>
        )}
        <TextField
          sx={{ mt: ".5rem" }}
          label="Familiennummer"
          value={number || ""}
          onChange={(e) => setNumber(parseInt(e.target.value))}
        />
      </Paper>
    </>
  );
}

