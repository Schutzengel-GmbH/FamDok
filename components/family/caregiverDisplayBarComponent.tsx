import { Paper, Box, Typography } from "@mui/material";
import { Caregiver } from "@prisma/client";
import { getAge } from "@/utils/utils";

interface CaregiverDisplayBarProps {
  caregiver: Partial<Caregiver>;
}

export default function CaregiverDisplayBar({
  caregiver,
}: CaregiverDisplayBarProps) {
  return (
    <Box
      sx={{
        mt: "1rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        p: ".25rem",
      }}
    >
      <Typography sx={{ ml: "1rem", fontWeight: "bold" }} variant="body1">
        {`Bezugsperson ${caregiver.number}` || "ungespeicherte Bezugsperson"}
      </Typography>
      <Typography sx={{ ml: "1rem", fontWeight: "bold" }} variant="body1">
        {caregiver.dateOfBirth
          ? `Alter: ${getAge(new Date(caregiver.dateOfBirth))}`
          : "Alter unbekannt"}
      </Typography>
    </Box>
  );
}
