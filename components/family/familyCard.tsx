import FamilyDialog from "@/components/family/familyDialog";
import { FullFamily } from "@/types/prismaHelperTypes";
import { getFamilyString } from "@/utils/utils";
import { Paper, Typography } from "@mui/material";
import { isAfter } from "date-fns";
import { useState } from "react";

type FamilyCardProps = {
  family: FullFamily;
  onChange: () => void;
};

export function FamilyCard({ family, onChange }: FamilyCardProps) {
  const [open, setOpen] = useState(false);

  function handleClick() {
    setOpen(true);
  }

  function handleChange() {
    setOpen(false);
    onChange();
  }

  const closed =
    family.endOfCare && isAfter(Date.now(), new Date(family.endOfCare));

  return (
    <Paper
      sx={{
        p: ".5rem",
        ":hover": {
          backgroundColor: closed ? "error.light" : "primary.light",
          cursor: "pointer",
          transition: "ease-in-out",
          transitionDuration: "200ms",
        },
      }}
      onClick={handleClick}
      elevation={3}
    >
      <Typography variant="h6">
        Familie {family.number} {closed && "(Abgeschlossen)"}
      </Typography>
      <Typography variant="body1">{getFamilyString(family)}</Typography>

      <FamilyDialog initialFamily={family} open={open} onClose={handleChange} />
    </Paper>
  );
}

